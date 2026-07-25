## 1. Provider configuration (blocking gate)

- [ ] 1.1 Confirm the project's Supabase plan includes "Time-box user sessions" and "Inactivity timeout"; if it does not, stop and decide with the user between upgrading the plan and accepting a client-only approximation with its limits documented
- [ ] 1.2 Agree the inactivity timeout value with whoever uses the dashboard (open question in design.md); confirm no non-admin flow depends on long-lived sessions, since the setting is project-wide
- [ ] 1.3 Set the session time-box to 168 hours (7 days) in Supabase Auth settings
- [ ] 1.4 Set the agreed inactivity timeout in Supabase Auth settings
- [ ] 1.5 Record both configured values in this change directory so the policy is reviewable from the repo
- [ ] 1.6 Notify existing admins that they will be signed out once the time-box takes effect

## 2. Supabase client configuration

- [ ] 2.1 Add an explicit `auth` options block to `createClient()` in `src/lib/supabase.ts`: `persistSession: true`, `storage: window.localStorage`, `autoRefreshToken: true`, `detectSessionInUrl: false`
- [ ] 2.2 Add a short comment at that block recording the `localStorage` XSS trade-off and that the 7-day cap is what bounds a stolen token's usefulness

## 3. Route guard hardening

- [ ] 3.1 Replace `getSession()` with `getUser()` in the `/dashboard` `beforeLoad` guard and read `app_metadata.is_admin` from the validated user
- [ ] 3.2 Wrap the guard in `try`/`catch` so any error, timeout, or missing user redirects to `/login` — verify no path falls through to "allow"
- [ ] 3.3 On rejection, call `supabase.auth.signOut({ scope: "local" })` before redirecting, so the dead token is not re-presented
- [ ] 3.4 Apply the same `getUser()`-based check to the `/login` `beforeLoad` guard so a stale stored session cannot bounce the visitor back to `/dashboard`
- [ ] 3.5 Add a comment at `useAuth()` stating it is display state derived locally and is NOT an authorization check — authorization lives in `beforeLoad`

## 4. Expiry signalling and messaging

- [ ] 4.1 Add a Zod `validateSearch` to the `/login` route accepting an optional `expired` boolean
- [ ] 4.2 Redirect with `search: { expired: true }` from the guards when a session is expired or rejected
- [ ] 4.3 Render the Spanish notice "Tu sesión expiró, vuelve a iniciar sesión" on `/login` when `expired` is present, styled with the existing `alert` UI primitive
- [ ] 4.4 Confirm the "Salir" handler in `dashboard.tsx` navigates to `/login` WITHOUT the param, so a deliberate sign-out shows no expiry message
- [ ] 4.5 Handle `SIGNED_OUT` in the existing `onAuthStateChange` subscription in `useAuth()` so a session dying while the dashboard is open clears state and redirects to `/login?expired=true` instead of leaving stale content on screen

## 5. Testing

- [ ] 5.1 Test the `/dashboard` guard: valid admin admitted; authenticated non-admin redirected; anonymous visitor redirected; `getUser()` error redirects (fails closed)
- [ ] 5.2 Test that a tampered stored session claiming admin does not satisfy the guard
- [ ] 5.3 Test the `/login` guard: validated admin redirected to `/dashboard`; expired stored session renders the form without a redirect loop
- [ ] 5.4 Test that `/login?expired=true` renders the Spanish notice and a plain `/login` visit does not
- [ ] 5.5 Test that a `SIGNED_OUT` event while the dashboard is mounted clears state and redirects
- [ ] 5.6 Run `pnpm test` and confirm existing auth, login, and dashboard tests still pass

## 6. Verification

- [ ] 6.1 Run `pnpm check` (Biome lint + format) and fix any findings
- [ ] 6.2 Run `pnpm build` and confirm the TypeScript type-check passes
- [ ] 6.3 Run `pnpm test:e2e` to confirm no regression in the login and dashboard flows
- [ ] 6.4 Manually verify the idle timeout: leave a session unused past the configured period and confirm the next dashboard visit redirects to `/login` with the expiry notice
- [ ] 6.5 Verify the absolute cap against the provider — confirm that a refresh token older than 7 days is refused and issues no new access token (test against the auth API rather than waiting a week in the browser)
- [ ] 6.6 Confirm RLS still blocks admin-only data for a non-admin client that bypasses the route guard entirely
