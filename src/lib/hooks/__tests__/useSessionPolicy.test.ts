/**
 * Tests for the timer that enforces session age limits while the app is open —
 * the case the route guard cannot cover, since it only runs on navigation.
 */
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const evaluateSessionAge = vi.fn();
const expireSession = vi.fn();
const markActivity = vi.fn();

vi.mock("@/lib/services/sessionPolicy", () => ({
	evaluateSessionAge: () => evaluateSessionAge(),
	expireSession: () => expireSession(),
	markActivity: (now?: number) => markActivity(now),
}));

import { useSessionPolicy } from "../useSessionPolicy";

beforeEach(() => {
	vi.clearAllMocks();
	vi.useFakeTimers();
	evaluateSessionAge.mockReturnValue(null);
	expireSession.mockResolvedValue(undefined);
});

afterEach(() => {
	vi.useRealTimers();
});

describe("useSessionPolicy", () => {
	it("does nothing while there is no session", () => {
		renderHook(() => useSessionPolicy(false));

		act(() => {
			vi.advanceTimersByTime(5 * 60_000);
		});

		expect(evaluateSessionAge).not.toHaveBeenCalled();
	});

	it("leaves a live session alone", () => {
		renderHook(() => useSessionPolicy(true));

		act(() => {
			vi.advanceTimersByTime(5 * 60_000);
		});

		expect(evaluateSessionAge).toHaveBeenCalled();
		expect(expireSession).not.toHaveBeenCalled();
	});

	it("ends a session that ages out with the tab left open", async () => {
		const onExpired = vi.fn();
		renderHook(() => useSessionPolicy(true, { onExpired }));
		evaluateSessionAge.mockReturnValue("idle");

		await act(async () => {
			await vi.advanceTimersByTimeAsync(60_000);
		});

		expect(expireSession).toHaveBeenCalled();
		expect(onExpired).toHaveBeenCalled();
	});

	it("redirects even when the sign-out itself fails", async () => {
		// Regression: the redirect used to ride on the SIGNED_OUT event, which
		// never arrives if expireSession() cannot reach the server or storage —
		// leaving the dashboard rendered on a session that is over.
		const onExpired = vi.fn();
		expireSession.mockRejectedValue(new Error("network down"));
		renderHook(() => useSessionPolicy(true, { onExpired }));
		evaluateSessionAge.mockReturnValue("absolute");

		await act(async () => {
			await vi.advanceTimersByTimeAsync(60_000);
		});

		expect(onExpired).toHaveBeenCalled();
	});

	it("does not start a second sign-out while one is in flight", async () => {
		renderHook(() => useSessionPolicy(true, { onExpired: vi.fn() }));
		evaluateSessionAge.mockReturnValue("idle");

		await act(async () => {
			await vi.advanceTimersByTimeAsync(5 * 60_000);
		});

		expect(expireSession).toHaveBeenCalledTimes(1);
	});

	it.each(["keydown", "pointerdown", "wheel"])(
		"records %s as activity",
		(eventName) => {
			renderHook(() => useSessionPolicy(true));

			act(() => {
				window.dispatchEvent(new Event(eventName));
			});

			// Scrolling counts too: reading a long subscriber list without
			// clicking is use, not idleness.
			expect(markActivity).toHaveBeenCalledTimes(1);
		},
	);

	it("throttles repeated input to one write", () => {
		renderHook(() => useSessionPolicy(true));

		act(() => {
			for (let i = 0; i < 20; i++) {
				window.dispatchEvent(new Event("keydown"));
			}
		});

		expect(markActivity).toHaveBeenCalledTimes(1);

		act(() => {
			vi.advanceTimersByTime(31_000);
			window.dispatchEvent(new Event("pointerdown"));
		});

		expect(markActivity).toHaveBeenCalledTimes(2);
	});

	it("re-checks when a backgrounded tab becomes visible again", () => {
		renderHook(() => useSessionPolicy(true));
		evaluateSessionAge.mockClear();

		act(() => {
			document.dispatchEvent(new Event("visibilitychange"));
		});

		expect(evaluateSessionAge).toHaveBeenCalled();
	});

	it("stops checking once unmounted", () => {
		const { unmount } = renderHook(() => useSessionPolicy(true));
		unmount();
		evaluateSessionAge.mockClear();

		act(() => {
			vi.advanceTimersByTime(5 * 60_000);
			window.dispatchEvent(new Event("keydown"));
		});

		expect(evaluateSessionAge).not.toHaveBeenCalled();
		expect(markActivity).not.toHaveBeenCalled();
	});
});
