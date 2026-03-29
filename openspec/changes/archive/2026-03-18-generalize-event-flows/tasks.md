## 1. Route Scaffolding

- [x] 1.1 Create `src/routes/eventos.tsx` layout route rendering `<Outlet />`
- [x] 1.2 Create `src/routes/eventos/index.tsx` events listing page (fetch all event series from CMS, display with upcoming events)
- [x] 1.3 Create `src/routes/eventos/$seriesSlug.tsx` layout route rendering `<Outlet />` with series slug available via `useParams`
- [x] 1.4 Create `src/routes/eventos/$seriesSlug/index.tsx` (refactored event showcase page)
- [x] 1.5 Create `src/routes/eventos/$seriesSlug/registro-exitoso.tsx`
- [x] 1.6 Create `src/routes/eventos/$seriesSlug/conexion.tsx`
- [x] 1.7 Create `src/routes/eventos/$seriesSlug/conexion-exitosa.tsx`
- [x] 1.8 Create `src/routes/eventos/$seriesSlug/confirmar-asistencia.tsx`
- [x] 1.9 Create `src/routes/eventos/$seriesSlug/asistencia-confirmada.tsx`
- [x] 1.10 Create `src/routes/eventos/$seriesSlug/feedback.tsx`
- [x] 1.11 Create `src/routes/eventos/$seriesSlug/feedback-exitoso.tsx`

## 2. Component Migration

- [x] 2.1 Create `src/components/events/` directory
- [x] 2.2 Move and refactor `EventShowcaseSection.tsx` from `equilibrio/` to `events/` — accept CMS event data props instead of `EVENT_DETAILS_MAP` lookups
- [x] 2.3 Move and refactor `SubscriptionModal.tsx` from `equilibrio/` to `events/` — make series-agnostic
- [x] 2.4 Move and refactor `ConnectionForm.tsx` from `equilibrio/` to `events/` — parameterize by series slug
- [x] 2.5 Move and refactor `AttendanceConfirmationForm.tsx` from `equilibrio/` to `events/` — minimal changes (already generic)
- [x] 2.6 Move and refactor `FeedbackForm.tsx` from `equilibrio/` to `events/` — parameterize by series slug
- [x] 2.7 Refactor `SubscriptionForm.tsx` in `forms/` to work with CMS event data instead of static event details

## 3. Hybrid Data Hook

- [x] 3.1 Create `src/lib/hooks/useEventSeriesData.ts` with a `useEventSeriesData(seriesSlug)` hook that merges CMS event series content with Supabase registration data via `supabaseEventId`
- [x] 3.2 Handle edge cases: CMS event without Supabase match, Supabase event without CMS match, loading/error states from both sources
- [x] 3.3 Create dynamic section refs array for scroll-snap behavior based on CMS event count

## 4. Redirects

- [x] 4.1 Update `src/routes/equilibrio.tsx` layout route to redirect to `/eventos/equilibrio` via `beforeLoad` with search params preserved
- [x] 4.2 Update or create redirect routes for all child paths: `registro-exitoso`, `conexion`, `conexion-exitosa`, `confirmar-asistencia`, `asistencia-confirmada`, `feedback`, `feedback-exitoso`
- [x] 4.3 Verify redirects preserve query parameters (e.g., `?token=...`, `?evento=...`)

## 5. Analytics Update

- [x] 5.1 Update Meta Pixel scope in `src/main.tsx` from `/equilibrio` path check to `/eventos` path check

## 6. Cleanup

- [x] 6.1 Delete `src/lib/constants/eventDetails.ts`
- [x] 6.2 Delete `src/lib/hooks/useEventsWithDetails.ts`
- [x] 6.3 Delete `src/components/equilibrio/` directory (after all components moved to `events/`)
- [x] 6.4 Delete `src/components/LogoEquilibrio.tsx`
- [x] 6.5 Update any remaining imports referencing old paths

## 7. Verification

- [x] 7.1 Run `pnpm build` to verify TypeScript compilation passes
- [x] 7.2 Run `pnpm check` to verify Biome lint/format compliance
- [x] 7.3 Run `pnpm test` to verify existing tests still pass (update tests that reference equilibrio paths)
- [ ] 7.4 Manually verify `/eventos/equilibrio` renders correctly with CMS data
- [ ] 7.5 Manually verify `/equilibrio` redirects to `/eventos/equilibrio` preserving search params
- [ ] 7.6 Manually verify subscription, connection, attendance, and feedback flows work under new routes
