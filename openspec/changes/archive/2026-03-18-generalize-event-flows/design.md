## Context

The current event system is tightly coupled to Equilibrio: routes live under `/equilibrio/*`, components live in `src/components/equilibrio/`, event display data comes from a static `EVENT_DETAILS_MAP` constant, and branding elements like `LogoEquilibrio.tsx` are hardcoded. The registration/subscription system in Supabase is already generic (it uses `event_id` UUIDs), but the display layer assumes a single event series.

The `setup-sanity-cms` change introduces CMS schemas for `eventSeries` and `event` documents, each event having a `supabaseEventId` field linking CMS content to Supabase registration data. This change leverages that foundation to make the entire event flow generic.

## Goals / Non-Goals

**Goals:**
- Make all event routes, components, and flows work for any event series, parameterized by `$seriesSlug`
- Replace `EVENT_DETAILS_MAP` with CMS-driven event content
- Preserve the existing scroll-snapping UX and all user flows (subscription, connection, attendance, feedback)
- Redirect all old `/equilibrio/*` URLs to `/eventos/equilibrio/*`
- Clean up Equilibrio-specific code, components, and constants

**Non-Goals:**
- Redesigning the event showcase UX (keep the scroll-snap full-screen sections)
- Changing the Supabase registration schema or RPC functions
- Adding new event-related features (e.g., event comments, sharing)
- Supporting multiple concurrent event series on the same page

## Decisions

### Decision 1: Route structure with layout routes
**Choice:** Use TanStack Router's nested layout routes:
```
src/routes/
├── eventos.tsx              # Layout route: <Outlet />
├── eventos/
│   ├── index.tsx            # Events listing page
│   ├── $seriesSlug.tsx      # Series layout route: <Outlet /> + series context
│   └── $seriesSlug/
│       ├── index.tsx        # Event showcase page (refactored from equilibrio/index.tsx)
│       ├── registro-exitoso.tsx
│       ├── conexion.tsx
│       ├── conexion-exitosa.tsx
│       ├── confirmar-asistencia.tsx
│       ├── asistencia-confirmada.tsx
│       ├── feedback.tsx
│       └── feedback-exitoso.tsx
```
**Alternative:** Flat route structure without layout nesting.
**Rationale:** Layout routes provide natural context boundaries. The `$seriesSlug.tsx` layout route can fetch the event series data once and make it available to all child routes via route context or `useParams()`.

### Decision 2: Hybrid data hook pattern
**Choice:** Create a `useEventSeriesData(seriesSlug)` hook that:
1. Fetches event series + events from CMS via `useCmsEventSeriesBySlug(slug)`
2. Fetches registration data from Supabase via `useEvents()`
3. Merges them by matching `cmsEvent.supabaseEventId` → `supabaseEvent.id`
4. Returns a unified data structure with both display content and registration stats

**Alternative:** Fetch and merge in each component individually.
**Rationale:** This mirrors the existing `useEventsWithDetails` pattern (which merges Supabase data with `EVENT_DETAILS_MAP`) but replaces the static constant with CMS data. Centralizing the merge logic avoids duplication across components.

### Decision 3: Redirect via `beforeLoad` in layout route
**Choice:** Keep the old `src/routes/equilibrio.tsx` layout route but change its `component` to a redirect. In `beforeLoad`, throw a `redirect()` to `/eventos/equilibrio` while preserving search params. Do the same for all child routes.
**Alternative:** Create separate redirect route files for each old path.
**Rationale:** Using the existing layout route as a redirect preserves the file-based routing resolution. TanStack Router's `redirect()` in `beforeLoad` executes before any component rendering, making it efficient. The layout route handles the base path and child routes handle their specific redirects.

### Decision 4: Move components to `src/components/events/`
**Choice:** Rename `src/components/equilibrio/` to `src/components/events/` and refactor each component to accept generic props instead of hardcoded Equilibrio references.
**Alternative:** Keep components in `equilibrio/` and make them generic in place.
**Rationale:** The directory name should reflect the generic purpose. Moving to `events/` makes the codebase clearer for new developers and avoids confusion about what "equilibrio" means in a generic context.

### Decision 5: Remove `LogoEquilibrio.tsx` in favor of CMS logos
**Choice:** Delete `LogoEquilibrio.tsx`. Event series logos come from the CMS `eventSeries.logo` image field. If no logo is provided, display the series name as text.
**Alternative:** Keep `LogoEquilibrio.tsx` as a fallback.
**Rationale:** The SVG logo is specific to the Equilibrio brand. Other event series will have different branding. The CMS is the single source of truth for all event series visual identity.

### Decision 6: Meta Pixel scope update
**Choice:** In `main.tsx`, change the Meta Pixel `PageView` condition from checking for `/equilibrio` to checking for `/eventos`.
**Alternative:** Fire Meta Pixel on all routes.
**Rationale:** The pixel was originally scoped to Equilibrio for campaign tracking. Broadening to all `/eventos/*` captures all event series while keeping it focused on event-related traffic. Firing on all routes would dilute the data.

## Risks / Trade-offs

- **[Printed QR codes]** Existing QR codes and printed materials point to `/equilibrio/*` URLs. If redirects fail or are removed, these links break. → Mitigation: Redirects are implemented as permanent route-level redirects that execute before rendering. They should be maintained indefinitely or until all printed materials are known to be out of circulation.

- **[CMS data dependency]** Event pages now depend on CMS being populated. If the CMS has no event series data, the page shows an empty state. → Mitigation: Seed the CMS with Equilibrio data (done in `setup-sanity-cms` tasks). The hybrid hook falls back gracefully when CMS data is missing.

- **[Large refactor surface]** This change touches many files: 8 route files, 5+ components, hooks, constants. → Mitigation: The refactor is primarily renaming and parameterizing. The core subscription/feedback logic via Supabase RPC remains unchanged. Tests should catch regressions.

- **[Scroll-snap behavior with CMS-driven event count]** The scroll-snap behavior uses hardcoded `sectionRefs` for 2 events. With a dynamic event count from CMS, refs must be created dynamically. → Mitigation: Use `useRef` with an array or `createRef` in a map. The scroll spy logic already works with an array of refs.

## Open Questions

- Should the events listing page (`/eventos`) show events across all series in a unified timeline, or group them by series? (Recommendation: group by series for clarity.)
