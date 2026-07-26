## MODIFIED Requirements

### Requirement: About page displays church information
The system SHALL display church information at `/acerca` sourced from the CMS `aboutPage` document, rendered below a hero banner supplied by the `hero` document keyed `acerca`. Location and service times remain sourced from `siteSettings`, which continues to hold operational contact information.

#### Scenario: About page with CMS content
- **GIVEN** the CMS `aboutPage` document has its description populated
- **WHEN** a user visits `/acerca`
- **THEN** the page SHALL display the church description from `aboutPage`
- **AND** the location and service times from `siteSettings`

#### Scenario: About page without CMS content
- **GIVEN** the CMS `aboutPage` document is not populated
- **WHEN** a user visits `/acerca`
- **THEN** the page SHALL display a fallback message with basic church information

#### Scenario: About page banner comes from the hero document
- **WHEN** a user visits `/acerca`
- **THEN** the page banner SHALL be rendered by the shared hero component using the hero keyed `acerca`
- **AND** the page SHALL NOT contain its own hardcoded banner markup

#### Scenario: About page responsive layout
- **GIVEN** a user visits `/acerca`
- **WHEN** the page renders
- **THEN** the content SHALL be readable and well-structured on both mobile and desktop viewports

## ADDED Requirements

### Requirement: About page section composition
The `/acerca` page SHALL compose its sections in a defined order: hero, description, beliefs content (vision, mission, core values, core beliefs), documents, leadership, and the location and service times.

#### Scenario: Sections render in order
- **WHEN** a user visits `/acerca` with all content populated
- **THEN** the sections SHALL appear in the order: hero, description, vision and mission, core values, core beliefs, documents, leadership, location and service times

#### Scenario: Absent sections collapse without gaps
- **WHEN** some sections have no content
- **THEN** those sections SHALL be omitted
- **AND** the remaining sections SHALL follow one another without empty space or stray dividers
