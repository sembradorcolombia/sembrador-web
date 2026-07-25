## Context

`src/lib/supabase.ts` calls `createClient()` with no `auth` options, so everything is on defaults: `persistSession: true`, `autoRefreshToken: true`, `detectSessionInUrl: true`, storage `localStorage`. A session therefore survives browser restarts and renews indefinitely — there is no point at which an admin is asked to sign in again.

Both guards share the same shape:

```ts
const { data: { session } } = await supabase.auth.getSession();
if (!session?.user?.app_metadata?.is_admin) throw redirect({ to: "/login" });
```

`getSession()` reads the persisted session and decodes the JWT **locally**. It performs no network round-trip and no signature verification, so `app_metadata.is_admin` here is a claim read out of storage the visitor controls. `useAuth()` (`src/lib/hooks/useAuth.ts`) derives `isAdmin` the same way and feeds it into router context via `main.tsx`.

The practical blast radius of a guard bypass is limited by RLS — a forged local session yields a token the API rejects, so no data comes back. The guard bypass gets someone the dashboard *shell*, not the data. That is why this change treats the guard fix as correctness and defense-in-depth, and puts the actual security weight on the provider-side session limits and on RLS.

## Goals / Non-Goals

**Goals:**

- Make admin sessions end: 7-day absolute cap, plus an idle timeout, enforced by Supabase rather than by the browser.
- Verify the admin claim against the auth server instead of trusting local storage.
- Turn an expired session into a clear, explained redirect rather than a silent bounce or a blank page.
- Make the client's session persistence an explicit, documented decision.

**Non-Goals:**

- No MFA, password policy, rate limiting, or audit logging — separate concerns, separate changes.
- No role system beyond the existing `app_metadata.is_admin` boolean.
- No server-rendered or edge-enforced route protection; this stays an SPA with RLS as the data boundary.
- No "remember me" / variable session length UI. One policy for all admins.
- No re-auth prompt or session-extension modal before expiry.

## Decisions

### The 7-day cap is a Supabase project setting, not application code

Enable **Time-box user sessions = 168 hours** and an **inactivity timeout** in the Supabase Auth configuration. After the box, the refresh token is refused and no new access token is issued.

*Why not implement it in the client:* any expiry the browser computes — a `loginAt` timestamp in `localStorage`, a wrapper around the refresh call — is editable by whoever holds the device, which is exactly the threat. It would be a UX convention wearing a security label. The provider is the only place the limit is real.

*Consequence to verify early:* session time-box and inactivity timeout are **paid-plan Auth features** on Supabase. If this project is on a plan without them, the requirement as written cannot be met at the provider, and the choice becomes upgrading the plan or accepting a client-side approximation with its limits stated plainly. **Confirm plan availability before writing any code** — it determines whether the rest of this change is hardening or is the whole delivery. See Open Questions.

### Guards switch from `getSession()` to `getUser()`

`beforeLoad` calls `supabase.auth.getUser()`, which validates the token against the auth server and returns the authoritative user record. Admin status is read from that response.

*Cost:* a network round-trip on entry to `/dashboard` and `/login`. Acceptable — these guards run on navigation into two admin routes, not on every public page, and `defaultPreload: "intent"` means the check can start on hover.

*Fail closed:* any thrown error, network failure, or missing user redirects to `/login`. The guard's `try`/`catch` must not fall through to "allow".

*`useAuth()` is not switched.* It stays session-derived for reactive UI (the header email, the router context), because it runs on every app mount including public routes and must not add a blocking request there. The guard is the enforcement point; `useAuth()` is display state. This split must be explicit in the code so nobody later treats `useAuth().isAdmin` as an authorization decision.

### Expiry is signalled via a search param on `/login`

The guard redirects with `throw redirect({ to: "/login", search: { expired: true } })`, and `/login` renders the Spanish notice when that param is present.

