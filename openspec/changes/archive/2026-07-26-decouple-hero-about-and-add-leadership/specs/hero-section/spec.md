## MODIFIED Requirements

### Requirement: Hero includes a secondary CTA linking to /acerca
The homepage hero SHALL include a call-to-action defined by the `hero` document keyed `home`. When that hero defines no CTA, the hero SHALL fall back to a "Conocer más" link to `/acerca`, preserving the previous behavior.

#### Scenario: Secondary CTA renders and navigates
- **WHEN** a user views the home page hero and the `home` hero document defines no CTA
- **THEN** a "Conocer más" link SHALL be visible and SHALL navigate to `/acerca` when clicked

#### Scenario: CMS-defined CTA replaces the fallback
- **WHEN** the `home` hero document defines a CTA with text and link
- **THEN** the hero SHALL render that CTA instead of the "Conocer más" fallback

## ADDED Requirements

### Requirement: Homepage hero content comes from the hero document
The homepage banner heading, background image, and lead text SHALL be sourced from the `hero` document keyed `home`, rendered by the shared hero component. They SHALL NOT be derived from `siteSettings.churchName`, `siteSettings.tagline`, or `siteSettings.heroImage`.

#### Scenario: Hero content renders from its own document
- **WHEN** a `hero` document keyed `home` is published
- **THEN** the homepage banner SHALL display that document's heading, background image, and lead text

#### Scenario: Editing the hero does not affect church identity
- **WHEN** an editor changes the homepage hero heading or image
- **THEN** `siteSettings.churchName`, `siteSettings.tagline`, and the About page content SHALL be unaffected

#### Scenario: Fallback when no home hero exists
- **WHEN** no `hero` document keyed `home` is published
- **THEN** the homepage SHALL render fallback heading text and a fallback background image rather than an empty or broken banner

### Requirement: Homepage service info block is separate from the hero content
The service schedule and location block SHALL remain homepage-specific chrome sourced from `siteSettings`, layered over the shared hero component, and SHALL NOT be defined as part of the `hero` document.

#### Scenario: Service info is not part of the hero document
- **WHEN** an editor edits the `home` hero document
- **THEN** the schedule and location fields SHALL NOT appear there
- **AND** they SHALL remain editable in `siteSettings`

#### Scenario: Service info renders over the shared hero
- **WHEN** the homepage renders
- **THEN** the schedule and location block SHALL be displayed within the hero area, above the CTA
