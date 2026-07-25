## MODIFIED Requirements

### Requirement: Next steps page displays action cards
The system SHALL display a grid of action cards at `/conectar`, branded "Conectar", sourced from CMS `connectStep` documents, ordered by the `order` field.

#### Scenario: Conectar page with cards
- **GIVEN** there are connect step documents in the CMS
- **WHEN** a user visits `/conectar`
- **THEN** the page SHALL display all connect step cards ordered by their `order` field
- **AND** the page heading SHALL be "Conectar"
- **AND** each card SHALL show: title, description, icon (Lucide icon if provided), and a CTA button/link

#### Scenario: Conectar page empty state
- **GIVEN** there are no connect step documents in the CMS
- **WHEN** a user visits `/conectar`
- **THEN** the page SHALL display a message: "Próximamente tendremos más información"

#### Scenario: Consolidation step card CTA navigation
- **GIVEN** a connect step card has the CMS `consolidationStep` field set to one of the consolidation options ("Comunidades misionales", "Discipulado 1:1", "Consejería")
- **WHEN** the user clicks the CTA button
- **THEN** the user SHALL navigate to `/consolidacion?paso=<consolidationStep value>` with the field value as the `paso` search parameter

#### Scenario: Card without consolidationStep uses CMS link
- **GIVEN** a connect step card does NOT have `consolidationStep` set (regardless of its title)
- **WHEN** the user clicks the CTA button
- **THEN** the user SHALL navigate to the CMS-defined `ctaLink` (internal route or external URL)

#### Scenario: Responsive card grid
- **GIVEN** a user visits `/conectar`
- **WHEN** the viewport is narrower than `md` (768px)
- **THEN** cards SHALL stack in a single column
- **WHEN** the viewport is wider than `lg` (1024px)
- **THEN** cards SHALL display in a 2 or 3-column grid

### Requirement: Next steps page metadata
The Conectar page SHALL include appropriate page title.

#### Scenario: Page title
- **WHEN** a user visits `/conectar`
- **THEN** the page title SHALL be "Conectar — El Sembrador"

## ADDED Requirements

### Requirement: Legacy /siguientes-pasos redirect
The system SHALL redirect the old `/siguientes-pasos` path to `/conectar` to preserve shared links and indexed URLs.

#### Scenario: Visiting the old URL redirects
- **WHEN** a user visits `/siguientes-pasos`
- **THEN** the user SHALL be redirected to `/conectar`

#### Scenario: Old URL does not render a page
- **WHEN** a user visits `/siguientes-pasos`
- **THEN** no "Siguientes Pasos" page content SHALL be rendered; only the redirect SHALL occur
