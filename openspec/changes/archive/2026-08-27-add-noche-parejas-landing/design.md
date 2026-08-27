## Context

The site already persists event signups through `events` + `event_subscriptions` and `create_subscription_with_increment` (capacity + duplicate email). Standalone campaign pages (`/desayuno`, `/consolidacion`) use dedicated tables; this dinner is an event, so those tables are the right model.

Penpot file **Landing - Parejas** defines two 1920×1080 boards that share a lavender full-bleed chrome (`#e2a9f1`), white logo, title graphic (“un amor que SOBREVIVE A LA CAIDA / GÉNESIS 3:14-21”), and a right-side couple photo with heart shapes:

1. **landing - parejas** — “Cena para parejas”, “Viernes / SEP. 18 7:00PM”, and the registration form (Nombre, Apellido, Email, Teléfono, spouse note, data-policy checkbox, “Registrarse”) on the same screen.
2. **confirmation - parejas** — thank-you copy, “Ir al inicio”.

`event_subscriptions` has a single `name` column (no lastname). Shared Navbar/Footer would fight the full-bleed campaign; `/equilibrio` already opts out via `LAYOUT_OPT_OUT_PREFIXES`.

## Goals / Non-Goals

**Goals:**

- Public campaign at `/noche-parejas` showing event details + the registration form on one screen, plus a success confirmation route, visually faithful to Penpot.
- Persist registrations as `event_subscriptions` for a seeded `events` row via the existing RPC.
- Concatenate nombres + apellidos into `name`; validate like other public forms (Zod, Spanish errors, 10-digit phone, policy required).
- Hide Navbar/Footer on these routes.
- Reuse `createSubscription` / `useCreateSubscription`; admins see the event in the existing Events dashboard tab.

**Non-Goals:**

- New Supabase table, RPC, or `lastname` column.
- Sanity CMS content for this campaign.
- Navbar/footer link to the landing.
- New dashboard tab (Events section already lists every `events` row).
- Attendance confirmation, connection, or feedback flows for this event.
- Listing this dinner on `/eventos` (CMS event series; out of scope).

## Decisions

### 1. Reuse `events` / `event_subscriptions` (no new table)

- **Choice:** Seed one `events` row named `Noche de Parejas`. Form submits through `create_subscription_with_increment` with that event’s id.
- **Rationale:** Requested by product; capacity, duplicate email (unique constraint → 23505), and dashboard listing already exist.
- **Alternatives considered:**
  - Dedicated table like desayuno — rejected (user asked to use events/subscriptions; dinner is capacity-limited).
  - Hardcoded event UUID in frontend — rejected (env-specific; lookup by name is stable).

**Seed (migration):**

| Column | Value |
|--------|--------|
| `name` | `Noche de Parejas` |
| `max_capacity` | `100` (ops can raise in Studio; frontend uses live `current_count`) |
| `current_count` | `0` |

Insert only if no row with that name exists. Frontend constant `NOCHE_PAREJAS_EVENT_NAME = "Noche de Parejas"`; resolve id via `useEvents()` / `fetchEvents()`.

### 2. Two routes matching the two boards

- **Choice:**
  - `/noche-parejas` — event details + registration form on the same screen.
  - `/noche-parejas/registro-exitoso` — confirmation; “Ir al inicio” → `/`
- **Rationale:** Matches the updated Penpot design, keeps the URL short for ads/shared links, and preserves a shareable success state; code-split per board.
- **Alternatives considered:**
  - Three routes with a separate `/noche-parejas/registro` — rejected after the Penpot design was updated to put the form directly on the landing board.
  - Single route with local view state for success — rejected (worse analytics/deep links).

### 3. Shared campaign shell + Penpot tokens

- **Choice:** A `NocheParejasLayout` wraps both routes: full-viewport `#e2a9f1` background, white horizontal logo (`logo-hw.svg` already in assets), title graphic, couple photo on the right (desktop). Content slot on the left for form / thank-you. Event meta (“Cena para parejas” + datetime) lives in the layout so landing and confirmation share it.
- **Visual tokens from Penpot:**
  - Page bg `#e2a9f1`
  - Buttons `#c960a6`, white 700 text, 24px radius, 71px tall; desktop CTA 349px wide and centered, full-width below `lg`
  - Body / event-meta text `#222` / `#30251f`
  - Inputs `#f2f2f2`, 8px radius, 40px tall, full width of the content column (~629px desktop, ~361px mobile)
  - Confirmation card: white at 30% opacity, 8px radius
- **Responsive:** Desktop two-column (content | photo) from `lg` (1024px). Below `lg`, reorder to a single column with the couple photo first, then the title graphic, event details ("Cena para parejas" above the date, both centered), and form; no horizontal overflow. Inputs and the submit / “Ir al inicio” controls are full-width on small viewports.
- **Assets:** Export title graphic and couple+hearts image from Penpot into `src/assets/images/` (webp). Do not recreate the mixed-type title in CSS.
- **Rationale:** One chrome, two slots; avoids duplicating the photo/title/event meta on every route.
- **Alternatives considered:** Inline unique markup per route — rejected (duplication). Recreate title as HTML/CSS — rejected (script + stacked weights won’t match).

