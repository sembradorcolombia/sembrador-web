## Context

The `/noche-parejas` registration form (`NocheParejasForm.tsx`) captures a single person (nombre, apellido, email, teléfono) and persists it as an `event_subscriptions` row for the seeded "Noche de Parejas" event. Because this is a couples event, the team wants the option to also register the registrant's spouse and to record the couple's relationship status. Both people must remain in `event_subscriptions` so the existing events dashboard, capacity counting (`current_count` trigger), and confirmation flow continue to work unchanged; the couple link and relationship live in a separate table.

Existing patterns to follow:
- **Events subscription** (`create_subscription_with_increment` SECURITY DEFINER RPC over `event_subscriptions`, capacity check, `23505` → already registered) is the base persistence path this change extends.
- **Consolidation** (`consolidation.ts` validation) shows the established pattern for a required select backed by a `const` options tuple and `z.enum`.
- Service → hook → component layering; TanStack Form with per-field Zod `safeParse` validators; Biome tabs/double-quotes.

## Goals / Non-Goals

**Goals:**
- Capture the registrant and, optionally, a cónyuge (nombre, apellido, email, teléfono) plus a required couple relationship-status select shown only when a spouse is added.
- Keep every person in `event_subscriptions`; add a second subscription row for a new spouse, or reuse the spouse's existing subscription for the event.
- Record the couple link + relationship in a dedicated `noche_parejas_relationships` table.
- Warn the user when the spouse was already registered (relationship still linked); guard against the spouse email equaling the registrant email.
- Surface the relationship and cónyuge nombre/apellido on the existing events dashboard.

**Non-Goals:**
- No migration of prior `event_subscriptions` rows.
- No dedicated Noche de Parejas dashboard tab — couple data is shown as extra columns on the existing events table.
- No change to the success page (`/noche-parejas/registro-exitoso`) beyond it still being the post-submit destination.

## Decisions

### Decision: Keep registrations in `event_subscriptions`; separate relationship table
Every person (registrant and, when added, spouse) is an `event_subscriptions` row, preserving the shared events dashboard, capacity counting, and confirmation-token flow. The couple link and relationship are stored separately.

`noche_parejas_relationships` columns:
```
id                       UUID PK default gen_random_uuid()
event_id                 UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE
subscription_id          UUID NOT NULL REFERENCES event_subscriptions(id) ON DELETE CASCADE  -- registrant
conyuge_subscription_id  UUID NOT NULL REFERENCES event_subscriptions(id) ON DELETE CASCADE  -- spouse
conyuge_name             TEXT NOT NULL
conyuge_lastname         TEXT NOT NULL
relationship             TEXT NOT NULL
created_at               TIMESTAMPTZ NOT NULL DEFAULT now()
```
Indexed on `subscription_id`. RLS enabled; write-only through the SECURITY DEFINER RPC; admin-only SELECT policy (mirrors the `event_subscriptions` admin policy) so the dashboard can read it.

**Alternatives considered:** a dedicated `noche_parejas_couples` table holding both people in one row (the earlier experiment) — rejected because it duplicates the person shape, bypasses the shared events dashboard/capacity/confirmation flow, and forces a parallel duplicate-email mechanism. That table + its RPCs are dropped in this migration.

### Decision: Single RPC `create_noche_parejas_registration`
One SECURITY DEFINER function does the whole transaction:
```
create_noche_parejas_registration(
  p_event_id, p_name, p_lastname, p_email, p_phone, p_accepts_data_policy,
  p_with_conyuge,
  p_conyuge_name?, p_conyuge_lastname?, p_conyuge_email?, p_conyuge_phone?, p_relationship?
) RETURNS BOOLEAN
```
Behavior:
1. If `p_with_conyuge` and the spouse email equals the registrant email → `RAISE EXCEPTION 'conyuge_same_email'`.
2. If `p_with_conyuge`, look up an existing `event_subscriptions` row for this event by the spouse email (case-insensitive). If found → reuse it (`v_conyuge_existed := TRUE`, one seat needed). If not found → will insert a new spouse row (two seats needed).
3. Capacity check against `events.current_count` / `max_capacity` for the needed seat count.
4. Insert the registrant subscription (`name = p_name || ' ' || p_lastname`). The existing per-row trigger increments `current_count`.
5. If a spouse is being added and is new, insert the spouse subscription.
6. Insert a `noche_parejas_relationships` row linking registrant + spouse with the cónyuge name and relationship.
7. **Return `TRUE` when the spouse was already registered**, so the client can warn the user; `FALSE` otherwise.

Duplicate registrant email is still enforced by the existing unique-email-per-event constraint (`23505` → "Ya estás inscrito en este evento").

**Alternatives considered:** a separate pre-submit `check_*_emails` RPC + block — rejected; the product now wants to *warn and still link* the relationship when the spouse exists rather than block, and the single RPC keeps insert + link atomic.

