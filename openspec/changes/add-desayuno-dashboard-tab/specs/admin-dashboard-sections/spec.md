## MODIFIED Requirements

### Requirement: Dashboard section tabs
The `/dashboard` page SHALL present its content in three named sections selected by an in-page tab switcher: "Eventos", "Consolidación", and "Desayuno". Exactly one section SHALL be visible at a time, and "Eventos" SHALL be the section shown on first load.

#### Scenario: Default section on load
- **WHEN** an admin opens `/dashboard`
- **THEN** the page SHALL render a tab switcher with the labels "Eventos", "Consolidación", and "Desayuno"
- **AND** the "Eventos" tab SHALL be marked as active
- **AND** the events content SHALL be visible while the consolidation and desayuno content SHALL NOT be rendered

#### Scenario: Switching to the consolidation section
- **WHEN** the admin activates the "Consolidación" tab
- **THEN** the consolidation content SHALL be rendered
- **AND** the other sections' content SHALL no longer be visible
- **AND** the "Consolidación" tab SHALL be marked as active

#### Scenario: Switching to the desayuno section
- **WHEN** the admin activates the "Desayuno" tab
- **THEN** the desayuno content SHALL be rendered
- **AND** the other sections' content SHALL no longer be visible
- **AND** the "Desayuno" tab SHALL be marked as active

#### Scenario: Switching back to events
- **WHEN** the admin activates the "Eventos" tab after viewing another section
- **THEN** the events content SHALL be visible again without refetching already-cached data

### Requirement: Per-section data loading
Each section SHALL fetch its own data only when that section is first activated, so that opening the dashboard does not request data for the inactive sections.

#### Scenario: Inactive sections' data is not fetched up front
- **WHEN** an admin opens `/dashboard` and stays on the "Eventos" tab
- **THEN** no request for consolidation registrations or desayuno registrations SHALL be issued

#### Scenario: Consolidation data loads on first activation
- **WHEN** the admin activates the "Consolidación" tab for the first time
- **THEN** the consolidation registrations SHALL be fetched
- **AND** a loading indicator SHALL be shown while the request is in flight

#### Scenario: Desayuno data loads on first activation
- **WHEN** the admin activates the "Desayuno" tab for the first time
- **THEN** the desayuno registrations SHALL be fetched
- **AND** a loading indicator SHALL be shown while the request is in flight
