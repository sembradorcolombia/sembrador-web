import type { Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export interface AuthState {
	session: Session | null;
	user: User | null;
	isAdmin: boolean;
	isLoading: boolean;
}

export function useAuth(): AuthState {
	const [session, setSession] = useState<Session | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setIsLoading(false);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setIsLoading(false);
		});

		return () => subscription.unsubscribe();
	}, []);

	const user = session?.user ?? null;
	const isAdmin = user?.app_metadata?.is_admin === true;

	return { session, user, isAdmin, isLoading };
}
