## Why

Breakfast (`/desayuno`) registrations are written to the `desayuno_registrations` table but there is no way for the team to see them without querying the database directly — the dashboard only exposes "Eventos" and "Consolidación". A dedicated dashboard tab gives the team the same self-service view they already have for consolidation.

## What Changes

- Add a third dashboard tab, "Desayuno", alongside "Eventos" and "Consolidación".
- The new section lists every `desayuno_registrations` row (Nombre, Apellido, Email, Celular, Política de datos, Fecha) with the same tooling the "Consolidación" tab already offers: full result-set retrieval, column sorting, multi-field search, pagination, total count, and CSV export.
- Add a Supabase RLS policy granting authenticated admins `SELECT` on `desayuno_registrations` (the table currently has RLS enabled but no read policy, so it is write-only through the RPC).
- Add a service function + TanStack Query hook to fetch all breakfast registrations, mirroring the consolidation service.
- The section fetches its data only when the tab is first activated, and its loading/error states stay scoped to the section.

## Capabilities

### New Capabilities
- `desayuno-admin-view`: the read-only "Desayuno" dashboard section — listing, sorting, multi-field search, pagination, CSV export, admin-only read access, and responsive behavior over `desayuno_registrations`.

### Modified Capabilities
- `admin-dashboard-sections`: the dashboard now presents three tabs instead of two ("Eventos", "Consolidación", "Desayuno"); the default-section, per-section data-loading, section-scoped states, admin-guard, and responsive-tabs requirements extend to cover the new section.

## Impact

- **New code:** `src/lib/services/desayuno.ts` (add a fetch function), `src/lib/hooks/useDesayunoRegistrations.ts`, `src/components/dashboard/DesayunoSection.tsx`, `src/components/dashboard/DesayunoTable.tsx`.
- **Modified code:** `src/components/dashboard/DashboardTabs.tsx` (add tab), `src/routes/dashboard.tsx` (render new section).
- **Database:** new migration `supabase/migrations/*_add_desayuno_registrations_admin_select_policy.sql`.
- **No new npm dependencies** — reuses `@tanstack/react-table`, existing CSV utility, and UI primitives. Bundle impact is limited to the new dashboard-only components, which are auto code-split with the `/dashboard` route.
- **No route or redirect changes** — the tab lives inside the existing `/dashboard` route.