### Decision: Relationship options as a shared const tuple
```ts
export const RELATIONSHIP_OPTIONS = [
  "Casados", "Novios", "Comprometidos", "Unión libre",
] as const;
```
Validated with `z.enum(RELATIONSHIP_OPTIONS, { message: "Debes seleccionar una opción" })`, mirroring `CONNECT_OPTIONS` in `consolidation.ts`. Rendered with the existing `src/components/ui/select.tsx`.

### Decision: Optional cónyuge via checkbox + conditional validation
The schema declares `withConyuge: z.boolean()` and the cónyuge/relationship fields as plain strings, then uses `superRefine` to validate the cónyuge fields (name length, email quality, 10-digit phone, relationship enum) **only when `withConyuge` is true**. In the form, the cónyuge block renders via `form.Subscribe` on `withConyuge`, and each cónyuge field validator short-circuits (returns undefined) when the checkbox is off, so empty spouse fields never block submission of a single-person registration.

### Decision: Client flow in `NocheParejasForm`
On submit (after client-side Zod validation passes):
1. Guard that the event id resolved (`useNocheParejasEvent`); otherwise show an error toast.
2. Call `createNocheParejasRegistration({ ...values, eventId })`.
3. If the result reports the spouse was already registered, show a warning toast ("Tu cónyuge ya estaba inscrito; vinculamos la relación a su inscripción existente.").
4. Navigate to `/noche-parejas/registro-exitoso`. On failure, show the mapped error toast.

Uses `useCreateNocheParejasRegistration` (mutation) and the existing `useNocheParejasEvent` for the event id.

### Decision: Dashboard shows couple columns on the existing events table
Rather than a separate tab, the existing events dashboard is enriched:
- `fetchEventsWithSubscriptions()` (`dashboard.ts`) loads each event's `event_subscriptions` (paged, `PAGE_SIZE = 1000`, newest first) and joins couple info from `noche_parejas_relationships` keyed by `subscription_id`. The `EventSubscription` type = `Tables<"event_subscriptions">` plus `conyugeName`, `conyugeLastname`, `relationship` (null for subscribers who are not a couple registrant).
- `SubscribersTable.tsx` adds "Relación", "Cónyuge nombre", "Cónyuge apellido" columns (with `—` fallback) and includes them in the CSV export.

**Alternatives considered:** a dedicated Noche de Parejas section/table — rejected; couple data belongs to `event_subscriptions` rows and is most useful inline in the existing per-event listing.

### Decision: Files
- `supabase/migrations/20260827000001_add_noche_parejas_couple_relationships.sql` — drops the old couples experiment; creates `noche_parejas_relationships`, index, RLS, the `create_noche_parejas_registration` RPC, and the admin SELECT policy.
- Regenerate `src/lib/database.types.ts` (auto-generated; do not hand-edit).
- `src/lib/validations/noche-parejas.ts` — schema + `RELATIONSHIP_OPTIONS` + shared field schemas.
- `src/lib/services/nocheParejas.ts` — `createNocheParejasRegistration`.
- `src/lib/hooks/useCreateNocheParejasRegistration.ts`.
- `src/components/forms/NocheParejasForm.tsx` — optional cónyuge checkbox + conditional fields + relationship select + warning.
- `src/lib/services/dashboard.ts` — couple enrichment.
- `src/components/dashboard/SubscribersTable.tsx` — couple columns + CSV.
- Tests: `noche-parejas.test.ts`, `NocheParejasForm.test.tsx`, and the dashboard `SubscribersTable`/`EventCard`/`SubscriberSearch` tests.

## Risks / Trade-offs

- **[Two-seat capacity edge]** Adding a new spouse needs two seats; the RPC checks `current_count + needed <= max_capacity` before inserting either row → an at-capacity event correctly rejects the couple rather than partially registering.
- **[Wider dashboard table]** Three extra columns widen the events table → mitigated by the existing horizontal-scroll-within-card pattern; the page body never scrolls horizontally.
- **[Spouse-exists warning, not block]** The couple proceeds even if the spouse was already registered → intended: the relationship is linked to the existing subscription and the user is warned, avoiding a duplicate person row.

## Migration Plan

1. Apply the SQL migration (drops the old couples experiment; adds `noche_parejas_relationships` + RPC + policy).
2. Regenerate `database.types.ts`.
3. Ship frontend changes (validation, service, hook, form, dashboard, tests) in the same PR.
4. **Rollback:** revert the frontend PR; the new table/RPC are additive relative to `event_subscriptions` and can be dropped separately. Prior `event_subscriptions` rows are untouched throughout.

## Open Questions

- Relationship-column naming: the implementation uses `subscription_id` / `conyuge_subscription_id` (vs. a `conyuge_a` / `conyuge_b` naming). Non-blocking; can be renamed later if desired.
