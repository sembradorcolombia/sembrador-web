## ADDED Requirements

### Requirement: Next steps page displays action cards
The system SHALL display a grid of action cards at `/siguientes-pasos` sourced from CMS `nextStep` documents, ordered by the `order` field.

#### Scenario: Next steps page with cards
- **GIVEN** there are next step documents in the CMS
- **WHEN** a user visits `/siguientes-pasos`
- **THEN** the page SHALL display all next step cards ordered by their `order` field
- **AND** each card SHALL show: title, description, icon (Lucide icon if provided), and a CTA button/link

#### Scenario: Next steps page empty state
- **GIVEN** there are no next step documents in the CMS
- **WHEN** a user visits `/siguientes-pasos`
- **THEN** the page SHALL display a message: "Próximamente tendremos más información"

#### Scenario: Next step card CTA navigation
- **GIVEN** a next step card has a `ctaLink` value
- **WHEN** the user clicks the CTA button
- **THEN** the user SHALL navigate to the specified link (internal route or external URL)

#### Scenario: Responsive card grid
- **GIVEN** a user visits `/siguientes-pasos`
- **WHEN** the viewport is narrower than `md` (768px)
- **THEN** cards SHALL stack in a single column
- **WHEN** the viewport is wider than `lg` (1024px)
- **THEN** cards SHALL display in a 2 or 3-column grid

### Requirement: Next steps page metadata
The next steps page SHALL include appropriate page title.

#### Scenario: Page title
- **WHEN** a user visits `/siguientes-pasos`
- **THEN** the page title SHALL be "Siguientes Pasos — El Sembrador"
