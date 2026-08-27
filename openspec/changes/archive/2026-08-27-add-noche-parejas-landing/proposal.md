## Why

El Sembrador is promoting a couples dinner ("Cena para parejas") on Friday, September 18 at 7:00 PM and needs a dedicated campaign landing at `/noche-parejas` so people can register from ads and shared links. The Penpot file "Landing - Parejas" defines a single registration screen (event details + form) plus a confirmation screen; registrations should land in the existing `events` / `event_subscriptions` tables so capacity, duplicates, and the admin Events dashboard work without a new table.

## What Changes

- Add a branded public landing at `/noche-parejas` matching the Penpot "landing - parejas" board (lavender chrome, couple photo, title graphic, date/time) and show the registration form directly on the same page (nombres, apellidos, email, teléfono, data-policy consent, "Registrarse").
- Add a confirmation screen at `/noche-parejas/registro-exitoso` matching "confirmation - parejas" ("muchas gracias…" copy, "Ir al inicio").
- Seed a `events` row for this dinner and persist signups via the existing `create_subscription_with_increment` RPC into `event_subscriptions`.
- Opt `/noche-parejas` (and subroutes) out of the shared Navbar/Footer so the campaign is full-bleed, like `/equilibrio`.
- Spanish UI throughout; `SeoHead` on both routes; optional Meta Pixel custom event on success.

## Capabilities

### New Capabilities
- `noche-parejas-landing`: Campaign landing, registration form, success page, and persistence of couples-dinner signups through `events` / `event_subscriptions`.

### Modified Capabilities
- `site-navigation`: `/noche-parejas` and its subroutes SHALL NOT render the shared Navbar/Footer (full-bleed campaign chrome).

## Impact

- **Routes:** new `src/routes/noche-parejas/index.tsx` and `src/routes/noche-parejas/registro-exitoso.tsx` (TanStack Router auto code-splitting; `routeTree.gen.ts` regenerates). No redirects from existing paths.
- **Layout:** `LAYOUT_OPT_OUT_PREFIXES` in `src/routes/__root.tsx` gains `/noche-parejas`.
- **Backend:** SQL migration to insert the `events` row (name + capacity). No new tables, RPCs, or columns. No hand-edits to `database.types.ts`.
- **Frontend layers:** campaign-specific form/validation wrapping existing `createSubscription` / `useCreateSubscription`; static assets exported from Penpot (title graphic, couple photo, white logo).
- **Dashboard:** no new tab — the existing Events section lists the seeded event and its subscribers.
- **Dependencies:** no new npm packages. Bundle impact limited to the new code-split routes.
- **Nav/SEO:** not linked from Navbar; reachable by direct URL/campaigns. `SeoHead` with Spanish title/description.
- **CMS:** out of scope — copy and imagery are static from the Penpot design.
