## Why

The "Noche de Parejas" (Cena para parejas) is a couples event, but the registration form only captures one person. The team needs the option to also register the registrant's spouse and to record the couple's relationship status for seating, communications, and follow-up. Every person (registrant and spouse) must still live in the shared `event_subscriptions` table so the existing events dashboard, capacity counting, and confirmation flow keep working. When the spouse is already registered for the event, the couple must not be double-booked — the spouse's existing subscription is reused and the relationship is still recorded.

## What Changes

- Add an **optional cónyuge (spouse)** step to the `/noche-parejas` form: a checkbox ("Quiero registrar también a mi cónyuge") that, when checked, reveals cónyuge fields — **nombre**, **apellido**, **email**, **teléfono** — plus a **relationship status** select (Casados, Novios, Comprometidos, Unión libre) describing the couple.
- Extend the Zod validation schema so the cónyuge fields and relationship are required only when the checkbox is on, and optional (empty allowed) when it is off.
- **Keep persisting registrations in `event_subscriptions`.** The registrant is always inserted as an `event_subscriptions` row. When a spouse is added and is **not** already registered for the event, the spouse is inserted as a second `event_subscriptions` row. When the spouse is **already** registered, that existing subscription is reused (no duplicate row).
- Record the couple link in a new dedicated `noche_parejas_relationships` table that references the two `event_subscriptions` rows (`subscription_id`, `conyuge_subscription_id`) plus the cónyuge nombre/apellido and the relationship status.
- On submit, if the spouse was already registered, **warn** the user (toast) that the spouse was already inscribed and the relationship was linked to their existing subscription, then continue to the success page. Guard against the spouse email equaling the registrant email.
- Add couple columns to the **existing events dashboard** table (`SubscribersTable`): "Relación", "Cónyuge nombre", "Cónyuge apellido", enriched from `noche_parejas_relationships`, and include them in the CSV export.
- Keep the existing campaign chrome, data-policy checkbox, and success page flow unchanged.

## Capabilities

### New Capabilities
- `noche-parejas-admin-view`: The events dashboard's couple columns — the existing `event_subscriptions` listing is enriched with the registrant's relationship status and cónyuge nombre/apellido (read from `noche_parejas_relationships`), surfaced as table columns and in CSV export, behind the existing admin-only read access.

### Modified Capabilities
- `noche-parejas-landing`: The registration form gains an optional cónyuge step (checkbox-gated fields) and a relationship-status select; validation covers the new fields conditionally; persistence keeps every person in `event_subscriptions` and records the couple link in `noche_parejas_relationships`; when the spouse is already registered the submission reuses their subscription and warns the user instead of blocking.

## Impact

- **DB (Supabase)**: new `noche_parejas_relationships` table (references two `event_subscriptions` rows + cónyuge name/relationship, RLS enabled, admin-only SELECT); new SECURITY DEFINER RPC `create_noche_parejas_registration(...)` that inserts the registrant, optionally reuses/creates the spouse subscription, and links the relationship; regenerated `src/lib/database.types.ts`. The earlier `noche_parejas_couples` experiment (table + `create_noche_parejas_couple` + `check_noche_parejas_emails`) is dropped in the same migration.
- **Frontend**:
  - `src/lib/validations/noche-parejas.ts` — schema gains `withConyuge`, `conyugeName`, `conyugeLastname`, `conyugeEmail`, `conyugePhone`, `relationship`, validated conditionally via `superRefine`.
  - `src/lib/services/nocheParejas.ts` — new `createNocheParejasRegistration()` calling the RPC and mapping errors.
  - `src/lib/hooks/useCreateNocheParejasRegistration.ts` — TanStack Query mutation (invalidates `["events"]`); the form uses the existing `useNocheParejasEvent` for the event id.
  - `src/components/forms/NocheParejasForm.tsx` — optional cónyuge checkbox + conditional fields, relationship select, spouse-already-registered warning.
  - Tests: `NocheParejasForm.test.tsx` and `noche-parejas.test.ts` updated for the optional-spouse flow.
- **Dashboard**:
  - `src/lib/services/dashboard.ts` — `fetchEventsWithSubscriptions()` enriches each `event_subscriptions` row with couple info from `noche_parejas_relationships`.
  - `src/components/dashboard/SubscribersTable.tsx` — new "Relación" / "Cónyuge nombre" / "Cónyuge apellido" columns and CSV fields.
  - Tests for the enriched table.
- **UI primitives**: reuse existing `select` and `table` components (`src/components/ui/`).
- **No new npm dependencies**; negligible bundle impact.
