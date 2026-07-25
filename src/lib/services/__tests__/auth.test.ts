/**
 * Tests for the server-validated admin check that both route guards use.
 * The point of these is that every failure mode denies access — the guard must
 * never fall through to "allow".
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const getUser = vi.fn();
const getSession = vi.fn();
const signOutClient = vi.fn();
const signInWithPassword = vi.fn();

vi.mock("@/lib/supabase", () => ({
	supabase: {
		auth: {
			getUser: () => getUser(),
			getSession: () => getSession(),
			signOut: (opts?: { scope?: string }) => signOutClient(opts),
			signInWithPassword: (creds: unknown) => signInWithPassword(creds),
		},
	},
}));

import {
	consumeDeliberateSignOut,
	signIn,
	signOut,
	verifyAdminSession,
} from "../auth";
import { ABSOLUTE_SESSION_MS, markSignedIn } from "../sessionPolicy";

const adminUser = { id: "u-1", app_metadata: { is_admin: true } };
const plainUser = { id: "u-2", app_metadata: {} };

beforeEach(() => {
	vi.clearAllMocks();
	window.localStorage.clear();
	getSession.mockResolvedValue({ data: { session: null } });
	signOutClient.mockResolvedValue({ error: null });
	// Drain any flag left by a previous test.
	consumeDeliberateSignOut();
	// Most cases are about the server's verdict, not the session's age, so start
	// from a session that is comfortably inside both limits.
	markSignedIn();
});

describe("verifyAdminSession", () => {
	it("admits a server-validated admin", async () => {
		getUser.mockResolvedValue({ data: { user: adminUser }, error: null });

		await expect(verifyAdminSession()).resolves.toBe("admin");
		expect(signOutClient).not.toHaveBeenCalled();
	});

	it("rejects an authenticated non-admin and clears the session", async () => {
		getUser.mockResolvedValue({ data: { user: plainUser }, error: null });
		getSession.mockResolvedValue({ data: { session: { user: plainUser } } });

		await expect(verifyAdminSession()).resolves.toBe("rejected");
		expect(signOutClient).toHaveBeenCalledWith({ scope: "local" });
	});

	it("reports an anonymous visitor without clearing anything", async () => {
		getUser.mockResolvedValue({
			data: { user: null },
			error: { message: "Auth session missing!" },
		});

		await expect(verifyAdminSession()).resolves.toBe("anonymous");
		expect(signOutClient).not.toHaveBeenCalled();
	});

	it("rejects a stored session the server refuses", async () => {
		// The tampering case: storage claims admin, the server disagrees.
		getUser.mockResolvedValue({
			data: { user: null },
			error: { message: "invalid JWT" },
		});
		getSession.mockResolvedValue({
			data: { session: { user: adminUser } },
		});

		await expect(verifyAdminSession()).resolves.toBe("rejected");
		expect(signOutClient).toHaveBeenCalledWith({ scope: "local" });
	});

	it("fails closed when the validation request throws", async () => {
		getUser.mockRejectedValue(new Error("network down"));

		await expect(verifyAdminSession()).resolves.toBe("rejected");
		expect(signOutClient).toHaveBeenCalledWith({ scope: "local" });
	});

	it("still denies when clearing the session itself fails", async () => {
		getUser.mockRejectedValue(new Error("network down"));
		signOutClient.mockRejectedValue(new Error("storage unavailable"));

		await expect(verifyAdminSession()).resolves.toBe("rejected");
	});

	it("rejects a session past its age limit before contacting the server", async () => {
		markSignedIn(Date.now() - ABSOLUTE_SESSION_MS - 1000);
		getSession.mockResolvedValue({ data: { session: { user: adminUser } } });
		getUser.mockResolvedValue({ data: { user: adminUser }, error: null });

		await expect(verifyAdminSession()).resolves.toBe("rejected");
		// The token is still valid at Supabase — the age limit is what ends it,
		// and it ends it globally rather than just dropping local storage.
		expect(getUser).not.toHaveBeenCalled();
		expect(signOutClient).toHaveBeenCalledWith({ scope: "global" });
	});

	it("still reports rejected when getUser() clears the session itself", async () => {
		// Regression: supabase-js refreshes an expired access token inside
		// getUser(), and wipes storage when that refresh is refused. Reading the
		// session again afterwards sees nothing and would call this "anonymous",
		// dropping the expiry notice on the most common expiry path of all.
		getSession
			.mockResolvedValueOnce({ data: { session: { user: adminUser } } })
			.mockResolvedValueOnce({ data: { session: null } });
		getUser.mockResolvedValue({
			data: { user: null },
			error: { message: "Invalid Refresh Token" },
		});

		await expect(verifyAdminSession()).resolves.toBe("rejected");
	});

	it("does not apply age limits when there is no session to age", async () => {
		window.localStorage.clear();
		getUser.mockResolvedValue({
			data: { user: null },
			error: { message: "Auth session missing!" },
		});

		await expect(verifyAdminSession()).resolves.toBe("anonymous");
		expect(signOutClient).not.toHaveBeenCalled();
	});

	it("does not admit a user carrying a non-boolean admin claim", async () => {
		getUser.mockResolvedValue({
			data: { user: { id: "u-3", app_metadata: { is_admin: "true" } } },
			error: null,
		});
		getSession.mockResolvedValue({ data: { session: { user: {} } } });

		await expect(verifyAdminSession()).resolves.toBe("rejected");
	});
});

describe("deliberate sign-out tracking", () => {
	it("flags a sign-out started by the user, once", async () => {
		await signOut();

		expect(consumeDeliberateSignOut()).toBe(true);
		expect(consumeDeliberateSignOut()).toBe(false);
	});

	it("does not flag anything when no sign-out happened", () => {
		expect(consumeDeliberateSignOut()).toBe(false);
	});

	it("leaves the flag down when the sign-out call fails", async () => {
		signOutClient.mockResolvedValue({ error: new Error("nope") });

		await expect(signOut()).rejects.toThrow("nope");
		expect(consumeDeliberateSignOut()).toBe(false);
	});

	it("clears a stale flag on sign-in", async () => {
		await signOut();
		signInWithPassword.mockResolvedValue({ data: {}, error: null });

		await signIn("admin@example.com", "pw");

		expect(consumeDeliberateSignOut()).toBe(false);
	});
});
