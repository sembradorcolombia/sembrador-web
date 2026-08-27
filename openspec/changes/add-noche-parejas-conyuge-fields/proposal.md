## Why

The "Noche de Parejas" (Cena para parejas) is a couples event, but the registration form only captures one person. The team needs both spouses' contact details plus the couple's relationship status to plan seating, communications, and follow-up. It must also flag when either email is already registered so a couple isn't accidentally double-booked, blocking that submission with a clear reason.

## What Changes

- Add cónyuge (spouse) fields to the `/noche-parejas` form: **nombre**, **apellido**, **email**, **teléfono**, plus a **relationship status** select (Casados, Novios, Comprometidos, Unión libre) that describes the couple.
- Extend the Zod validation schema to cover all new fields (name length, email format/quality, 10-digit phone, required relationship).
- **BREAKING (persistence)**: Stop persisting Noche de Parejas registrations as generic `event_subscriptions` rows via `create_subscription_with_increment`. Persist to a new dedicated `noche_parejas_couples` table that holds registrant + cónyuge details and relationship in a single row.
- On submit, check **both** the registrant's and the cónyuge's email against existing Noche de Parejas registrations. If either is already registered, **block** the submission and show a warning naming which email is already registered; the form keeps its values so the user can correct it.
- Add a new **"Noche de Parejas"** tab to the admin dashboard: a read-only listing of every couple registration (both spouses + relationship), with sorting, multi-field search, pagination, and CSV export — mirroring the existing Desayuno section.
- Keep the existing campaign chrome, data-policy checkbox, and success page flow unchanged.

## Capabilities

### New Capabilities
- `noche-parejas-admin-view`: The "Noche de Parejas" dashboard section — read-only listing of `noche_parejas_couples` rows (registrant + cónyuge + relationship) with sorting, multi-field search, pagination, CSV export, and admin-only read access.

### Modified Capabilities
- `noche-parejas-landing`: The registration form gains cónyuge fields and a relationship-status select; validation covers the new fields; persistence moves from `event_subscriptions` to a dedicated `noche_parejas_couples` table; the duplicate-email rule changes from a post-insert "Ya estás inscrito" toast to a pre-submit check of both emails that blocks and explains which email is already registered.

## Impact

- **DB (Supabase)**: new `noche_parejas_couples` table; new RPC `create_noche_parejas_couple` (insert + guard) and `check_noche_parejas_emails` (or reuse of a lookup) to detect existing registrations by email; regenerated `src/lib/database.types.ts`.
- **Frontend**:
  - `src/lib/validations/noche-parejas.ts` — schema gains `conyugeName`, `conyugeLastname`, `conyugeEmail`, `conyugePhone`, `relationship`.
  - `src/lib/services/` — new `nocheParejas.ts` service (create + email check) replacing use of `createSubscription` for this form.
  - `src/lib/hooks/` — new hook(s) for creating a couple registration and checking emails; `useNocheParejasEvent`/`useCreateSubscription` usage removed from this form.
  - `src/components/forms/NocheParejasForm.tsx` — new fields, relationship select, duplicate-email blocking/warning.
  - Tests: `NocheParejasForm.test.tsx` and `noche-parejas.test.ts` updated for new fields and duplicate-block behavior.
- **Dashboard**:
  - `src/lib/services/nocheParejas.ts` — `fetchNocheParejasCouples()` (paged fetch, mirror desayuno).
  - `src/lib/hooks/useNocheParejasCouples.ts` — TanStack Query listing hook.
  - `src/components/dashboard/DashboardTabs.tsx` — new "Noche de Parejas" tab; `DashboardSection` union extended.
  - `src/components/dashboard/NocheParejasSection.tsx` + `NocheParejasTable.tsx` — new section + table (mirror Desayuno).
  - `src/routes/dashboard.tsx` — render the new section for the new tab.
  - Tests for the new section/table.
- **UI primitives**: reuse existing `select` and `table` components (`src/components/ui/`).
- **No new npm dependencies**; negligible bundle impact (dashboard + one route chunk).
