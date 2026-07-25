## Why

Consolidation registrations submitted at `/consolidacion` land in the `consolidation_registrations` Supabase table, but the pastoral team has no way to see them — the admin dashboard only surfaces event subscriptions. Follow-up currently requires querying the database directly. At the same time, the dashboard mixes all event tooling into one flat page, so adding a second, unrelated dataset to it would make it worse.

## What Changes

- Split `/dashboard` into two named sections selected by an in-page tab switcher: **Eventos** (everything the dashboard does today) and **Consolidación** (new).
- The **Eventos** tab keeps the existing subscriber search + per-event cards with their subscriber tables, unchanged in behavior.
- Add a **Consolidación** tab that lists every row of `consolidation_registrations` in a sortable table: nombre, apellido, email, celular, cómo quiere conectar, comentario, fecha.
- The consolidation table supports column sorting, pagination, and CSV export of the current sort order — matching the existing subscribers table.
- Add a search box over consolidation registrations that matches against **email, nombre, apellido, and celular** simultaneously.
- Data for each tab is fetched only when that tab is first opened, so opening the dashboard does not pay for both datasets.

## Capabilities

### New Capabilities

- `admin-dashboard-sections`: The `/dashboard` page is divided into named sections (Eventos, Consolidación) with a tab switcher, per-section data loading, and the admin-only guard applying to all sections.
- `consolidation-admin-view`: Admin listing of consolidation registrations — sortable table, multi-field search, pagination, and CSV export.

### Modified Capabilities

<!-- None. There is no existing spec covering the admin dashboard, and the
     consolidation-registration spec covers the public form only; this change
     adds read-side capabilities without altering the form's requirements. -->

## Impact

- **Routes:** `/dashboard` only. No new routes, no redirects, no URL changes.
- **New code:** `src/lib/services/consolidation.ts` gains a read function; new `useConsolidationRegistrations` hook; new components `DashboardTabs`, `ConsolidationSection`, `ConsolidationTable`. The search box lives inside `ConsolidationTable` driving the table's own filter state rather than in a separate component, so filter, sort, pagination, and export cannot drift apart (see `design.md`).
- **Modified code:** `src/routes/dashboard.tsx` (tab shell), extraction of the current body into an `EventsSection` component.
- **Supabase:** requires a `SELECT` policy on `consolidation_registrations` for admin users. The table is currently write-only via the `create_consolidation_registration` RPC, so an RLS policy must be added before the view returns rows.
- **Dependencies:** none new — `@tanstack/react-table`, `lucide-react`, `sonner`, and `src/lib/csv.ts` are already in use by the subscribers table.
- **Bundle size:** negligible; all libraries are already loaded on the `/dashboard` chunk, which is code-split away from public routes.