### 4. Form layering (nombres/apellidos → `name`)

- **Choice:**
  - `src/lib/validations/noche-parejas.ts` — Zod: `name`, `lastname` (min 2 / max 100), `emailSchema`, phone `/^[0-9]{10}$/`, `acceptsDataPolicy` literal `true`.
  - `src/components/forms/NocheParejasForm.tsx` — TanStack Form, campaign-styled inputs (not the white `SubscriptionForm` card).
  - On submit: `createSubscription({ name: \`${name} ${lastname}\`.trim(), email, phone, eventId, acceptsDataPolicy })` via existing `useCreateSubscription`.
  - Policy label links to `/politica-de-datos` (opens same tab or new tab; match desayuno).
- **Rationale:** Schema matches the board; persistence matches `event_subscriptions` without a migration on that table.
- **Alternatives considered:**
  - Reuse `SubscriptionForm` — rejected (event `<select>`, generic white card, no lastname).
  - Add `lastname` column — rejected (scope; dashboard/CSV already treat `name` as one field).

Hidden `eventId` from the seeded event. If the event is missing, disable submit and do not call the RPC.

Capacity-full and duplicate-email errors already mapped in `createSubscription` (“Este evento ya alcanzó su capacidad máxima”, “Ya estás inscrito en este evento”) — surface via toast, stay on the form.

### 5. Layout opt-out

- **Choice:** Add `/noche-parejas` to `LAYOUT_OPT_OUT_PREFIXES` in `src/routes/__root.tsx` (covers `/noche-parejas` and `/noche-parejas/registro-exitoso`).
- **Rationale:** Same mechanism as `/equilibrio`, `/dashboard`, `/login`.
- **Alternatives considered:** Keep Navbar — rejected (breaks the Penpot full-bleed).

### 6. Copy, SEO, analytics

- **Landing + form:** On desktop, “Cena para parejas” sits left and “Viernes / SEP. 18 7:00PM” right; on mobile they stack centered with “Cena para parejas” first. Form labels “Nombre:”, “Apellido:”, “Email:”, “Teléfono:”, note “* Solo es necesario que se registre uno de los conyuges”, policy text as in Penpot, submit “REGISTRARSE”. No horizontal separator line.
- **Success:** Same campaign chrome and event meta. Thank-you sits in a translucent white card: “Muchas gracias por registrarte” (32px / 700) / “nos vemos en una noche especial” (24px / 400). Penpot has “registrate”; use the grammatically correct “registrarte”. Button “IR AL INICIO”.
- **SeoHead:** Spanish titles/descriptions on both routes (e.g. “Noche de Parejas”, “Registro exitoso — Noche de Parejas”).
- **Meta Pixel:** `trackCustom("NocheParejasSuccess")` on the success route when `fbq` is available (parity with desayuno).

### 7. Testing

- Unit: Zod schema; form submit concatenates name and calls `createSubscription` with the resolved event id (mock hook/service).
- No E2E required for v1 unless time allows; smoke-test listed in tasks.

## Risks / Trade-offs

- **[Risk] Seeded event missing in an environment** → Mitigation: idempotent migration; form disables submit if lookup fails; document apply-before-deploy.
- **[Risk] `name` concatenation loses structured lastname in exports** → Mitigation: Accept for v1; CSV still has a useful full name; add a column later if ops needs it.
- **[Risk] Default `max_capacity` 100 is wrong** → Mitigation: Easy Studio update; RPC already blocks over-capacity.
- **[Risk] Duplicate email across *other* events is allowed, but same event is not** → Mitigation: Existing unique constraint is the desired behavior.
- **[Risk] Couple photo / title assets are large** → Mitigation: Export webp, width-constrain, `loading`/`decoding` attributes; route is code-split.
- **[Trade-off] Campaign styles diverge from site primary/secondary** → Intentional; scoped to the layout so global theme is unchanged.

## Migration Plan

1. Add SQL migration: `INSERT` `Noche de Parejas` into `events` if missing.
2. Apply migration to target Supabase project(s) before or with the frontend deploy.
3. Export Penpot assets; add routes, layout, form, validation.
4. Add `/noche-parejas` to layout opt-out.
5. Smoke-test: form on `/noche-parejas` → valid submit → success + row on the event; invalid fields; unchecked policy; duplicate email toast.

**Rollback:** Remove routes/assets/opt-out. Leave the `events` row (harmless) or delete it and its subscriptions if the campaign is cancelled. No schema drop.

## Open Questions

- Exact `max_capacity` (default 100 until ops confirms).
