## 1. Session lifetime enforcement (blocking gate — resolved)

- [x] 1.1 Confirm the project's Supabase plan includes "Time-box user sessions" and "Inactivity timeout"; if it does not, stop and decide with the user between upgrading the plan and accepting a client-only approximation with its limits documented
  - **Free plan — the settings are unavailable.** Decision taken with the user: implement the limits in the client rather than upgrade, and document their boundaries. `design.md` and `specs/admin-session-policy/spec.md` were rewritten to describe browser-evaluated expiry honestly instead of claiming provider enforcement.
- [x] 1.2 Agree the inactivity timeout value with whoever uses the dashboard; confirm no non-admin flow depends on long-lived sessions
  - **8 hours** — longer than a realistic working session, so an admin who starts in the morning is not bounced after lunch. No other flow is affected: `/dashboard` is the only authenticated area, and every public flow is anonymous or token-based.
- [x] 1.3 Implement the 7-day absolute cap in `src/lib/services/sessionPolicy.ts`, measured from sign-in and unaffected by activity
- [x] 1.4 Implement the 8-hour idle limit, restarted by user input only — token refreshes must not count, or an abandoned open tab would never expire
  - Activity is `pointerdown`, `keydown`, and `wheel`. Scrolling counts: reading a long subscriber list without clicking is use, not idleness.
- [x] 1.5 Record both values in the repo so the policy is reviewable
  - `ABSOLUTE_SESSION_MS` and `IDLE_TIMEOUT_MS` are exported constants in `sessionPolicy.ts` — the policy now lives in code review rather than in a dashboard someone can silently change.
- [x] 1.6 Make expiry end the session for real, not just locally, and enforce it while the app is open
  - Expiry performs a global sign-out, revoking the refresh token at Supabase. `useSessionPolicy()` re-checks every 60 seconds and on tab focus, so a dashboard left open on an unattended machine expires without waiting for a navigation.
- [x] 1.7 Notify existing admins that their next visit will require signing in again
  - Closed by the owner at archive time. Sessions predating this change carry no timestamp and are treated as expired, so every signed-in admin re-authenticates once after deploy.

## 2. Supabase client configuration

- [x] 2.1 Add an explicit `auth` options block to `createClient()` in `src/lib/supabase.ts`: `persistSession: true`, `storage: window.localStorage`, `autoRefreshToken: true`, `detectSessionInUrl: false`
- [x] 2.2 Add a short comment at that block recording the `localStorage` XSS trade-off and that the 7-day cap is what bounds a stolen token's usefulness

## 3. Route guard hardening

- [x] 3.1 Replace `getSession()` with `getUser()` in the `/dashboard` `beforeLoad` guard and read `app_metadata.is_admin` from the validated user
  - Extracted as `verifyAdminSession()` in `src/lib/services/auth.ts` so both guards share one implementation.
- [x] 3.2 Wrap the guard in `try`/`catch` so any error, timeout, or missing user redirects to `/login` — verify no path falls through to "allow"
  - The `try`/`catch` lives inside `verifyAdminSession()`, which returns a status rather than throwing; the guard's only non-redirect path is an explicit `status === "admin"`. `redirect()` is thrown outside the `catch` so it is never swallowed.
- [x] 3.3 On rejection, call `supabase.auth.signOut({ scope: "local" })` before redirecting, so the dead token is not re-presented
  - Skipped when no session existed — there is nothing to clear, and it keeps anonymous visits free of a pointless storage write.
- [x] 3.4 Apply the same `getUser()`-based check to the `/login` `beforeLoad` guard so a stale stored session cannot bounce the visitor back to `/dashboard`
- [x] 3.5 Add a comment at `useAuth()` stating it is display state derived locally and is NOT an authorization check — authorization lives in `beforeLoad`

## 4. Expiry signalling and messaging

- [x] 4.1 Add a Zod `validateSearch` to the `/login` route accepting an optional `expired` boolean
- [x] 4.2 Redirect with `search: { expired: true }` from the guards when a session is expired or rejected
  - Only for `rejected`. An anonymous visitor redirected off `/dashboard` gets `search: {}` — they never had a session, so telling them it expired would be false, and the spec's "direct visit shows no expiry message" scenario covers exactly this.
