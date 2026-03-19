## Why

All event functionality currently lives under `/equilibrio/*` with hardcoded branding, Equilibrio-specific components, and a static `EVENT_DETAILS_MAP` constant for event display content. As the church adds more event series beyond Equilibrio, the event flows (subscription, connection, attendance confirmation, feedback) need to work for any event series. Event display content should come from the CMS instead of hardcoded constants. Existing QR codes and shared links to `/equilibrio/*` paths must continue working via redirects.

## What Changes

- Create `/eventos` layout route with an events listing page at `/eventos/`
- Create `/eventos/$seriesSlug` parameterized layout route for event series pages
- Move all 8 child routes from `/equilibrio/*` to `/eventos/$seriesSlug/*` (index, registro-exitoso, conexion, conexion-exitosa, confirmar-asistencia, asistencia-confirmada, feedback, feedback-exitoso)
- Refactor `EventShowcaseSection` to accept CMS event data instead of reading from `EVENT_DETAILS_MAP`
- Refactor `SubscriptionModal`, `SubscriptionForm`, `ConnectionForm`, `AttendanceConfirmationForm`, `FeedbackForm` to be event-series-agnostic (receive series context from route params)
- Create a hybrid data hook that merges CMS event content with Supabase registration data via `supabaseEventId`
- Add redirect routes from all old `/equilibrio/*` paths to `/eventos/equilibrio/*`
- Remove `src/lib/constants/eventDetails.ts` and `src/lib/hooks/useEventsWithDetails.ts`
- Move components from `src/components/equilibrio/` to `src/components/events/`
- Update `LogoEquilibrio.tsx` to be series-aware or remove it in favor of CMS-provided logos
- Update Meta Pixel tracking scope in `main.tsx` from `/equilibrio` to `/eventos`

## Capabilities

### New Capabilities
- `event-listing`: Events listing page showing all event series and upcoming events
- `event-series-pages`: Parameterized event series pages with CMS-driven content and Supabase registration data, supporting subscription, connection, attendance, and feedback flows for any event series
- `legacy-event-redirects`: Redirects from old `/equilibrio/*` paths to new `/eventos/equilibrio/*` paths preserving existing QR codes and shared links

### Modified Capabilities

## Impact

- **Modified files**: `src/main.tsx` (Meta Pixel scope), route files restructured, all equilibrio components refactored
- **Deleted files**: `src/lib/constants/eventDetails.ts`, `src/lib/hooks/useEventsWithDetails.ts`, all `src/routes/equilibrio/*.tsx` files, `src/routes/equilibrio.tsx` layout route, `src/components/equilibrio/` directory, `src/components/LogoEquilibrio.tsx`
- **New files**: `src/routes/eventos.tsx` (layout), `src/routes/eventos/index.tsx` (listing), `src/routes/eventos/$seriesSlug.tsx` (series layout), `src/routes/eventos/$seriesSlug/*.tsx` (8 child routes), `src/components/events/*.tsx` (refactored components), `src/lib/hooks/useEventSeriesData.ts` (hybrid CMS + Supabase hook)
- **Redirect routes**: New route entries to redirect `/equilibrio/*` → `/eventos/equilibrio/*`
- **No new npm dependencies**
- **Breaking URL change**: `/equilibrio/*` → `/eventos/equilibrio/*` (mitigated by redirects)
- **Depends on**: `setup-sanity-cms` (CMS hooks for event content)
