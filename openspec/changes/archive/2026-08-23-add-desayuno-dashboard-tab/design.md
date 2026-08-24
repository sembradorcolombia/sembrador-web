## Context

The admin dashboard (`/dashboard`) currently splits its content into two tabs, "Eventos" and "Consolidación", via an in-page tab switcher (`DashboardTabs`). Only the active section is mounted, so each section owns its own data fetching, loading, and error states. The "Consolidación" tab is a mature, self-contained pattern: a service function that pages through the full table, a TanStack Query hook, a `Section` wrapper (count + loading/error), and a `Table` built on `@tanstack/react-table` with sorting, multi-field search, pagination, and CSV export.

Breakfast registrations land in `desayuno_registrations` (columns: `id`, `name`, `lastname`, `email`, `phone`, `accepts_data_policy`, `created_at`) via the `create_desayuno_registration` SECURITY DEFINER RPC. The table has RLS enabled but **no policies**, so it is write-only today — there is no admin read path. This change adds the read view and the missing read policy.

## Goals / Non-Goals

**Goals:**
- Give admins a "Desayuno" dashboard tab with the same tooling as "Consolidación": listing, sorting, multi-field search, pagination, total count, and CSV export.
- Retrieve the complete result set, not just the first Supabase page.
- Restrict read access to authenticated admins at the database layer.
- Reuse existing patterns and components so the new section is consistent and adds no new dependencies.

**Non-Goals:**
- No editing, deleting, or exporting individual registrations beyond CSV.
- No new route — the tab lives inside `/dashboard`.
- No changes to the public `/desayuno` registration form or RPC.
- No cross-tab shared state or deep-linking to a specific tab (tabs remain in-memory `useState`, matching today's behavior).

## Decisions

**Mirror the consolidation pattern rather than abstracting a shared table.**
The consolidation and desayuno views differ in columns, search fields, and CSV shape, and are the only two instances. Cloning `ConsolidationSection` → `DesayunoSection` and `ConsolidationTable` → `DesayunoTable` keeps each view independently readable and avoids a premature generic abstraction. *Alternative considered:* a generic `RegistrationsTable<T>` with column config — rejected as over-engineering for two call sites; can be revisited if a third similar tab appears.

**Columns shown:** `#`, "Nombre", "Apellido", "Email", "Celular", "Política de datos" (Sí/No from `accepts_data_policy`), "Fecha". Search matches `name`, `lastname`, `email`, `phone` case-insensitively (a row passes if any field matches), matching the consolidation search semantics. There is no comment/next-step equivalent in this table.

**Add the fetch function to the existing `src/lib/services/desayuno.ts`** (which currently only holds `createDesayunoRegistration`), exporting `DesayunoRegistration = Tables<"desayuno_registrations">` and `fetchDesayunoRegistrations()` that pages in blocks of 1000 ordered by `created_at` descending — identical to `fetchConsolidationRegistrations`.

**Add the RLS SELECT policy via a new migration**, copying the consolidation admin-select policy verbatim except for the table name. Admin status is read from `auth.jwt() -> 'app_metadata' ->> 'is_admin'`, the same claim the route guard checks.

**Third tab wiring.** Extend `DashboardSection` to `"eventos" | "consolidacion" | "desayuno"`, add the `{ id: "desayuno", label: "Desayuno" }` entry to `TABS`, and extend the render switch in `dashboard.tsx` from a ternary to a lookup/switch so three sections read cleanly.

## Risks / Trade-offs

- **Duplication between consolidation and desayuno tables** → Accepted deliberately (see Decisions); the two files stay small and self-contained, and divergence is expected.
- **Forgetting the RLS policy would leave the tab silently empty** (RLS returns zero rows, not an error) → The migration is part of this change and its behavior is covered by an explicit spec scenario; verify against the deployed database after applying.
- **PII exposure (email, phone) in CSV export** → Same exposure already accepted for consolidation; access is admin-only at both the route and database layers, and the CSV utility escapes values to prevent formula injection.

## Migration Plan

1. Add and apply the SQL migration granting authenticated admins `SELECT` on `desayuno_registrations`.
2. Ship the service function, hook, section, table, and tab wiring.
3. Deploy; verify an admin sees rows in the new tab and a non-admin/anonymous query returns none.
4. **Rollback:** the feature is additive — reverting the frontend removes the tab; the SELECT policy can be dropped independently with no impact on the write path (RPC is SECURITY DEFINER).

## Open Questions

- None. Column set, search fields, and access model follow the established consolidation precedent.
