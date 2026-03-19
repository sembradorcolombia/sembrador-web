## ADDED Requirements

### Requirement: About page displays church information
The system SHALL display church information at `/acerca` sourced from the CMS `siteSettings` document.

#### Scenario: About page with CMS content
- **GIVEN** the CMS `siteSettings` document has `aboutDescription`, `aboutLocation`, and `aboutServiceTimes` populated
- **WHEN** a user visits `/acerca`
- **THEN** the page SHALL display the church description, location, and service times

#### Scenario: About page without CMS content
- **GIVEN** the CMS `siteSettings` document is not populated
- **WHEN** a user visits `/acerca`
- **THEN** the page SHALL display a fallback message with basic church information

#### Scenario: About page responsive layout
- **GIVEN** a user visits `/acerca`
- **WHEN** the page renders
- **THEN** the content SHALL be readable and well-structured on both mobile and desktop viewports

### Requirement: About page metadata
The about page SHALL include appropriate page title.

#### Scenario: Page title
- **WHEN** a user visits `/acerca`
- **THEN** the page title SHALL be "Acerca — El Sembrador"