*Why a search param over router state or a store:* it survives a full page load and a manual refresh, which is exactly the situation — the session died, and the app may be re-bootstrapping. Router state does not survive a reload; a module-level flag does not survive either. The param needs a Zod `validateSearch` on the login route, consistent with how the project validates search params elsewhere.

*Trade-off:* `?expired=true` is user-visible and user-settable, so anyone can make the notice appear. It carries no authority and reveals nothing, so this is cosmetic.

*Sign-out must not set it.* The "Salir" handler navigates to `/login` with no param, so a deliberate sign-out reads as a sign-out.

### Persistence stays `localStorage`, but stated explicitly

`createClient` gets an explicit `auth` block: `persistSession: true`, `storage: window.localStorage`, `autoRefreshToken: true`, `detectSessionInUrl: false`.

*Why keep `localStorage`:* the requirement is "log in again after a week", which presumes surviving browser restarts. `sessionStorage` would end the session on tab close — a stricter policy than asked for, and it would make the 7-day cap almost unobservable.

*The XSS trade-off, stated rather than solved:* a token in `localStorage` is readable by any script that runs on the origin. The genuine fix is an httpOnly cookie, which requires a server-side auth flow this SPA does not have. What the 7-day cap does buy is a bound on how long a stolen token stays useful — that is the honest framing, not that storage is now "hardened".

*`detectSessionInUrl: false`* because this app has no OAuth or magic-link callback; leaving it on means parsing every page load's URL fragment for auth material for no reason.

### Rejected sessions are cleared where they are detected

Two paths, both needed:

1. **Guard path** — `getUser()` rejects: call `supabase.auth.signOut({ scope: "local" })` before redirecting, so the dead token is not re-presented on the next navigation.
2. **Live-session path** — `useAuth()`'s existing `onAuthStateChange` subscription already fires `SIGNED_OUT` when a refresh fails. Handle that event by clearing state and navigating to `/login?expired=true`, so a session that dies while the dashboard is open does not leave stale content on screen.

Use `scope: "local"` rather than a global sign-out: the session is already invalid server-side, and a global call would fail or needlessly revoke other devices.

## Risks / Trade-offs

- **The time-box setting is unavailable on the current Supabase plan** → the core requirement silently does not ship while the code changes make it look done. Verify plan support as task 1.1, before implementation, and treat the result as a gate on the rest of the change.
- **Settings are configured in the Supabase dashboard, not in this repo** → the policy is invisible to code review and can be changed or lost without a trace in git. Record the configured values in the change and verify them as part of release, rather than assuming they persist.
- **`getUser()` adds a blocking request to dashboard entry** → a slow or failed auth request now delays or denies dashboard load where a local read never could. This is the intended trade (fail closed), but a flaky network turns into "redirected to login for no reason". Keep the check to the two guards, and do not extend it to `useAuth()`.
- **`useAuth().isAdmin` remains locally derived** → a future contributor could reasonably mistake it for an authorization check. Comment it at the definition, and keep authorization decisions in `beforeLoad`.
- **All current admins get logged out when the time-box takes effect** → this looks like a bug to them if unannounced. Tell the admins before enabling; the population is small enough that this is a message, not a migration.
- **Idle timeout set too aggressively** → admins working through a long subscriber list get bounced mid-task and lose unsaved state. Pick a value that is comfortably longer than a realistic working session and confirm it with the people who actually use the dashboard.
- **The client-side pieces read as the security control** → they are not, and documenting them as "hardening" invites over-confidence. The enforceable guarantees are the provider time-box and RLS; the guard and redirect improve correctness and UX.

## Open Questions

- **Does the current Supabase plan include session time-box and inactivity timeout?** Determines whether the primary requirement is deliverable as specified. Blocks task 1.1.
- **What inactivity period?** The proposal leaves it open. Needs a value from whoever uses the dashboard — a few hours is typical, but the working pattern here should decide it.
- **Should the 7-day cap apply to any non-admin authenticated users?** The setting is project-wide in Supabase, so it applies to every user of the project. Confirm no other flow depends on long-lived sessions before enabling.
