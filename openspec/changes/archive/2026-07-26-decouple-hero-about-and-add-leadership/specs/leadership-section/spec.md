## ADDED Requirements

### Requirement: Leadership section lists church leaders
The `/acerca` page SHALL display a leadership section listing every author whose roles include `leader`. Authors without that role SHALL NOT appear.

#### Scenario: Leaders are listed
- **WHEN** one or more authors carry the `leader` role
- **THEN** `/acerca` SHALL display a leadership section containing an entry for each of them

#### Scenario: Non-leaders are excluded
- **GIVEN** an author carries only the `speaker` or `publisher` role
- **WHEN** the leadership section renders
- **THEN** that author SHALL NOT appear

#### Scenario: Section is omitted when there are no leaders
- **WHEN** no author carries the `leader` role
- **THEN** the leadership section SHALL NOT be rendered

#### Scenario: Section heading
- **WHEN** the leadership section renders
- **THEN** it SHALL carry a Spanish heading such as "Nuestro liderazgo"

### Requirement: Leader entry contents
Each leadership entry SHALL display the author's image, name, and leadership title, centered as a single column. The author's bio SHALL NOT be shown on this page.

#### Scenario: Full leader entry
- **WHEN** a leader has an image, name, and leadership title
- **THEN** the entry SHALL display all three

#### Scenario: Bio is not displayed
- **GIVEN** a leader whose author document has a bio
- **WHEN** the leadership section renders
- **THEN** the bio SHALL NOT appear

#### Scenario: Entry alignment
- **WHEN** a leader entry renders
- **THEN** the image, name, and leadership title SHALL be centered within the entry

#### Scenario: Image accessibility
- **WHEN** a leader entry renders
- **THEN** the image SHALL carry alternative text, falling back to the leader's name when no alt text is set in the CMS

### Requirement: Leadership ordering
Leaders SHALL be displayed in ascending `leadershipOrder`. Leaders without an order SHALL appear after those with one, ordered by name.

#### Scenario: Explicit ordering is respected
- **GIVEN** leaders with `leadershipOrder` values 1, 2, and 3
- **WHEN** the leadership section renders
- **THEN** they SHALL appear in that ascending order

#### Scenario: Unordered leaders come last
- **GIVEN** some leaders have a `leadershipOrder` and others do not
- **WHEN** the leadership section renders
- **THEN** the ordered leaders SHALL appear first in ascending order
- **AND** the remaining leaders SHALL follow, ordered alphabetically by name

### Requirement: Leadership section states and responsiveness
The leadership section SHALL handle its own loading and failure states without breaking the rest of `/acerca`, and SHALL adapt to mobile viewports.

#### Scenario: Loading state
- **WHEN** the leadership data is being fetched
- **THEN** the section SHALL display a loading indicator

#### Scenario: Fetch failure is contained
- **WHEN** fetching the leaders fails
- **THEN** the leadership section SHALL be omitted or show a Spanish error message
- **AND** the rest of `/acerca` SHALL continue to render normally

#### Scenario: Mobile layout
- **WHEN** the leadership section is viewed on a viewport narrower than 640px
- **THEN** the entries SHALL stack in a single column with readable text and no horizontal page scrolling
