## MODIFIED Requirements

### Requirement: Fetch site settings
The system SHALL fetch singleton site-wide settings from Sanity for global configuration and contact information. Banner imagery and About page copy SHALL NOT be part of this projection.

#### Scenario: Fetch site settings
- **WHEN** the site settings are requested
- **THEN** the system SHALL return the singleton settings document including: church name, tagline, about location, service times, footer tagline, address, Google Maps URL, contact phone, contact email, and social media links
- **AND** the projection SHALL NOT select `heroImage` or `aboutDescription`

## ADDED Requirements

### Requirement: Fetch hero by key
The system SHALL fetch a single `hero` document by its page key, returning its heading, background image, lead text, and CTA.

#### Scenario: Hero is fetched by key
- **WHEN** a hero is requested for a given page key
- **THEN** the system SHALL return the matching hero document with its heading, background image, lead text, and CTA

#### Scenario: No hero for the key
- **WHEN** no hero document exists for the requested key
- **THEN** the system SHALL return no hero rather than raising an error, so the consumer can render its fallback

### Requirement: Fetch About page content
The system SHALL fetch the singleton `aboutPage` document, returning its description, vision, mission, core values, core beliefs, and attached documents with resolved file URLs.

#### Scenario: About page content is fetched
- **WHEN** the About page content is requested
- **THEN** the system SHALL return the description, vision, mission, ordered core values, ordered core beliefs, and the document list

#### Scenario: Document file URLs are resolved
- **WHEN** the About page has attached documents
- **THEN** each returned document SHALL include a usable file URL alongside its title and description

#### Scenario: About page not yet created
- **WHEN** no `aboutPage` document exists
- **THEN** the system SHALL return no content rather than raising an error

### Requirement: Fetch leadership authors
The system SHALL fetch the authors whose `roles` include `leader`, returning name, image, bio, leadership title, and leadership order, sorted by leadership order ascending and then by name.

#### Scenario: Leaders are fetched and sorted
- **WHEN** the leadership list is requested
- **THEN** the system SHALL return only authors carrying the `leader` role
- **AND** they SHALL be ordered by leadership order ascending, with unordered authors last, ordered by name

#### Scenario: No leaders exist
- **WHEN** no author carries the `leader` role
- **THEN** the system SHALL return an empty list rather than raising an error

### Requirement: Author projections select multiple roles
GROQ projections that resolve an author SHALL select the `roles` array rather than the removed single `role` string.

#### Scenario: Author projection returns roles
- **WHEN** a blog post or event resolves its author reference
- **THEN** the returned author SHALL carry a `roles` array
- **AND** SHALL NOT carry a `role` string
