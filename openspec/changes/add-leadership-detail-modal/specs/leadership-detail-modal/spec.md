## ADDED Requirements

### Requirement: Leader entries open a detail modal
Activating a leadership entry on `/acerca` SHALL open a modal showing that leader's details. At most one modal SHALL be open at a time.

#### Scenario: Opening a leader
- **WHEN** a visitor activates a leadership entry
- **THEN** a modal SHALL open showing that leader's details
- **AND** the rest of the page SHALL remain in place behind it

#### Scenario: Opening a different leader
- **GIVEN** one leader's modal is open
- **WHEN** the visitor closes it and activates a different entry
- **THEN** the modal SHALL show the newly selected leader
- **AND** no content from the previously selected leader SHALL remain

#### Scenario: Every entry is openable
- **WHEN** the leadership section renders
- **THEN** every entry SHALL be activatable, including leaders with no bio

### Requirement: Modal contents
The modal SHALL display the leader's photo, name, and leadership title, and SHALL display their bio when one is present.

#### Scenario: Full leader details
- **WHEN** a leader with a photo, name, leadership title, and bio is opened
- **THEN** the modal SHALL display all four

#### Scenario: Leader without a bio
- **WHEN** a leader with no bio is opened
- **THEN** the modal SHALL display the photo, name, and leadership title
- **AND** no empty text area or placeholder SHALL appear in the bio's place

#### Scenario: Leader without a leadership title
- **WHEN** a leader with no leadership title is opened
- **THEN** the modal SHALL display the photo and name without an empty subtitle

#### Scenario: Photo accessibility
- **WHEN** the modal displays a leader's photo
- **THEN** the photo SHALL NOT duplicate the leader's name to assistive technology, which the modal's heading already announces

### Requirement: Closing the modal
The modal SHALL be dismissible by the close control, the Escape key, and activating the area outside the panel.

#### Scenario: Closing by the close control
- **WHEN** the visitor activates the modal's close control
- **THEN** the modal SHALL close
- **AND** the visitor SHALL remain on `/acerca` at their previous scroll position

#### Scenario: Closing by keyboard
- **WHEN** the visitor presses Escape while the modal is open
- **THEN** the modal SHALL close

#### Scenario: Closing by the overlay
- **WHEN** the visitor activates the area outside the modal panel
- **THEN** the modal SHALL close

### Requirement: Modal accessibility and responsiveness
The modal SHALL be operable by keyboard and screen reader, and SHALL adapt to mobile viewports.

#### Scenario: Entries are keyboard operable
- **WHEN** a visitor navigates the leadership section by keyboard
- **THEN** each entry SHALL be reachable by Tab
- **AND** SHALL be activatable by Enter or Space
- **AND** SHALL show a visible focus indicator

#### Scenario: Entries are announced as interactive
- **WHEN** a screen reader encounters a leadership entry
- **THEN** it SHALL be announced as a button carrying the leader's name

#### Scenario: Focus is contained while open
- **WHEN** the modal is open
- **THEN** keyboard focus SHALL remain within it until it is closed

#### Scenario: Long bios remain reachable
- **WHEN** a leader's bio is longer than the available panel height
- **THEN** the panel SHALL scroll internally rather than overflow the viewport

#### Scenario: Mobile layout
- **WHEN** the modal is viewed on a viewport narrower than 640px
- **THEN** its contents SHALL remain readable and its close control reachable, without horizontal page scrolling
