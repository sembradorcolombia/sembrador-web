## MODIFIED Requirements

### Requirement: Events preview section
The homepage SHALL display a preview section showing upcoming events from active event series. The series card grid SHALL adapt its column count to the number of active series so that no empty column is left in the row.

#### Scenario: Events preview with upcoming events
- **GIVEN** there are active event series with upcoming events in the CMS
- **WHEN** the homepage renders
- **THEN** the events preview section SHALL show upcoming events with name, date, and series name
- **AND** a "Ver eventos" link SHALL navigate to `/eventos`

#### Scenario: Events preview card grid adapts to series count
- **GIVEN** there are active event series in the CMS
- **WHEN** the homepage renders the events preview
- **THEN** the grid SHALL use as many columns as there are series cards, up to a maximum of 3
- **AND** WHEN there are exactly 2 series, the grid SHALL be width-constrained and horizontally centered within the section
- **AND** WHEN there is exactly 1 series, the grid SHALL be width-constrained and left-aligned with the section heading
- **AND** WHEN there are more than 3 series, the grid SHALL use 3 columns and remaining cards SHALL wrap onto further rows

#### Scenario: Events preview empty state
- **GIVEN** there are no active event series or upcoming events
- **WHEN** the homepage renders
- **THEN** the events preview section SHALL either be hidden or display a placeholder message

### Requirement: Next steps preview section
The homepage SHALL display a preview of up to 4 connect step action cards from the CMS, branded "Conectar". Each card SHALL render the connect step's CMS `icon` field as a resolved visual icon (Lucide), and MUST NOT display the raw icon name string. The card grid SHALL adapt its column count to the number of cards so that no empty column is left in the row.

#### Scenario: Conectar preview with cards
- **GIVEN** there are connect step documents in the CMS
- **WHEN** the homepage renders
- **THEN** the preview section SHALL display the heading "Conectar" and up to 4 cards with title and brief description
- **AND** each card SHALL display the connect step's icon resolved from its CMS icon name (e.g., "hand-heart", "users", "life-buoy") to the corresponding visual icon
- **AND** a "Ver más" link SHALL navigate to `/conectar`

#### Scenario: Conectar preview card grid adapts to card count
- **GIVEN** there are connect step documents in the CMS
- **WHEN** the homepage renders the Conectar preview
- **THEN** the grid SHALL use as many columns as there are cards, up to a maximum of 4
- **AND** WHEN there are exactly 2 cards, the grid SHALL be width-constrained and horizontally centered within the section
- **AND** WHEN there is exactly 1 card, the grid SHALL be width-constrained and left-aligned with the section heading

#### Scenario: Conectar preview with unknown icon name
- **GIVEN** a connect step document in the CMS has an `icon` value that is not a recognized icon name
- **WHEN** the homepage renders
- **THEN** the card SHALL display a fallback icon
- **AND** the raw icon name string SHALL NOT be visible on the card

#### Scenario: Conectar preview empty state
- **GIVEN** there are no connect step documents in the CMS
- **WHEN** the homepage renders
- **THEN** the Conectar preview section SHALL either be hidden or display a placeholder message