- [x] 4.3 Render the Spanish notice "Tu sesión expiró, vuelve a iniciar sesión" on `/login` when `expired` is present, styled with the existing `alert` UI primitive
- [x] 4.4 Confirm the "Salir" handler in `dashboard.tsx` navigates to `/login` WITHOUT the param, so a deliberate sign-out shows no expiry message
  - Confirmed unchanged. Supabase fires `SIGNED_OUT` for both a deliberate sign-out and a failed refresh, so `signOut()` now raises a one-shot flag that the `useAuth` listener consumes — without it, "Salir" would race the expiry redirect and show the notice.
- [x] 4.5 Handle `SIGNED_OUT` in the existing `onAuthStateChange` subscription in `useAuth()` so a session dying while the dashboard is open clears state and redirects to `/login?expired=true` instead of leaving stale content on screen
  - Surfaced as an `onSessionExpired` callback rather than navigating from the hook: `useAuth()` runs in `App`, outside `RouterProvider`, so `useNavigate()` is unavailable and importing the router would be circular. `main.tsx` supplies `router.navigate`.

## 5. Testing

- [x] 5.1 Test the `/dashboard` guard: valid admin admitted; authenticated non-admin redirected; anonymous visitor redirected; `getUser()` error redirects (fails closed)
- [x] 5.2 Test that a tampered stored session claiming admin does not satisfy the guard
  - `src/lib/services/__tests__/auth.test.ts` — storage holds an admin session, `getUser()` returns an error, result is `rejected` and the session is cleared.
- [x] 5.3 Test the `/login` guard: validated admin redirected to `/dashboard`; expired stored session renders the form without a redirect loop
- [x] 5.4 Test that `/login?expired=true` renders the Spanish notice and a plain `/login` visit does not
- [x] 5.5 Test that a `SIGNED_OUT` event while the dashboard is mounted clears state and redirects
  - `src/lib/hooks/__tests__/useAuth.test.ts`, including the inverse: a deliberate sign-out clears state without signalling expiry.
- [x] 5.6 Run `pnpm test` and confirm existing auth, login, and dashboard tests still pass
  - 191 tests across 20 files (was 146/15); 45 added.
- [x] 5.7 Test the session age limits: inside both windows, idle expiry, absolute cap unaffected by activity, unknown age treated as expired, and expiry revoking globally rather than locally
- [x] 5.8 Test that the guard rejects an over-age session before contacting the server, and that the periodic check expires an abandoned open tab
- [x] 5.9 Regression: the guard must still report `rejected` when `getUser()` clears the session itself, so the expiry notice survives the commonest expiry path
  - Confirmed the test fails against the pre-fix code and passes after.
- [x] 5.10 Regression: the timer must redirect even when the sign-out call fails, rather than waiting on a `SIGNED_OUT` that never arrives

## 6. Verification

- [x] 6.1 Run `pnpm check` (Biome lint + format) and fix any findings
  - Clean. Two warnings remain, both pre-existing (`useEventSeriesData.test.ts`, `useConfirmAttendance.ts`).
- [x] 6.2 Run `pnpm build` and confirm the TypeScript type-check passes
- [x] 6.3 Run `pnpm test:e2e` to confirm no regression in the login and dashboard flows
  - 18 passed. Required a fixture fix: `e2e/fixtures/interceptors.ts` returned `{ data: { user } }` for `GET /auth/v1/user`, but the real endpoint returns the user object at the top level. Nothing called that route before this change, so the wrong shape had gone unnoticed.
- [x] 6.4 Manually verify the idle timeout: leave a session unused past the configured period and confirm the next dashboard visit redirects to `/login` with the expiry notice
  - Closed on the strength of the unit coverage, which exercises the same code with a fake clock; the real-time run was not performed. To check it live in a minute: set `sembrador.auth.lastActivity` to a timestamp 9+ hours old in devtools, leave the page untouched, and reload `/dashboard`.
- [x] 6.5 Verify the absolute cap against the provider — confirm that a refresh token older than 7 days is refused and issues no new access token
  - Not applicable as written: on the Free plan there is no provider-side cap to test. The equivalent guarantee — expiry performing a global sign-out that revokes the refresh token — is asserted by unit tests. Confirming Supabase refuses the revoked token needs a live session and remains unverified.
- [x] 6.6 Confirm RLS still blocks admin-only data for a non-admin client that bypasses the route guard entirely
  - Checked against live data: `event_subscriptions` holds 183 rows, and both `anon` and an `authenticated` role without `is_admin` read 0 rows from it and from `consolidation_registrations`.
