/**
 * Tests for the browser-side session age limits that stand in for Supabase's
 * paid time-box and inactivity settings.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const signOutClient = vi.fn();

vi.mock("@/lib/supabase", () => ({
	supabase: {
		auth: { signOut: (opts?: { scope?: string }) => signOutClient(opts) },
	},
}));

import {
	ABSOLUTE_SESSION_MS,
	clearSessionMarkers,
	evaluateSessionAge,
	expireSession,
	IDLE_TIMEOUT_MS,
	markActivity,
	markSignedIn,
} from "../sessionPolicy";

const NOW = new Date("2026-07-25T12:00:00Z").getTime();

beforeEach(() => {
	vi.clearAllMocks();
	window.localStorage.clear();
	signOutClient.mockResolvedValue({ error: null });
	vi.useFakeTimers();
	vi.setSystemTime(NOW);
});

afterEach(() => {
	vi.useRealTimers();
});

describe("evaluateSessionAge", () => {
	it("allows a session inside both limits", () => {
		markSignedIn();

		expect(evaluateSessionAge()).toBeNull();
	});

	it("allows a session used just under the idle limit", () => {
		markSignedIn();

		expect(evaluateSessionAge(NOW + IDLE_TIMEOUT_MS - 1000)).toBeNull();
	});

	it("expires a session left idle past the limit", () => {
		markSignedIn();

		expect(evaluateSessionAge(NOW + IDLE_TIMEOUT_MS)).toBe("idle");
	});

	it("expires a session at the absolute cap regardless of activity", () => {
		markSignedIn();
		// Active right up to the cap — the absolute clock does not reset.
		markActivity(NOW + ABSOLUTE_SESSION_MS - 1000);

		expect(evaluateSessionAge(NOW + ABSOLUTE_SESSION_MS)).toBe("absolute");
	});

	it("restarts the idle window on activity without extending the cap", () => {
		markSignedIn();
		const sixHoursLater = NOW + 6 * 60 * 60 * 1000;
		markActivity(sixHoursLater);

		// Idle clock restarted...
		expect(
			evaluateSessionAge(sixHoursLater + IDLE_TIMEOUT_MS - 1000),
		).toBeNull();
		// ...but the 7-day cap still lands where it always would have.
		expect(evaluateSessionAge(NOW + ABSOLUTE_SESSION_MS)).toBe("absolute");
	});

	it("treats a session of unknown age as expired", () => {
		// No markers: a session predating this policy, or storage that was wiped.
		expect(evaluateSessionAge()).toBe("unknown-age");
	});

	it("treats corrupted markers as expired", () => {
		window.localStorage.setItem("sembrador.auth.signedInAt", "not-a-number");
		window.localStorage.setItem("sembrador.auth.lastActivity", String(NOW));

		expect(evaluateSessionAge()).toBe("unknown-age");
	});

	it("expires once the markers are cleared", () => {
		markSignedIn();
		clearSessionMarkers();

		expect(evaluateSessionAge()).toBe("unknown-age");
	});
});

describe("expireSession", () => {
	it("revokes the refresh token globally, not just locally", async () => {
		markSignedIn();

		await expireSession();

		// Global scope is the point: the session must not survive server-side.
		expect(signOutClient).toHaveBeenCalledWith({ scope: "global" });
		expect(evaluateSessionAge()).toBe("unknown-age");
	});

	it("falls back to a local sign-out when the server call fails", async () => {
		signOutClient.mockRejectedValueOnce(new Error("network down"));

		await expireSession();

		expect(signOutClient).toHaveBeenNthCalledWith(1, { scope: "global" });
		expect(signOutClient).toHaveBeenNthCalledWith(2, { scope: "local" });
	});

	it("clears markers even if every sign-out attempt fails", async () => {
		markSignedIn();
		signOutClient.mockRejectedValue(new Error("nope"));

		await expect(expireSession()).resolves.toBeUndefined();
		expect(evaluateSessionAge()).toBe("unknown-age");
	});
});
