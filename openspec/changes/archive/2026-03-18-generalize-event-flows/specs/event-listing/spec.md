## ADDED Requirements

### Requirement: Events listing page
The system SHALL provide an events listing page at `/eventos` displaying all event series and their upcoming events.

#### Scenario: Display active event series
- **GIVEN** there are active event series in the CMS (e.g., "Equilibrio")
- **WHEN** a user visits `/eventos`
- **THEN** the page SHALL display each active event series with its name, description, logo (if available), and a link to `/eventos/$seriesSlug`

#### Scenario: Display upcoming events within each series
- **GIVEN** an active event series has upcoming events
- **WHEN** the events listing page renders
- **THEN** each series section SHALL show its upcoming events with event name, speaker name, date, and location

#### Scenario: No active event series
- **GIVEN** there are no active event series in the CMS
- **WHEN** a user visits `/eventos`
- **THEN** the page SHALL display a message indicating no upcoming events (e.g., "No hay eventos programados")

#### Scenario: Past events shown separately
- **GIVEN** an event series has both upcoming and past events
- **WHEN** the events listing page renders
- **THEN** upcoming events SHALL be displayed prominently and past events SHALL be listed separately or hidden

### Requirement: Events listing page metadata
The events listing page SHALL include appropriate page title and SEO metadata.

#### Scenario: Page title
- **WHEN** a user visits `/eventos`
- **THEN** the page title SHALL be "Eventos — El Sembrador"
