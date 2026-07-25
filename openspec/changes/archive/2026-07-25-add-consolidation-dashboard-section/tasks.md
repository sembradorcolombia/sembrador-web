## 1. Database prerequisite

- [x] 1.1 Add an RLS `SELECT` policy on `consolidation_registrations` in Supabase granting read access only to admin users (matching how existing admin reads are authorized); confirm RLS is enabled on the table
  - Applied `supabase/migrations/20260725120000_add_consolidation_registrations_admin_select_policy.sql` to the Supabase project. `pg_class.relrowsecurity` is `true`; the table previously had zero policies and now has exactly one: `"Admins can read consolidation registrations"` (SELECT, `authenticated`).
  - The claim expression matches the existing `event_subscriptions` admin convention (`auth.jwt() -> 'app_metadata' ->> 'is_admin'`), with `COALESCE(..., false)` so a missing claim is denied rather than null.
- [x] 1.2 Verify with an anonymous/non-admin client that querying `consolidation_registrations` returns zero rows, and with an admin session that it returns rows
  - Verified in a rolled-back transaction with one probe row inserted: `anon` → 0 rows, `authenticated` without `is_admin` → 0 rows, `authenticated` with `is_admin: true` → 1 row. Table left empty (0 rows) afterwards.
- [x] 1.3 Regenerate `src/lib/database.types.ts` only if the policy work changed the schema (the table already exists in the generated types — do not hand-edit)
  - No-op: a policy does not change the schema, and the table is already present in the generated types.

## 2. Data layer

- [x] 2.1 Add `ConsolidationRegistration = Tables<"consolidation_registrations">` and `fetchConsolidationRegistrations()` to `src/lib/services/consolidation.ts`, paging with `.range()` at `PAGE_SIZE = 1000` and ordering by `created_at` descending (mirror `fetchAllSubscriptionsForEvent` in `dashboard.ts`)
- [x] 2.2 Create `src/lib/hooks/useConsolidationRegistrations.ts` wrapping the service with `useQuery` under the key `["dashboard", "consolidation-registrations"]`

## 3. Dashboard section split

- [x] 3.1 Create `src/components/dashboard/EventsSection.tsx` by moving the `useDashboardData()` call, loading state, error state, `SubscriberSearch`, and `EventCard` list verbatim out of `src/routes/dashboard.tsx` — no behavior changes
- [x] 3.2 Rewrite `src/routes/dashboard.tsx` as a shell: keep the `beforeLoad` admin guard, header, email, and "Salir" button always rendered; add `useState<"eventos" | "consolidacion">("eventos")` and conditionally render the active section
- [x] 3.3 Create `src/components/dashboard/DashboardTabs.tsx` — an accessible tab switcher (`role="tablist"`, `aria-selected`) with the Spanish labels "Eventos" and "Consolidación", styled with Tailwind and usable on viewports narrower than 640px
- [x] 3.4 Confirm the inactive section is not rendered (not merely hidden) so its query hook never mounts
  - Enforced by a ternary in the route shell and covered by a test asserting `useConsolidationRegistrations` is never called while "Eventos" is active.

## 4. Consolidation section

- [x] 4.1 Create `src/components/dashboard/ConsolidationSection.tsx`: call `useConsolidationRegistrations()`, render section-scoped loading and Spanish error states, show the total registration count, and render the search box plus table
- [x] 4.2 Create `src/components/dashboard/ConsolidationTable.tsx` using `useReactTable` with core/sorted/filtered/pagination row models, `PAGE_SIZE = 20`, and initial sorting `[{ id: "created_at", desc: true }]`
- [x] 4.3 Define the columns: `#` (page-aware index, unsortable), Nombre, Apellido, Email, Celular, Conectar (`next_step`), Comentario, Fecha (`created_at` formatted `es-CO`) — with `ArrowUpDown` sort headers on all columns except `#` and Comentario, following the `SubscribersTable` header pattern
- [x] 4.4 Render `—` for a null `comment`, and constrain/truncate the comment cell width with the full text in `title`
- [x] 4.5 Add the search input above the table (`Input` primitive + `Search` icon) wired to `state.globalFilter` with a custom `globalFilterFn` matching case-insensitively against `email`, `name`, `lastname`, and `mobile`
- [x] 4.6 Show "No se encontraron resultados" when a query matches nothing, and "No hay registros aun." when there are no registrations at all
- [x] 4.7 Add pagination controls showing the current range and total from `getFilteredRowModel().rows`, hidden when there is only one page
- [x] 4.8 Add the "Descargar CSV" button using `downloadCSV()` over `table.getSortedRowModel().rows` (all matching rows, not just the visible page), with Spanish headers and filename `consolidacion-registros-${YYYY-MM-DD}.csv`
- [x] 4.9 Wrap the table in an `overflow-x-auto` container so it scrolls within itself on mobile without the page body scrolling horizontally

