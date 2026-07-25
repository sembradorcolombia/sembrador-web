## Why

Admin sessions on `/dashboard` currently never end. The Supabase client runs on defaults — session persisted to `localStorage` with auto-refresh — so a refresh token keeps renewing indefinitely. An admin who logs in once on a shared, borrowed, or lost device stays authenticated forever, and there is no way to age out a session that should no longer exist.

Two related weaknesses compound this. The route guards on `/dashboard` and `/login` branch on `supabase.auth.getSession()`, which reads and decodes the locally stored token **without validating it against the auth server** — the admin claim is trusted from client-controlled storage. And the session sits in `localStorage`, readable by any script that achieves XSS, with no expiry to limit the value of a stolen token.

The dashboard now exposes event subscriber data and (per the consolidation change) registrant names, emails, and phone numbers, so an unbounded admin session is a real exposure rather than a theoretical one.

## What Changes

- **Absolute session lifetime of 7 days.** Configure Supabase's project-level session time-box so refresh tokens stop working one week after login, forcing a fresh sign-in. This is the authoritative control — it holds regardless of what the client does.
- **Idle timeout.** Configure a Supabase inactivity timeout so a session that goes unused expires before the 7-day cap is reached.
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
- **Supabase project settings (outside this repo):** session time-box set to 7 days and an inactivity timeout enabled. These are the enforcing change; the code changes alone do not deliver the requirement.
- **Operational impact:** every currently signed-in admin will be forced to re-authenticate once the time-box takes effect. There are few admins, so this is a notice rather than a migration.
- **Dependencies:** none new.
- **Bundle size:** negligible — configuration and guard logic only.
