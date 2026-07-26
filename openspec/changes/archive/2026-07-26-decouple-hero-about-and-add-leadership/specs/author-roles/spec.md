## ADDED Requirements

### Requirement: Authors carry multiple roles
The `author` document type SHALL accept a `roles` array allowing more than one role per author, selected from a defined list of options: speaker (`Predicador`), leader (`Líder`), and publisher (`Editor`). Free-text role values SHALL NOT be accepted. There SHALL NOT be a separate `pastor` role — a pastor is a leader whose position is stated in `leadershipTitle`.

#### Scenario: Author with several roles
- **WHEN** a content editor assigns both `speaker` and `leader` to an author
- **THEN** the document SHALL save with both roles retained

#### Scenario: Pastoral position is expressed as a leadership title
- **WHEN** an author is a pastor
- **THEN** they SHALL carry the `leader` role
- **AND** their pastoral position SHALL be stated in `leadershipTitle` rather than as a separate role

#### Scenario: Roles are constrained to the defined options
- **WHEN** an editor edits the roles field
- **THEN** only the defined role options SHALL be selectable
- **AND** arbitrary text SHALL NOT be enterable

#### Scenario: Duplicate roles are rejected
- **WHEN** an editor attempts to add the same role twice to one author
- **THEN** the Studio SHALL block publication with a validation message

#### Scenario: Roles are optional
- **WHEN** an author is saved with no roles selected
- **THEN** the save SHALL succeed
- **AND** that author SHALL NOT appear in any role-filtered listing

### Requirement: Leadership title is conditional on the leader role
When an author's roles include `leader`, the schema SHALL offer a `leadershipTitle` field describing their position (for example "Pastor principal"), together with a `leadershipOrder` number controlling display sequence. Both fields SHALL be hidden when the author does not carry the `leader` role.

#### Scenario: Leadership fields appear for leaders
- **WHEN** an editor adds the `leader` role to an author
- **THEN** the `leadershipTitle` and `leadershipOrder` fields SHALL become visible in the Studio

#### Scenario: Leadership fields are hidden for non-leaders
- **WHEN** an author's roles do not include `leader`
- **THEN** the `leadershipTitle` and `leadershipOrder` fields SHALL NOT be shown

#### Scenario: Leadership title is required for leaders
- **WHEN** an editor publishes an author carrying the `leader` role without a `leadershipTitle`
- **THEN** the Studio SHALL block publication with a validation message

#### Scenario: Author preview reflects roles
- **WHEN** an editor views the author list in the Studio
- **THEN** each entry SHALL display the author's name and an indication of their roles

### Requirement: Existing single role values are migrated
The previous single-valued `role` string field SHALL be replaced by `roles`. Existing author documents SHALL have their stored `role` value carried into the new field before the old field is removed, so no author loses their designation.

#### Scenario: Existing role is preserved
- **GIVEN** an author document with a stored single `role` value
- **WHEN** the migration runs
- **THEN** the author's `roles` array SHALL contain the equivalent role option

#### Scenario: Unrecognized role values are surfaced
- **WHEN** a stored `role` value does not map to any defined role option
- **THEN** the migration SHALL report that author for manual assignment rather than silently discarding the value

#### Scenario: Authors without a role
- **GIVEN** an author document with no stored `role` value
- **WHEN** the migration runs
- **THEN** the author SHALL be left with no roles and the migration SHALL NOT fail
