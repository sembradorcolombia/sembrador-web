## ADDED Requirements

### Requirement: Event series page renders CMS content
The system SHALL render event series pages at `/eventos/$seriesSlug` using content from the CMS instead of hardcoded constants, supporting any event series (not just Equilibrio).

#### Scenario: Event series page with CMS data
- **GIVEN** a valid event series slug (e.g., "equilibrio") exists in the CMS
- **WHEN** a user visits `/eventos/equilibrio`
- **THEN** the page SHALL display events from the CMS with speaker name, speaker image, date, time, location, and description
- **AND** the page SHALL fetch registration data (capacity, current count) from Supabase using the `supabaseEventId` link

#### Scenario: Event series not found
- **GIVEN** the slug does not match any event series in the CMS
- **WHEN** a user visits `/eventos/nonexistent`
- **THEN** the page SHALL display a "Serie de eventos no encontrada" not-found message

#### Scenario: Event series page metadata
- **GIVEN** a valid event series slug
- **WHEN** the page renders
- **THEN** the page title SHALL be "{Series Name} — El Sembrador"

### Requirement: Hybrid CMS and Supabase data merging
The system SHALL merge event display content from the CMS with registration data from Supabase to render complete event information.

#### Scenario: Merge event data sources
- **GIVEN** a CMS event document with `supabaseEventId` value "70597170-..."
- **WHEN** the event series page fetches data
- **THEN** the system SHALL fetch the CMS event content (speaker, image, description) AND the Supabase event record (maxCapacity, currentCount) and merge them into a single data object for rendering

#### Scenario: CMS event without Supabase match
- **GIVEN** a CMS event document with a `supabaseEventId` that has no matching Supabase record
- **WHEN** the event series page fetches data
- **THEN** the event SHALL still render with CMS content but registration/capacity data SHALL show as unavailable

### Requirement: Event subscription flow is series-agnostic
The subscription flow (modal, form, success page) SHALL work for any event series, receiving context from the route parameters.

#### Scenario: Subscription for any event series
- **GIVEN** a user is on `/eventos/equilibrio?evento=paz-financiera`
- **WHEN** the subscription modal opens
- **THEN** the modal SHALL display events from the "equilibrio" series fetched from CMS and allow subscription via Supabase

#### Scenario: Subscription success redirects within series
- **GIVEN** a user completes subscription on `/eventos/equilibrio`
- **WHEN** the subscription succeeds
- **THEN** the user SHALL be redirected to `/eventos/equilibrio/registro-exitoso`

### Requirement: Connection form is series-agnostic
The connection form flow SHALL work for any event series using the series slug from route params.

#### Scenario: Connection form renders for any series
- **GIVEN** a user visits `/eventos/$seriesSlug/conexion`
- **WHEN** the page renders
- **THEN** the connection form SHALL function identically to the current form but with branding/context from the CMS event series data

### Requirement: Attendance confirmation is series-agnostic
The attendance confirmation flow SHALL work within any event series context.

#### Scenario: Attendance confirmation for any series
- **GIVEN** a user visits `/eventos/$seriesSlug/confirmar-asistencia?token=<uuid>`
- **WHEN** the page renders
- **THEN** the attendance confirmation form SHALL show events for that token regardless of which series the URL belongs to

### Requirement: Feedback form is series-agnostic
The feedback form flow SHALL work for any event series using the series slug from route params.

#### Scenario: Feedback form renders for any series
- **GIVEN** a user visits `/eventos/$seriesSlug/feedback`
- **WHEN** the page renders
- **THEN** the feedback form SHALL function identically to the current form but with branding/context from the CMS event series data

### Requirement: Event showcase preserves scroll-snapping UX
The event series page SHALL preserve the existing full-screen scroll-snapping behavior with background color transitions.

#### Scenario: Scroll-snapping between events
- **GIVEN** the event series has multiple events
- **WHEN** the user scrolls on the series page
- **THEN** the page SHALL snap between full-screen event sections with smooth background color transitions driven by each event's theme color from the CMS
