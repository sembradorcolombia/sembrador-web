### Requirement: Footer content is managed via Sanity CMS
The system SHALL fetch footer content (tagline, address, contact info, social links) from the `siteSettings` Sanity document and render it in the Footer component.

#### Scenario: Footer renders CMS-managed content
- **GIVEN** the `siteSettings` document has `footerTagline`, `address`, `contactPhone`, `contactEmail`, and `socialLinks` populated
- **WHEN** a user visits any public page
- **THEN** the Footer SHALL display the CMS-managed values for those fields

#### Scenario: Footer falls back gracefully when CMS data is unavailable
- **GIVEN** the `useSiteSettings` query is loading or returns an error
- **WHEN** the Footer renders
- **THEN** the Footer SHALL display static fallback strings and SHALL NOT show an error state or blank sections

#### Scenario: Footer falls back when optional fields are empty
- **GIVEN** a footer field (e.g., `address`) is not set in the `siteSettings` document
- **WHEN** the Footer renders
- **THEN** that section SHALL either be hidden or display a sensible default, without crashing

### Requirement: Social links in the footer are CMS-managed
The Footer SHALL render social media links sourced from the `socialLinks` array in the `siteSettings` Sanity document.

#### Scenario: Known platform renders with icon
- **GIVEN** a `socialLinks` entry has `platform: "instagram"` and a valid `url`
- **WHEN** the Footer renders
- **THEN** an Instagram icon link SHALL be displayed pointing to the provided URL, opening in a new tab

#### Scenario: Known platform renders with icon for YouTube
- **GIVEN** a `socialLinks` entry has `platform: "youtube"` and a valid `url`
- **WHEN** the Footer renders
- **THEN** a YouTube icon link SHALL be displayed pointing to the provided URL, opening in a new tab

#### Scenario: Unknown platform is skipped gracefully
- **GIVEN** a `socialLinks` entry has an unrecognized `platform` value
- **WHEN** the Footer renders
- **THEN** that entry SHALL be omitted from the rendered social links without causing an error

#### Scenario: Empty social links array hides social section
- **GIVEN** the `siteSettings` document has no `socialLinks` entries
- **WHEN** the Footer renders
- **THEN** the social links section SHALL be hidden or render empty without layout breakage
