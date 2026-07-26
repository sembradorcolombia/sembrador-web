## MODIFIED Requirements

### Requirement: Leader entry contents
Each leadership entry SHALL display the author's image, name, and leadership title, centered as a single column, and SHALL be activatable to open that leader's detail modal. The author's bio SHALL NOT be shown in the entry itself; it is shown in the modal.

#### Scenario: Full leader entry
- **WHEN** a leader has an image, name, and leadership title
- **THEN** the entry SHALL display all three

#### Scenario: Bio is not displayed in the entry
- **GIVEN** a leader whose author document has a bio
- **WHEN** the leadership section renders
- **THEN** the bio SHALL NOT appear in the entry
- **AND** it SHALL be reachable by opening that leader's detail modal

#### Scenario: Entry alignment
- **WHEN** a leader entry renders
- **THEN** the image, name, and leadership title SHALL be centered within the entry

#### Scenario: Entry is visibly interactive
- **WHEN** a visitor hovers or focuses a leader entry
- **THEN** the entry SHALL give a visible indication that it can be opened

#### Scenario: Image accessibility
- **GIVEN** the entry is a button whose visible text already carries the leader's name
- **WHEN** a leader entry renders
- **THEN** the image SHALL be treated as decorative so assistive technology announces the leader's name once rather than twice
