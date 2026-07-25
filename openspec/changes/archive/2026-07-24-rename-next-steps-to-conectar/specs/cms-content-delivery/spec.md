## MODIFIED Requirements

### Requirement: Fetch next step cards
The system SHALL fetch connect step action cards from Sanity for the `/conectar` page.

#### Scenario: Fetch all connect steps
- **WHEN** the connect steps listing is requested
- **THEN** the system SHALL return all `connectStep` documents ordered by their `order` field
- **AND** each step SHALL include: title, description, icon identifier, CTA text, CTA link, and consolidation step value

#### Scenario: Connect steps query key
- **WHEN** connect steps are fetched via TanStack Query
- **THEN** the query key SHALL be `["cms", "connectSteps"]`