## 5. Testing

- [x] 5.1 Add `src/components/dashboard/__tests__/ConsolidationTable.test.tsx` covering: rows render with all columns, `—` for a null comment, sorting toggles ascending/descending, search matches each of email/name/lastname/mobile, no-results message, and CSV export contents reflect the active filter and sort
- [x] 5.2 Add a test for `DashboardTabs` (or `dashboard.tsx`) asserting "Eventos" is active on load, switching renders the consolidation section, and switching back restores events
  - Covered in `src/routes/__tests__/-dashboard.test.tsx`, testing the shell rather than `DashboardTabs` in isolation so tab state and section rendering are asserted together.
- [x] 5.3 Assert consolidation data is not fetched while the "Eventos" tab is active
- [x] 5.4 Add a test that a section-level error keeps the header, "Salir" button, and tab switcher rendered
  - Covered for both sections' error states.
- [x] 5.5 Run `pnpm test` and confirm existing dashboard tests (`EventCard`, `SubscriberSearch`, `SubscribersTable`) still pass after the `EventsSection` extraction
  - 137 tests pass across 14 files.

## 6. Verification

- [x] 6.1 Run `pnpm check` (Biome lint + format) and fix any findings
  - Clean. Two warnings remain, both pre-existing (`useEventSeriesData.test.ts`, `useConfirmAttendance.ts`).
- [x] 6.2 Run `pnpm build` and confirm the TypeScript type-check passes
- [x] 6.3 Run `pnpm test:e2e` to confirm no regression in the existing dashboard flows
  - 18 passed, including `dashboard-csv` and `auth-flow`.
- [x] 6.4 Manually verify in the browser as an admin: both tabs load, sorting/search/pagination/CSV behave, and the layout holds on a mobile viewport
  - Driven in a real Chromium session via a throwaway Playwright spec (deleted afterwards) with an admin session and 25 mocked registrations, since the production table is still empty.
  - Verified: "Eventos" active on load with event cards; switching to "Consolidación" shows "25 registros"; default sort is `created_at` desc; `—` renders for null comments; Nombre sort toggles asc/desc; pagination goes 1–20 → 21–25 and back; search matches lastname, email, and mobile; "No se encontraron resultados" on a miss; CSV downloads as `consolidacion-registros-YYYY-MM-DD.csv` with Spanish headers and only the filtered row; switching back restores Eventos.
  - Mobile (375×812): page body does not scroll horizontally (`scrollWidth === clientWidth`); the table scrolls within itself (894px content in a 311px viewport) and scrolling right reveals Comentario/Fecha; long comments truncate with the full text in `title`.

## 7. Post-verification follow-ups

- [x] 7.1 Rename the migration to `20260725191724_...` to match the version recorded remotely, so a later `supabase db push` does not re-run `CREATE POLICY` and fail
- [x] 7.2 Add `src/lib/services/__tests__/consolidation.test.ts` covering the `.range()` paging loop: single short page, full page followed by a partial page, full page followed by an empty page, empty table, and error propagation
- [x] 7.3 Add pagination coverage to `ConsolidationTable.test.tsx` with a 25-row fixture: 20 rows per page, the "Mostrando X–Y de Z" range, next/previous navigation, controls hidden on a single page, and sorting applied across the whole result set rather than the visible page
- [x] 7.4 Give the pagination buttons `aria-label`s ("Página anterior" / "Página siguiente") — they were icon-only with no accessible name
- [x] 7.5 Drop the redundant `overflow-x-auto` wrapper around `Table`, which already provides its own `overflow-auto` container
- [x] 7.6 Reconcile `proposal.md` with the built design: no separate `ConsolidationSearch` component; the search drives the table's own filter state
