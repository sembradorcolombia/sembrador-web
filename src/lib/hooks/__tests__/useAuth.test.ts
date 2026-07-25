/**
 * Tests for useAuth — in particular that a session dying while the app is open
 * clears state and signals expiry, while a deliberate "Salir" does not.
 */

import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

type Listener = (event: AuthChangeEvent, session: Session | null) => void;

const getSession = vi.fn();
const unsubscribe = vi.fn();
let listener: Listener | undefined;

vi.mock("@/lib/supabase", () => ({
	supabase: {
		auth: {
			getSession: () => getSession(),
			onAuthStateChange: (cb: Listener) => {
				listener = cb;
				return { data: { subscription: { unsubscribe } } };
			},
		},
	},
}));

const consumeDeliberateSignOut = vi.fn();

vi.mock("@/lib/services/auth", () => ({
	consumeDeliberateSignOut: () => consumeDeliberateSignOut(),
}));

import { useAuth } from "../useAuth";

const adminSession = {
	user: {
		id: "u-1",
		email: "admin@example.com",
		app_metadata: { is_admin: true },
	},
} as unknown as Session;

beforeEach(() => {
	vi.clearAllMocks();
	listener = undefined;
	getSession.mockResolvedValue({ data: { session: adminSession } });
	consumeDeliberateSignOut.mockReturnValue(false);
});

describe("useAuth", () => {
	it("exposes the stored session once loaded", async () => {
		const { result } = renderHook(() => useAuth());

		await waitFor(() => expect(result.current.isLoading).toBe(false));
		expect(result.current.user?.email).toBe("admin@example.com");
		expect(result.current.isAdmin).toBe(true);
	});

	it("clears state and signals expiry when the session dies on its own", async () => {
		const onSessionExpired = vi.fn();
		const { result } = renderHook(() => useAuth({ onSessionExpired }));
		await waitFor(() => expect(result.current.isLoading).toBe(false));

		act(() => listener?.("SIGNED_OUT", null));

		expect(result.current.session).toBeNull();
		expect(result.current.user).toBeNull();
		expect(result.current.isAdmin).toBe(false);
		expect(onSessionExpired).toHaveBeenCalledTimes(1);
	});

	it("stays quiet when the admin signed out deliberately", async () => {
		consumeDeliberateSignOut.mockReturnValue(true);
		const onSessionExpired = vi.fn();
		const { result } = renderHook(() => useAuth({ onSessionExpired }));
		await waitFor(() => expect(result.current.isLoading).toBe(false));

		act(() => listener?.("SIGNED_OUT", null));

		expect(result.current.session).toBeNull();
		expect(onSessionExpired).not.toHaveBeenCalled();
	});

	it("does not signal expiry on other auth events", async () => {
		const onSessionExpired = vi.fn();
		const { result } = renderHook(() => useAuth({ onSessionExpired }));
		await waitFor(() => expect(result.current.isLoading).toBe(false));

		act(() => listener?.("TOKEN_REFRESHED", adminSession));

		expect(onSessionExpired).not.toHaveBeenCalled();
		expect(result.current.isAdmin).toBe(true);
	});

	it("unsubscribes on unmount", async () => {
		const { result, unmount } = renderHook(() => useAuth());
		await waitFor(() => expect(result.current.isLoading).toBe(false));

		unmount();

		expect(unsubscribe).toHaveBeenCalled();
	});
});
