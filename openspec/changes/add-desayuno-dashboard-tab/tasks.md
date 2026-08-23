## 1. Database access

- [x] 1.1 Add migration `supabase/migrations/<timestamp>_add_desayuno_registrations_admin_select_policy.sql` creating a SELECT policy on `desayuno_registrations` for the `authenticated` role, gated on `app_metadata.is_admin` (mirror the consolidation admin-select policy)
- [x] 1.2 Apply the migration to the Supabase project and confirm an admin can read rows while an anonymous/non-admin query returns none

## 2. Data layer

- [x] 2.1 In `src/lib/services/desayuno.ts`, export `DesayunoRegistration = Tables<"desayuno_registrations">` and `fetchDesayunoRegistrations()` that pages through all rows in blocks of 1000 ordered by `created_at` descending (mirror `fetchConsolidationRegistrations`)
- [x] 2.2 Add `src/lib/hooks/useDesayunoRegistrations.ts` wrapping `fetchDesayunoRegistrations` in a TanStack Query hook with query key `["dashboard", "desayuno-registrations"]`

## 3. UI components

- [x] 3.1 Create `src/components/dashboard/DesayunoTable.tsx` based on `ConsolidationTable`: columns `#`, "Nombre", "Apellido", "Email", "Celular", "Política de datos" (Sí/No from `accepts_data_policy`), "Fecha"; sorting on name/lastname/email/celular/fecha; multi-field search over name/lastname/email/phone; pagination; empty state "No hay registros aun." and no-match state "No se encontraron resultados"
- [x] 3.2 Add CSV export to `DesayunoTable` respecting active filter and sort across all pages, with filename `desayuno-registros-YYYY-MM-DD.csv` and Spanish header labels
- [x] 3.3 Create `src/components/dashboard/DesayunoSection.tsx` based on `ConsolidationSection`: loading, error, and total-count display wrapping `DesayunoTable`

## 4. Dashboard wiring

- [x] 4.1 In `src/components/dashboard/DashboardTabs.tsx`, extend `DashboardSection` to include `"desayuno"` and add the `{ id: "desayuno", label: "Desayuno" }` tab entry
- [x] 4.2 In `src/routes/dashboard.tsx`, render `DesayunoSection` when the active section is `"desayuno"` (replace the two-way ternary with a switch/lookup so all three sections read cleanly)

## 5. Verification

- [x] 5.1 Run `pnpm check` (Biome) and `pnpm build` (tsc type-check) with no errors
- [x] 5.2 Manually verify in the running app: default tab is "Eventos"; activating "Desayuno" fetches and lists rows with search, sort, pagination, and CSV export; the other sections' data is not fetched until their tabs are activated
- [x] 5.3 Confirm the table scrolls horizontally within its card on a narrow (<640px) viewport without the page body scrolling
