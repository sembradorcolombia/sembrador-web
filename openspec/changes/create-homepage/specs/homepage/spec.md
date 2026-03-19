## ADDED Requirements

### Requirement: Hero section displays church identity
The homepage SHALL display a hero section at the top with the church name, tagline, a hero background image from CMS site settings, and a primary call-to-action button.

#### Scenario: Hero renders with CMS content
- **GIVEN** the CMS `siteSettings` document has `churchName`, `tagline`, and `heroImage` populated
- **WHEN** a user visits `/`
- **THEN** the hero section SHALL display the church name as a heading, the tagline as a subheading, the hero image as a background or prominent visual, and a primary CTA button

#### Scenario: Hero renders without CMS content
- **GIVEN** the CMS `siteSettings` document is not yet populated or fails to load
- **WHEN** a user visits `/`
- **THEN** the hero section SHALL display a fallback with "El Sembrador" as the church name and a generic welcome message

### Requirement: Blog preview section
The homepage SHALL display a preview section showing the 3 most recent published blog posts, linking to the blog listing.

#### Scenario: Blog preview with posts
- **GIVEN** there are published blog posts in the CMS
- **WHEN** the homepage renders
- **THEN** the blog preview section SHALL show up to 3 posts with title, excerpt, date, and featured image as cards
- **AND** a "Ver todos" link SHALL navigate to `/blog`

#### Scenario: Blog preview empty state
- **GIVEN** there are no published blog posts in the CMS
- **WHEN** the homepage renders
- **THEN** the blog preview section SHALL either be hidden or display a placeholder message

### Requirement: Events preview section
The homepage SHALL display a preview section showing upcoming events from active event series.

#### Scenario: Events preview with upcoming events
- **GIVEN** there are active event series with upcoming events in the CMS
- **WHEN** the homepage renders
- **THEN** the events preview section SHALL show upcoming events with name, date, and series name
- **AND** a "Ver eventos" link SHALL navigate to `/eventos`

#### Scenario: Events preview empty state
- **GIVEN** there are no active event series or upcoming events
- **WHEN** the homepage renders
- **THEN** the events preview section SHALL either be hidden or display a placeholder message

### Requirement: Next steps preview section
The homepage SHALL display a preview of up to 4 next step action cards from the CMS.

#### Scenario: Next steps preview with cards
- **GIVEN** there are next step documents in the CMS
- **WHEN** the homepage renders
- **THEN** the next steps preview SHALL display up to 4 cards with title and brief description
- **AND** a "Ver más" link SHALL navigate to `/siguientes-pasos`

#### Scenario: Next steps preview empty state
- **GIVEN** there are no next step documents in the CMS
- **WHEN** the homepage renders
- **THEN** the next steps preview section SHALL either be hidden or display a placeholder message

### Requirement: Give call-to-action section
The homepage SHALL display a giving call-to-action section encouraging visitors to support the church.

#### Scenario: Give CTA renders
- **WHEN** the homepage renders
- **THEN** a giving section SHALL display with a brief message about supporting the church and a CTA button linking to `/dar`

### Requirement: About snippet section
The homepage SHALL display a brief about section with the church description from CMS site settings.

#### Scenario: About snippet with CMS content
- **GIVEN** the CMS `siteSettings` document has `aboutDescription` populated
- **WHEN** the homepage renders
- **THEN** the about section SHALL display a brief description of the church and a "Conocer más" link to `/acerca`

#### Scenario: About snippet without CMS content
- **GIVEN** the CMS `siteSettings` document has no `aboutDescription`
- **WHEN** the homepage renders
- **THEN** the about section SHALL either be hidden or display a generic church description

### Requirement: Homepage responsive layout
The homepage sections SHALL adapt to different screen sizes.

#### Scenario: Mobile layout
- **GIVEN** a user visits `/` on a viewport narrower than `md` (768px)
- **WHEN** the page renders
- **THEN** all sections SHALL stack vertically in a single column with appropriate spacing and readable text sizes

#### Scenario: Desktop layout
- **GIVEN** a user visits `/` on a viewport wider than `lg` (1024px)
- **WHEN** the page renders
- **THEN** preview card sections SHALL use multi-column grid layouts (e.g., 3-column for blog cards)
