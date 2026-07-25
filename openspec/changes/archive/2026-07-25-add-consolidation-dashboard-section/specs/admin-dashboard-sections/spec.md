## ADDED Requirements

### Requirement: Dashboard section tabs
The `/dashboard` page SHALL present its content in two named sections selected by an in-page tab switcher: "Eventos" and "Consolidación". Exactly one section SHALL be visible at a time, and "Eventos" SHALL be the section shown on first load.

#### Scenario: Default section on load
- **WHEN** an admin opens `/dashboard`
- **THEN** the page SHALL render a tab switcher with the labels "Eventos" and "Consolidación"
- **AND** the "Eventos" tab SHALL be marked as active
- **AND** the events content SHALL be visible while the consolidation content SHALL NOT be rendered

#### Scenario: Switching to the consolidation section
- **WHEN** the admin activates the "Consolidación" tab
- **THEN** the consolidation content SHALL be rendered
- **AND** the events content SHALL no longer be visible
- **AND** the "Consolidación" tab SHALL be marked as active

#### Scenario: Switching back to events
- **WHEN** the admin activates the "Eventos" tab after viewing "Consolidación"
- **THEN** the events content SHALL be visible again without refetching already-cached data

### Requirement: Events section content
The "Eventos" section SHALL contain the subscriber search box and the per-event cards with their subscriber tables, preserving the behavior these had before the section split.

#### Scenario: Events section renders existing tooling
- **WHEN** the "Eventos" tab is active and event data has loaded
- **THEN** the section SHALL display the subscriber email search box
- **AND** one card per event showing its capacity, confirmed count, attended count, and expandable subscribers table

### Requirement: Per-section data loading
Each section SHALL fetch its own data only when that section is first activated, so that opening the dashboard does not request data for the inactive section.

#### Scenario: Consolidation data is not fetched up front
- **WHEN** an admin opens `/dashboard` and stays on the "Eventos" tab
- **THEN** no request for consolidation registrations SHALL be issued

#### Scenario: Consolidation data loads on first activation
- **WHEN** the admin activates the "Consolidación" tab for the first time
- **THEN** the consolidation registrations SHALL be fetched
- **AND** a loading indicator SHALL be shown while the request is in flight

### Requirement: Section-level loading and error states
Loading and error states SHALL be scoped to the active section, so a failure in one section does not blank out the dashboard shell or the other section.

#### Scenario: Section error does not break the shell
- **WHEN** the data request for the active section fails
- **THEN** the page header, the admin's email, the "Salir" button, and the tab switcher SHALL remain visible and usable
- **AND** an error message in Spanish SHALL be displayed within the section body

### Requirement: Admin-only access for all sections
The admin guard on `/dashboard` SHALL apply to every section; no section SHALL be reachable without an authenticated admin session.

#### Scenario: Non-admin is redirected
- **WHEN** a visitor without `app_metadata.is_admin` navigates to `/dashboard`
- **THEN** the visitor SHALL be redirected to `/login` before any section renders

### Requirement: Responsive tab switcher
The tab switcher SHALL remain usable on mobile viewports.

#### Scenario: Tabs on a narrow viewport
- **WHEN** the dashboard is viewed on a viewport narrower than 640px
- **THEN** both tabs SHALL be visible and tappable without horizontal page scrolling
