import { supabase } from "../supabase";
import {
	clearSessionMarkers,
	evaluateSessionAge,
	expireSession,
	markActivity,
	markSignedIn,
} from "./sessionPolicy";

/**
 * Outcome of validating the stored session against the auth server.
 *
 * `anonymous` and `rejected` both deny access, but they are not the same event:
 * only `rejected` means a session existed and died, which is what earns the
 * "tu sesión expiró" notice on `/login`. Someone who never signed in should not
 * be told their session expired.
 */
export type AdminSessionStatus = "admin" | "rejected" | "anonymous";

/**
 * Verifies admin status with the auth server.
 *
 * This is the authorization check. Unlike `getSession()`, which decodes
 * whatever sits in `localStorage` without a round-trip or a signature check,
 * `getUser()` validates the token with Supabase and returns the authoritative
 * user record — so a hand-edited stored session claiming `is_admin` fails here.
 *
 * Fails closed: any error, network failure, or missing user denies access. When
 * a session existed but did not pass, it is cleared locally so the dead token
 * is not presented again on the next navigation.
 */
export async function verifyAdminSession(): Promise<AdminSessionStatus> {
	try {
		// Age limits are checked before the round-trip: a session past its cap is
		// rejected here even if the token itself is still valid at Supabase.
		const {
			data: { session: storedSession },
		} = await supabase.auth.getSession();

		if (storedSession && evaluateSessionAge() !== null) {
			await expireSession();
			return "rejected";
		}

		const { data, error } = await supabase.auth.getUser();

		if (data?.user?.app_metadata?.is_admin === true && !error) {
			markActivity();
			return "admin";
		}

		// Decided from the session read BEFORE getUser(), not a fresh read:
		// getUser() refreshes an expired access token, and supabase-js clears
		// storage itself when that refresh is refused. Re-reading here would see
		// the wiped state and report "anonymous" for what is actually the most
		// common expiry — costing the admin the "tu sesión expiró" notice.
		if (!storedSession) return "anonymous";

		await clearLocalSession();
		return "rejected";
	} catch {
		await clearLocalSession();
		return "rejected";
	}
}

/**
 * Drops the stored session without calling the server.
 *
 * `scope: "local"` because a rejected session is already invalid server-side —
 * a global sign-out would either fail or needlessly revoke the user's other
 * devices. Errors are swallowed: this runs on paths that are already denying
 * access, and failing to clear storage must not turn into a thrown guard.
 */
async function clearLocalSession(): Promise<void> {
	clearSessionMarkers();
	try {
		await supabase.auth.signOut({ scope: "local" });
	} catch {
		// Nothing actionable — the caller is redirecting to /login regardless.
	}
}

/**
 * Set while a deliberate "Salir" is in flight.
 *
 * Supabase fires `SIGNED_OUT` both when the admin signs out on purpose and when
 * a token refresh fails, but only the second is an expiry — and only the second
 * should surface "tu sesión expiró". This flag is how the listener tells them
 * apart. It is read once and cleared; a leftover flag would at worst suppress
 * one expiry notice, so signing in clears it too.
 */
let deliberateSignOut = false;

/**
 * Returns whether the `SIGNED_OUT` currently being handled came from the user
 * pressing "Salir", clearing the flag as it reads.
 */
export function consumeDeliberateSignOut(): boolean {
	const wasDeliberate = deliberateSignOut;
	deliberateSignOut = false;
	return wasDeliberate;
}

export async function signIn(email: string, password: string) {
	deliberateSignOut = false;
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (error) throw error;
	markSignedIn();
	return data;
}

export async function signOut() {
	deliberateSignOut = true;
	const { error } = await supabase.auth.signOut();
	if (error) {
		deliberateSignOut = false;
		throw error;
	}
	clearSessionMarkers();
}
