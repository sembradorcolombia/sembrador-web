## Why

Admin sessions on `/dashboard` currently never end. The Supabase client runs on defaults — session persisted to `localStorage` with auto-refresh — so a refresh token keeps renewing indefinitely. An admin who logs in once on a shared, borrowed, or lost device stays authenticated forever, and there is no way to age out a session that should no longer exist.

Two related weaknesses compound this. The route guards on `/dashboard` and `/login` branch on `supabase.auth.getSession()`, which reads and decodes the locally stored token **without validating it against the auth server** — the admin claim is trusted from client-controlled storage. And the session sits in `localStorage`, readable by any script that achieves XSS, with no expiry to limit the value of a stolen token.

The dashboard now exposes event subscriber data and (per the consolidation change) registrant names, emails, and phone numbers, so an unbounded admin session is a real exposure rather than a theoretical one.

## What Changes

- **Absolute session lifetime of 7 days.** On reaching the limit the app performs a global sign-out, revoking the refresh token at Supabase so the session ends server-side. Originally specified as Supabase's project-level time-box; that is a paid-plan feature and this project is on Free, so the limit is evaluated in the browser instead — see `design.md` for what that does and does not guarantee.
- **Idle timeout of 8 hours.** Same mechanism: a session unused for 8 hours is revoked before the 7-day cap is reached. Enforced both at the route guard and on a timer, so a dashboard left open on an unattended machine expires without needing a navigation.
- **Client-side expiry handling.** When the guard finds an expired or rejected session, redirect to `/login` with an explicit Spanish message ("Tu sesión expiró, vuelve a iniciar sesión") rather than a silent redirect or a blank error page.
- **Guards validate the admin claim against the auth server.** Replace `getSession()` with `getUser()` in the `/dashboard` and `/login` `beforeLoad` guards, so `app_metadata.is_admin` is verified rather than read from local storage.
- **Session storage hardening.** Review and explicitly configure the Supabase client's persistence (storage target, `persistSession`, `autoRefreshToken`, `detectSessionInUrl`) instead of relying on defaults, and document the XSS trade-off of the chosen option.
- **Stale local session cleanup.** When the auth server rejects a stored session, clear it locally so the app does not keep presenting a dead token.

**Note:** the client-side pieces are UX and defense-in-depth. Anything enforceable only in the browser is bypassable; the security guarantee comes from the Supabase project settings and from RLS.

## Capabilities

### New Capabilities

- `admin-session-policy`: Session lifetime rules for admin authentication — 7-day absolute expiry, idle timeout, expiry-driven redirect with user-visible messaging, and session persistence configuration.
- `admin-route-protection`: How `/dashboard` and `/login` verify the admin claim, including server-side validation of the session and handling of rejected or stale sessions.

### Modified Capabilities

<!-- None. No existing spec in openspec/specs/ covers authentication, session
     handling, or the admin route guards. -->

## Impact

- **Routes:** `/dashboard` and `/login` guards change. No new routes, no redirects, no URL changes. The `/login` page gains an expiry notice.
- **Modified code:** `src/lib/supabase.ts` (explicit auth client options), `src/routes/dashboard.tsx` and `src/routes/login.tsx` (`beforeLoad` guards), `src/routes/login.tsx` (expiry message), `src/lib/hooks/useAuth.ts` (react to `SIGNED_OUT` / `TOKEN_REFRESHED` failure), possibly `src/lib/services/auth.ts` (session validation helper).
- **New code:** `src/lib/services/sessionPolicy.ts` (age limits, marker storage, revoking sign-out) and `src/lib/hooks/useSessionPolicy.ts` (activity tracking and the periodic check).
- **Supabase project settings:** none. The provider-side time-box was the original plan but is unavailable on the Free plan; if the project ever moves to Pro, `sessionPolicy.ts` can be deleted in favour of the two dashboard settings.
- **Operational impact:** every currently signed-in admin will be forced to re-authenticate on their next visit, because sessions predating this change carry no sign-in timestamp and are treated as expired. There are few admins, so this is a notice rather than a migration.
- **Dependencies:** none new.
- **Bundle size:** negligible — configuration and guard logic only.
