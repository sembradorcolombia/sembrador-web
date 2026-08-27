## Context

The `/noche-parejas` registration form (`NocheParejasForm.tsx`) currently captures a single person (nombre, apellido, email, teléfono) and persists it as an `event_subscriptions` row for the seeded "Noche de Parejas" event via the `create_subscription_with_increment` RPC (see `src/lib/services/events.ts`). Because this is a couples event, the team needs both spouses' details plus the couple's relationship status, and needs to be warned — and blocked — when either email is already registered.

Existing patterns to follow:
- **Desayuno** (`desayuno_registrations` table + `create_desayuno_registration` SECURITY DEFINER RPC, RLS enabled, write-only through the function, admin-only SELECT policy) is the closest analogue for a self-contained registration table. See `supabase/migrations/20260809150955_add_desayuno_registrations.sql`.
- **Consolidation** (`consolidation.ts` validation) shows the established pattern for a required select backed by a `const` options tuple and `z.enum`.
- Service → hook → component layering; TanStack Form with per-field Zod `safeParse` validators; Biome tabs/double-quotes.

## Goals / Non-Goals

**Goals:**
- Capture registrant + cónyuge (nombre, apellido, email, teléfono) and a required couple relationship-status select.
- Persist a couple as one row in a new `noche_parejas_couples` table.
- Before persisting, check both emails against existing Noche de Parejas registrations; block and explain if either is already registered, preserving the form values.
- Reuse existing UI primitives (`input`, `label`, `select`) and match the campaign styling already in the form.

**Non-Goals:**
- No migration of prior `event_subscriptions` rows for the event.
- No capacity/`current_count` tracking for couples (the current form already relies only on the event existing; couples table has no capacity concept here).
- No change to the success page (`/noche-parejas/registro-exitoso`) beyond it still being the post-submit destination.

## Decisions

### Decision: Dedicated `noche_parejas_couples` table
Store both people and the relationship in one row rather than reusing `event_subscriptions` (single-person shape) or two linked rows.

Columns:
```
id                   UUID PK default gen_random_uuid()
name                 TEXT NOT NULL   -- registrant
lastname             TEXT NOT NULL
email                TEXT NOT NULL
phone                TEXT NOT NULL
conyuge_name         TEXT NOT NULL
conyuge_lastname     TEXT NOT NULL
conyuge_email        TEXT NOT NULL
conyuge_phone        TEXT NOT NULL
relationship         TEXT NOT NULL   -- one of the couple-status options
accepts_data_policy  BOOLEAN NOT NULL DEFAULT FALSE
created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
```
RLS enabled; write-only through a SECURITY DEFINER RPC; admin-only SELECT policy (mirrors desayuno) so a future dashboard view has read access.

**Alternatives considered:** two rows per couple (complicates reads and duplicate logic); new columns on `event_subscriptions` (pollutes a shared table used across all events). Rejected per the couples-table decision confirmed with the requester.

### Decision: RPC surface — `create_noche_parejas_couple` + `check_noche_parejas_emails`
- `create_noche_parejas_couple(p_name, p_lastname, p_email, p_phone, p_conyuge_name, p_conyuge_lastname, p_conyuge_email, p_conyuge_phone, p_relationship, p_accepts_data_policy)` — SECURITY DEFINER `INSERT`, returns void (mirrors `create_desayuno_registration`).
- `check_noche_parejas_emails(p_emails TEXT[]) RETURNS TEXT[]` — SECURITY DEFINER; returns the subset of the passed emails that already exist in `noche_parejas_couples` (matching either `email` or `conyuge_email`, case-insensitive). Returning the array lets the client name exactly which email(s) collided.

Duplicate detection is a **pre-submit check**, not a DB unique constraint, because the requirement is to explain which email collided (the client can only do that if it knows the specific colliding address), and because the same person could appear as registrant in one row and cónyuge in another. No unique constraint is added.

**Alternatives considered:** a single `create` RPC that raises on duplicate (`23505`) — rejected because it can't cleanly tell the client *which* email collided and couples the check to insert ordering.

### Decision: Relationship options as a shared const tuple
```ts
export const RELATIONSHIP_OPTIONS = [
  "Casados", "Novios", "Comprometidos", "Unión libre",
] as const;
```
Validated with `z.enum(RELATIONSHIP_OPTIONS, { message: "Debes seleccionar una opción" })`, mirroring `CONNECT_OPTIONS` in `consolidation.ts`. Rendered with the existing `src/components/ui/select.tsx`.

### Decision: Client flow in `NocheParejasForm`
On submit (after client-side Zod validation passes):
1. Call the email-check hook with `[email, conyugeEmail]`.
2. If it returns any collisions, show a Spanish warning naming which email is already registered (registrant vs. cónyuge, resolved by matching the returned address), do **not** call create, keep form state, stay on page.
3. Otherwise call `create_noche_parejas_couple`; on success navigate to `/noche-parejas/registro-exitoso`; on failure show the generic error toast.

