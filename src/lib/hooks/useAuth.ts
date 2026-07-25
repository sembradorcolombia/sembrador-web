import type { Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { consumeDeliberateSignOut } from "../services/auth";
import { supabase } from "../supabase";

export interface AuthState {
	session: Session | null;
	user: User | null;
	isAdmin: boolean;
	isLoading: boolean;
}

export interface UseAuthOptions {
	/**
	 * Called when a session ends on its own — a failed token refresh or a
	 * server-side expiry — but not when the admin signs out deliberately.
	 * Wired to a redirect so the dashboard does not sit there fully rendered
	 * on top of a session that no longer exists.
	 */
	onSessionExpired?: () => void;
}

/**
 * Reactive auth state for the UI: the header email, the router context, and
 * anything else that needs to re-render when the session changes.
 *
 * This is display state, NOT an authorization check. `isAdmin` is decoded from
 * the locally stored token without contacting the auth server, so it says what
 * the browser believes, not what is true. Authorization decisions belong in a
 * route's `beforeLoad` via `verifyAdminSession()`, which validates against
 * Supabase. Do not gate access on `useAuth().isAdmin`.
 *
 * It stays local on purpose: this hook runs on every app mount, including
 * public routes, and must not add a blocking request there.
 */
export function useAuth(options: UseAuthOptions = {}): AuthState {
	const [session, setSession] = useState<Session | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const { onSessionExpired } = options;

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setIsLoading(false);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			setSession(session);
			setIsLoading(false);

			if (event === "SIGNED_OUT" && !consumeDeliberateSignOut()) {
				onSessionExpired?.();
			}
		});

		return () => subscription.unsubscribe();
	}, [onSessionExpired]);

	const user = session?.user ?? null;
	const isAdmin = user?.app_metadata?.is_admin === true;

	return { session, user, isAdmin, isLoading };
}
