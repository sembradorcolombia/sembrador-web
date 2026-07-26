## ADDED Requirements

### Requirement: Sanity client initialization
The system SHALL create a configured Sanity client instance using environment variables `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET`, with the CDN API enabled for read performance.

#### Scenario: Client available at runtime
- **GIVEN** environment variables `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET` are set
- **WHEN** any CMS service function is invoked
- **THEN** the Sanity client connects to the correct project and dataset via the CDN API

#### Scenario: Image URL builder available
- **GIVEN** a Sanity image reference object from a CMS query result
- **WHEN** the image URL builder is invoked with that reference
- **THEN** it SHALL return a valid CDN URL for the image with support for width, height, and format transformations

### Requirement: Fetch blog posts
The system SHALL fetch blog posts from Sanity, supporting both listing (multiple posts) and single-post retrieval by slug.

#### Scenario: Fetch all published blog posts
- **WHEN** the blog listing is requested
- **THEN** the system SHALL return all published blog posts ordered by `publishedAt` descending
- **AND** each post SHALL include: title, slug, excerpt, featured image, published date, category, and author name/image

#### Scenario: Fetch blog post by slug
- **GIVEN** a valid blog post slug
- **WHEN** the blog detail is requested
- **THEN** the system SHALL return the full post including Portable Text body content, author details, scripture references, and audio/video URLs

#### Scenario: Fetch blog posts by category
- **GIVEN** a category filter of "sermon" or "news"
- **WHEN** the blog listing is requested with the category filter
- **THEN** the system SHALL return only posts matching that category, ordered by `publishedAt` descending

### Requirement: Fetch event series
The system SHALL fetch event series from Sanity for event listing and navigation.

#### Scenario: Fetch all event series
- **WHEN** the event series listing is requested
- **THEN** the system SHALL return all event series with: name, slug, description, logo image, theme color, and active status

#### Scenario: Fetch event series by slug
- **GIVEN** a valid event series slug (e.g., "equilibrio")
- **WHEN** a single event series is requested by slug
- **THEN** the system SHALL return the full event series document including all associated events with their details

### Requirement: Fetch individual events
The system SHALL fetch individual event details from Sanity, including the `supabaseEventId` field needed to link CMS content with Supabase registration data.

#### Scenario: Fetch events for a series
- **GIVEN** a valid event series slug
- **WHEN** events for that series are requested
- **THEN** the system SHALL return all events belonging to that series with: name, slug, speaker name, speaker image, date, time, location, description, theme color, supabaseEventId, and status (upcoming/past)

#### Scenario: Fetch single event by slug
- **GIVEN** a valid event slug within a series
- **WHEN** a single event is requested
- **THEN** the system SHALL return the full event document with speaker details (name, image, bio) and the `supabaseEventId` for registration data linking

### Requirement: Fetch next step cards
The system SHALL fetch connect step action cards from Sanity for the `/conectar` page.

#### Scenario: Fetch all connect steps
- **WHEN** the connect steps listing is requested
- **THEN** the system SHALL return all `connectStep` documents ordered by their `order` field
- **AND** each step SHALL include: title, description, icon identifier, CTA text, CTA link, and consolidation step value

#### Scenario: Connect steps query key
- **WHEN** connect steps are fetched via TanStack Query
- **THEN** the query key SHALL be `["cms", "connectSteps"]`

### Requirement: Fetch giving options
The system SHALL fetch giving/donation options from Sanity for the giving page.

#### Scenario: Fetch all giving options
- **WHEN** the giving options listing is requested
- **THEN** the system SHALL return all giving option documents ordered by their `order` field
- **AND** each option SHALL include: title, description, type (bank/nequi/daviplata/other), details text, QR code image

### Requirement: Fetch site settings
The system SHALL fetch singleton site-wide settings from Sanity for global configuration and contact information. Banner imagery and About page copy SHALL NOT be part of this projection.

#### Scenario: Fetch site settings
- **WHEN** the site settings are requested
- **THEN** the system SHALL return the singleton settings document including: church name, tagline, about location, service times, footer tagline, address, Google Maps URL, contact phone, contact email, and social media links
- **AND** the projection SHALL NOT select `heroImage` or `aboutDescription`

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
The system SHALL fetch the authors whose `roles` include `leader`, returning name, image, leadership title, and leadership order, sorted by leadership order ascending and then by name.

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

### Requirement: CMS data caching via TanStack Query
The system SHALL wrap all CMS fetch functions in TanStack Query hooks with appropriate stale times for content that changes infrequently.

#### Scenario: CMS queries use stale-while-revalidate caching
- **GIVEN** CMS content has been previously fetched
- **WHEN** the same content is requested again within the stale time window
- **THEN** the cached data SHALL be returned immediately
- **AND** a background revalidation SHALL occur if the data is stale

#### Scenario: Each content type has a dedicated query key
- **WHEN** any CMS content is fetched
- **THEN** the query key SHALL be namespaced by content type (e.g., `["cms", "blogPosts"]`, `["cms", "siteSettings"]`)
- **AND** parameterized queries SHALL include the parameter in the key (e.g., `["cms", "blogPost", slug]`)
