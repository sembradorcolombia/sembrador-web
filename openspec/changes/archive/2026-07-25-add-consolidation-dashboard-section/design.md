## Context

`src/routes/dashboard.tsx` is a single component that gates on `app_metadata.is_admin`, calls `useDashboardData()`, and renders `<SubscriberSearch />` plus one `<EventCard />` per event. All loading/error handling is at the page level: a failed fetch replaces the entire page — header, logout button and all — with a centered error message.

`consolidation_registrations` is written today only through the `create_consolidation_registration` RPC (`src/lib/services/consolidation.ts`). Nothing reads it from the client, so it has no `SELECT` policy.

The subscribers table (`SubscribersTable.tsx`) already establishes the pattern this change should reuse: `@tanstack/react-table` with `getSortedRowModel` + `getPaginationRowModel`, `ArrowUpDown` sort headers built from the `Button` primitive, page size 20, and CSV export via `downloadCSV()` from `src/lib/csv.ts` driven off `table.getSortedRowModel().rows`.

## Goals / Non-Goals

**Goals:**

- Separate event tooling from consolidation tooling on `/dashboard` without changing event behavior.
- Give the pastoral team a sortable, searchable, exportable view of consolidation registrations.
- Keep loading and error states scoped to the active section.
- Avoid fetching consolidation data for admins who only use the events tab.

**Non-Goals:**

- No editing, status tracking, assignment, or deletion of registrations — read-only this round.
- No new routes, URL params, or deep links for the active tab.
- No server-side pagination, filtering, or sorting; the dataset is small enough to handle client-side.
- No changes to the public `/consolidacion` form.
- No shared/generic "data table" abstraction extracted from the two tables (see Decisions).

## Decisions

### Tabs as local component state, not routes

The active section is `useState<"eventos" | "consolidacion">("eventos")` inside `DashboardPage`, rendering one section component or the other.

*Why:* the dashboard has a single `beforeLoad` admin guard that would have to be lifted into a layout route and re-verified per child. Nested routes (`/dashboard/eventos`, `/dashboard/consolidacion`) would also need an index redirect, and touch `routeTree.gen.ts`. The only thing gained is deep-linking a tab, which nobody has asked for. Conditional rendering — not CSS hiding — is what makes "don't fetch the inactive section" fall out for free, since the inactive section's hook never mounts.

*Alternative considered:* a `?tab=` search param on the existing route. Cheaper than nested routes and deep-linkable, but adds validated search-param plumbing for a two-item switcher; rejected as premature. It stays an easy follow-up because the tab state lives in exactly one place.

### Extract the current page body into `EventsSection`

`dashboard.tsx` becomes a shell: header, tab switcher, active section. The existing `useDashboardData()` call, loading state, and error state move verbatim into `src/components/dashboard/EventsSection.tsx`.

*Why:* this is what moves loading/error handling from page scope to section scope, satisfying the "section error does not break the shell" requirement, and it keeps the route file thin. `SubscriberSearch`, `EventCard`, and `SubscribersTable` are untouched.

### New read function in the existing consolidation service

`fetchConsolidationRegistrations()` joins `createConsolidationRegistration` in `src/lib/services/consolidation.ts`, paging with `.range()` at `PAGE_SIZE = 1000` in the same loop shape as `fetchAllSubscriptionsForEvent`, ordered `created_at` descending. The row type is `Tables<"consolidation_registrations">` from the generated `database.types.ts` — no hand-written interface.

*Why:* Supabase caps rows per response, so a single `select("*")` silently truncates once the table grows. The loop already exists in `dashboard.ts`; copying its shape is cheaper than abstracting it, and the two will diverge if either ever moves to server-side filtering.

### Client-side sorting, filtering, and pagination via TanStack Table

`ConsolidationTable` mirrors `SubscribersTable`: `useReactTable` with core/sorted/pagination row models, `PAGE_SIZE = 20`, initial sort `[{ id: "created_at", desc: true }]`.

Search is a **custom `globalFilterFn`** over `email`, `name`, `lastname`, and `mobile`, wired through `state.globalFilter` and `getFilteredRowModel()`, rather than a filter applied to the array before it reaches the table.

*Why the global filter over pre-filtering:* it makes `table.getFilteredRowModel().rows` the single source of truth for the row count, the pagination range, and the CSV export, so filter/sort/export/pagination cannot drift out of sync. Pre-filtering would require threading the filtered array through three places by hand.

*Why client-side at all:* consolidation volume is in the hundreds; a full fetch plus in-memory filtering is instant and avoids debounced round-trips. If this ever reaches tens of thousands of rows, the service function is the single seam to move filtering server-side.

### CSV export reads the sorted+filtered row model

`handleDownloadCSV` maps `table.getSortedRowModel().rows` — which reflects the global filter — not the raw data array and not the current page. Headers are the Spanish column labels; the filename is `consolidacion-registros-${YYYY-MM-DD}.csv`. Escaping is delegated to the existing `downloadCSV()`, which already handles commas, quotes, newlines, and formula-injection prefixes.

### Search UI lives above the table, not in a separate card

Unlike `SubscriberSearch` — a standalone card that searches across events and lists ad-hoc results — the consolidation search is an input above the table that drives the table's own filter state, so filtered results keep sorting, pagination, and export.

### Two similar tables, no shared abstraction

`ConsolidationTable` and `SubscribersTable` will share visual structure and duplicate the header/pagination markup.

*Why:* their columns, actions (attendance checkbox, confirmation-link copy), and data shapes have nothing in common beyond layout. A generic table component parameterized over all of that would be larger than both. Revisit only if a third table appears.

### Supabase `SELECT` policy is a prerequisite, applied out-of-band

The table needs an RLS policy granting `SELECT` to admins only (matching how other admin reads are authorized). This is a database change applied via the Supabase dashboard/migration, not through this repo, and it must land **before or with** the frontend deploy.

## Risks / Trade-offs

- **Frontend ships before the RLS policy exists** → the section renders an empty table with no error, because RLS returns zero rows rather than failing. Treat the policy as a release gate: verify as a non-admin that the query returns nothing, and as an admin that it returns rows, before merging.
- **The policy is written too permissively** (e.g. `USING (true)`) → registration data including emails and phone numbers becomes publicly readable via the anon key. The policy must be scoped to the admin claim and verified with an anonymous client, not just assumed from a successful admin read.
- **Full-table fetch grows unbounded** → the paging loop keeps correctness but the payload and in-memory filter cost grow linearly. Acceptable at current volume; the service function is the seam for server-side filtering later.
- **Extracting `EventsSection` regresses event behavior** → the move is a verbatim relocation of existing JSX and hook calls, and the existing dashboard tests plus the E2E suite cover it. Do not refactor event code while moving it.
- **Tab state is not in the URL** → a browser refresh returns to "Eventos", and a tab cannot be linked or bookmarked. Accepted; adding a `?tab=` param later touches only `DashboardPage`.
- **Comments can be long** → an unbounded comment column can blow out the table width on mobile. Constrain the cell width and truncate, keeping the full text available via `title`.
