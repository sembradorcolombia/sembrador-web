import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error("Missing Supabase environment variables");
}

/**
 * Auth persistence is configured explicitly rather than left on defaults.
 *
 * The session lives in `localStorage`, so it survives browser restarts — which
 * is what "sign in again after a week" presupposes. The cost is that any script
 * running on this origin can read the token; the real fix for that is an
 * httpOnly cookie, which needs a server-side auth flow this SPA does not have.
 * What bounds the damage is the Supabase project's 7-day session time-box: it
 * limits how long a stolen token stays useful. Storage is not "hardened" here,
 * the token's lifetime is.
 *
 * `detectSessionInUrl` is off because there is no OAuth or magic-link callback
 * in this app — leaving it on parses every page load's URL fragment for auth
 * material for no reason.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
	auth: {
		persistSession: true,
		storage: window.localStorage,
		autoRefreshToken: true,
		detectSessionInUrl: false,
	},
});