Replace `useNocheParejasEvent` + `useCreateSubscription` usage in this form with a new `useCreateNocheParejasCouple` mutation hook and a `useCheckNocheParejasEmails` (or a combined service call inside the mutation). The event-id lookup is no longer needed for this form.

### Decision: Dashboard section mirrors Desayuno
Add the admin view by cloning the Desayuno pattern rather than inventing a new one, since Desayuno already solves the same shape (a standalone registration table with sort/search/paginate/CSV over the full result set).
- **Tab**: extend the `DashboardSection` union to `"eventos" | "consolidacion" | "desayuno" | "noche-parejas"`, add `{ id: "noche-parejas", label: "Noche de Parejas" }` to `TABS`, and render `<NocheParejasSection />` for it in `dashboard.tsx` (only the active tab mounts, so data fetches lazily as today).
- **Fetch**: `fetchNocheParejasCouples()` pages through Supabase (`PAGE_SIZE = 1000`, `range` loop) exactly like `fetchDesayunoRegistrations`; read is gated by the admin SELECT RLS policy on the table.
- **Hook**: `useNocheParejasCouples()` with query key `["dashboard", "noche-parejas-couples"]`.
- **Table** (`NocheParejasTable.tsx`, cloned from `DesayunoTable.tsx`): columns `#`, "Nombre", "Apellido", "Email", "Celular", "Cónyuge" (conyuge nombre + apellido), "Email cónyuge", "Celular cónyuge", "Relación", "Política de datos", "Fecha". Default sort `created_at desc`. Global filter matches across all eight name/email/phone fields (both people). CSV via `downloadCSV` with the same column labels; filename `noche-parejas-registros-YYYY-MM-DD.csv`.
- **Type**: reuse `Tables<"noche_parejas_couples">` from the regenerated `database.types.ts` (as Desayuno does with `Tables<"desayuno_registrations">`).

**Alternatives considered:** a shared generic registrations table parameterized by column config — rejected as premature; the couple columns differ enough that cloning is clearer and lower-risk than a first abstraction.

### Decision: Files
- `supabase/migrations/<ts>_add_noche_parejas_couples.sql` — table, RLS, RPCs, admin SELECT policy.
- Regenerate `src/lib/database.types.ts` (auto-generated; do not hand-edit).
- `src/lib/validations/noche-parejas.ts` — extend schema + `RELATIONSHIP_OPTIONS`.
- `src/lib/services/nocheParejas.ts` — `createNocheParejasCouple`, `checkNocheParejasEmails`, `fetchNocheParejasCouples`.
- `src/lib/hooks/useCreateNocheParejasCouple.ts` (+ email-check helper), `src/lib/hooks/useNocheParejasCouples.ts`.
- `src/components/forms/NocheParejasForm.tsx` — new fields, relationship select, duplicate-block logic.
- `src/components/dashboard/DashboardTabs.tsx` — new tab + union.
- `src/components/dashboard/NocheParejasSection.tsx`, `src/components/dashboard/NocheParejasTable.tsx` — new admin view.
- `src/routes/dashboard.tsx` — render the new section.
- Tests: `noche-parejas.test.ts`, `NocheParejasForm.test.tsx`, and dashboard section/table tests.

## Risks / Trade-offs

- **[No DB-level uniqueness]** A determined user could still create duplicate couples if timing races the pre-submit check → Acceptable: the product requirement is a user-facing block, not strict data integrity; volume is low and admins can dedupe. Revisit with a constraint if abuse appears.
- **[Wide couples table on mobile]** Eleven columns (both spouses + relationship) is wide → Mitigated by the same horizontal-scroll-within-card pattern Desayuno uses; the page body never scrolls horizontally.
- **[Two round-trips on submit]** email-check then insert adds latency → Negligible for this low-traffic form; keeps the "name the colliding email" UX clean.
- **[Copy/label clarity]** Two people's fields on one form can confuse → Mitigated by grouping registrant vs. cónyuge sections with clear Spanish headings.

## Migration Plan

1. Add and apply the SQL migration (table + RLS + RPCs + admin policy).
2. Regenerate `database.types.ts`.
3. Ship frontend changes (validation, service, hooks, form, tests) in the same PR.
4. **Rollback:** revert the frontend PR; the new table/RPCs are additive and can be left in place or dropped separately (no existing feature depends on them). Prior `event_subscriptions` rows for the event are untouched throughout.

## Open Questions

- None blocking. Final relationship-option wording ("Unión libre" casing, whether to add "Otro") can be tuned during implementation without changing the design.
