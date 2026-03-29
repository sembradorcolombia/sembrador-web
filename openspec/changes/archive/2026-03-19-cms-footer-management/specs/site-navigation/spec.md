## MODIFIED Requirements

### Requirement: Footer displays on public pages
The system SHALL render a footer at the bottom of all public pages with church information and quick links sourced from the Sanity CMS `siteSettings` document.

#### Scenario: Footer renders with CMS church info
- **GIVEN** a user visits any public page
- **WHEN** the page loads
- **THEN** the Footer SHALL display the church logo, a tagline from `siteSettings.footerTagline` (or fallback text), a copyright notice with the current year, and quick navigation links

#### Scenario: Footer social links from CMS
- **GIVEN** the church has social media profiles configured in `siteSettings.socialLinks`
- **WHEN** the Footer renders
- **THEN** social media links SHALL be displayed as icon links opening in a new tab, using the URLs and platform values from the CMS

#### Scenario: Footer renders without layout breaking when CMS data is loading
- **GIVEN** the `siteSettings` query has not yet resolved
- **WHEN** the Footer renders during initial load
- **THEN** the Footer SHALL display static fallback content without visual errors or empty sections
