/**
 * Session lifetime policy, enforced in the browser.
 *
 * The provider-side equivalents (Supabase "Time-box user sessions" and
 * "Inactivity timeout") are paid-plan features and this project is on Free, so
 * these limits are computed from timestamps in `localStorage` instead.
 *
 * What that buys and what it does not:
 *
 * - When a limit trips, the app performs a real global sign-out, which revokes
 *   the refresh token at Supabase. The session is then dead server-side too —
 *   this is not a UI-only gesture.
 * - The trigger, however, is client-side. Someone who edits these timestamps
 *   before a limit fires can postpone it, and a token already exfiltrated by
 *   XSS never runs this code at all. Against those, only a provider-enforced
 *   time-box helps.
 *
 * It does hold against the case that motivated the change: a dashboard left
 * signed in on a shared, borrowed, or lost device.
 */
import { supabase } from "../supabase";

export const ABSOLUTE_SESSION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
export const IDLE_TIMEOUT_MS = 8 * 60 * 60 * 1000; // 8 hours

const SIGNED_IN_AT_KEY = "sembrador.auth.signedInAt";
const LAST_ACTIVITY_KEY = "sembrador.auth.lastActivity";

export type SessionExpiry = null | "absolute" | "idle" | "unknown-age";

function readTimestamp(key: string): number | null {
	try {
		const raw = window.localStorage.getItem(key);
		if (!raw) return null;
		const value = Number(raw);
		return Number.isFinite(value) ? value : null;
	} catch {
		return null;
	}
}

function writeTimestamp(key: string, value: number): void {
	try {
		window.localStorage.setItem(key, String(value));
	} catch {
		// Storage unavailable (private mode, quota). evaluateSessionAge() treats
		// missing markers as expired, so failing to write denies rather than
		// grants — the safe direction.
	}
}

/** Starts both clocks. Called on a successful sign-in. */
export function markSignedIn(now = Date.now()): void {
	writeTimestamp(SIGNED_IN_AT_KEY, now);
	writeTimestamp(LAST_ACTIVITY_KEY, now);
}

/** Restarts the idle clock. The absolute clock is deliberately untouched. */
export function markActivity(now = Date.now()): void {
	writeTimestamp(LAST_ACTIVITY_KEY, now);
}

export function clearSessionMarkers(): void {
	try {
		window.localStorage.removeItem(SIGNED_IN_AT_KEY);
		window.localStorage.removeItem(LAST_ACTIVITY_KEY);
	} catch {
		// Nothing to do — the caller is signing out regardless.
	}
}

/**
 * Reports why the session should end, or `null` if it may continue.
 *
 * Missing markers return `"unknown-age"` and count as expired: a session whose
 * age cannot be established is one this policy cannot vouch for. In practice
 * that is a session created before this policy existed, which is exactly the
 * one-time re-login the change anticipated for current admins.
 */
export function evaluateSessionAge(now = Date.now()): SessionExpiry {
	const signedInAt = readTimestamp(SIGNED_IN_AT_KEY);
	const lastActivity = readTimestamp(LAST_ACTIVITY_KEY);

	if (signedInAt === null || lastActivity === null) return "unknown-age";
	if (now - signedInAt >= ABSOLUTE_SESSION_MS) return "absolute";
	if (now - lastActivity >= IDLE_TIMEOUT_MS) return "idle";
	return null;
}

/**
 * Ends an expired session for real.
 *
 * A global sign-out revokes the refresh token at Supabase, so the session does
 * not survive on another device or a copied token. It deliberately does not go
 * through `signOut()` in `auth.ts`: that one flags the sign-out as deliberate,
 * which would suppress the "tu sesión expiró" notice this path needs to show.
 */
export async function expireSession(): Promise<void> {
	clearSessionMarkers();
	try {
		await supabase.auth.signOut({ scope: "global" });
	} catch {
		// The token may already be rejected server-side; local state is cleared
		// either way and the caller redirects to /login.
		try {
			await supabase.auth.signOut({ scope: "local" });
		} catch {
			// Storage-level failure. Nothing further to attempt here.
		}
	}
}
