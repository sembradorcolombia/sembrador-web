## MODIFIED Requirements

### Requirement: Next steps preview section
The homepage SHALL display a preview of up to 4 connect step action cards from the CMS, branded "Conectar".

#### Scenario: Conectar preview with cards
- **GIVEN** there are connect step documents in the CMS
- **WHEN** the homepage renders
- **THEN** the preview section SHALL display the heading "Conectar" and up to 4 cards with title and brief description
- **AND** a "Ver más" link SHALL navigate to `/conectar`

#### Scenario: Conectar preview empty state
- **GIVEN** there are no connect step documents in the CMS
- **WHEN** the homepage renders
- **THEN** the Conectar preview section SHALL either be hidden or display a placeholder message
