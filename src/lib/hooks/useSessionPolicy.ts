import { useEffect } from "react";
import {
	evaluateSessionAge,
	expireSession,
	markActivity,
} from "../services/sessionPolicy";

/** How often the age limits are re-checked while the app is open. */
const CHECK_INTERVAL_MS = 60_000;

/** Floor between two activity writes, so typing does not hammer localStorage. */
const ACTIVITY_THROTTLE_MS = 30_000;

/**
 * User input that counts as activity. Scrolling is included: reading a long
 * subscriber list without clicking is use, not idleness.
 */
const ACTIVITY_EVENTS = ["pointerdown", "keydown", "wheel"] as const;

export interface UseSessionPolicyOptions {
	/**
	 * Called once a session has been expired by this hook. The redirect is
	 * driven from here rather than from the resulting `SIGNED_OUT` event,
	 * because `expireSession()` swallows sign-out failures — if the network and
	 * storage both fail, no event arrives and the dashboard would otherwise sit
	 * there fully rendered on a session that is over.
	 */
	onExpired?: () => void;
}

/**
 * Enforces the session age limits while the app is open.
 *
 * The route guard only runs on navigation, which would leave a dashboard open
 * on an unattended machine valid indefinitely — the exact case this policy
 * exists for. So the limits are also checked on a timer here.
 *
 * Activity means genuine user input. Token refreshes deliberately do not count:
 * they fire on a timer whenever a tab is open, so treating them as activity
 * would keep an abandoned tab alive forever.
 */
export function useSessionPolicy(
	enabled: boolean,
	options: UseSessionPolicyOptions = {},
): void {
	const { onExpired } = options;

	useEffect(() => {
		if (!enabled) return;

		let lastMarked = 0;
		let expiring = false;

		const handleActivity = () => {
			const now = Date.now();
			if (now - lastMarked < ACTIVITY_THROTTLE_MS) return;
			lastMarked = now;
			markActivity(now);
		};

		const checkExpiry = () => {
			// `expiring` guards against the interval firing again while the
			// sign-out is still in flight.
			if (expiring || evaluateSessionAge() === null) return;
			expiring = true;
			void expireSession()
				// The redirect must happen whether or not the sign-out succeeded.
				.catch(() => {})
				.finally(() => onExpired?.());
		};

		for (const event of ACTIVITY_EVENTS) {
			window.addEventListener(event, handleActivity, { passive: true });
		}
		const interval = window.setInterval(checkExpiry, CHECK_INTERVAL_MS);

		// A tab restored from the background may have slept through several
		// intervals, so re-check as soon as it becomes visible again.
		const handleVisibility = () => {
			if (document.visibilityState === "visible") checkExpiry();
		};
		document.addEventListener("visibilitychange", handleVisibility);

		return () => {
			for (const event of ACTIVITY_EVENTS) {
				window.removeEventListener(event, handleActivity);
			}
			document.removeEventListener("visibilitychange", handleVisibility);
			window.clearInterval(interval);
		};
	}, [enabled, onExpired]);
}
