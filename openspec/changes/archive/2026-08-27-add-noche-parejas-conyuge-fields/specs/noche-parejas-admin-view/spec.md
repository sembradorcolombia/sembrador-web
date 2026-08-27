## ADDED Requirements

### Requirement: Couple columns on the events dashboard
The existing events dashboard subscriber table SHALL display, for each `event_subscriptions` row, the couple information associated with that subscription when one exists: the relationship status, the cónyuge nombre, and the cónyuge apellido. These SHALL appear as the columns "Relación", "Cónyuge nombre", and "Cónyuge apellido". A subscription that is not the registrant of a couple SHALL display a placeholder ("—") in these columns. All column labels SHALL be in Spanish.

#### Scenario: Couple registrant row shows relationship and cónyuge
- **WHEN** an admin views the subscribers table for the Noche de Parejas event and a subscription is the registrant of a couple
- **THEN** its "Relación" cell SHALL show the relationship status
- **AND** its "Cónyuge nombre" and "Cónyuge apellido" cells SHALL show the cónyuge's nombre and apellido

#### Scenario: Non-couple subscription shows placeholders
- **WHEN** a subscription has no associated couple relationship
- **THEN** its "Relación", "Cónyuge nombre", and "Cónyuge apellido" cells SHALL each display "—"

### Requirement: Couple data enrichment of subscriptions
When loading subscriptions for the dashboard, the system SHALL enrich each `event_subscriptions` row with its couple information (cónyuge nombre, cónyuge apellido, relationship) read from the `noche_parejas_relationships` table, matched by the subscription id. Subscriptions with no matching relationship SHALL have null couple fields.

#### Scenario: Enrichment matches by subscription id
- **WHEN** the dashboard loads subscriptions for an event that has couple relationships
- **THEN** each subscription that appears as a relationship's registrant SHALL carry that relationship's cónyuge nombre, cónyuge apellido, and relationship status
- **AND** subscriptions without a matching relationship SHALL have null couple fields

### Requirement: CSV export includes couple columns
The subscriber CSV export SHALL include the "Relación", "Cónyuge nombre", and "Cónyuge apellido" columns, using empty values for subscriptions that have no associated couple relationship.

#### Scenario: Export contains couple columns
- **WHEN** the admin downloads the subscribers CSV
- **THEN** the CSV header row SHALL include "Relación", "Cónyuge nombre", and "Cónyuge apellido"
- **AND** each data row SHALL include the relationship and cónyuge fields for couple registrants and empty values otherwise

### Requirement: Admin read access to couple relationships
Couple relationships SHALL be readable only by authenticated admin users; the underlying data access policy SHALL NOT expose relationship rows to anonymous or non-admin users.

#### Scenario: Admin reads relationships
- **WHEN** an authenticated admin loads the events dashboard
- **THEN** the couple relationship rows SHALL be returned and used to enrich the subscriptions

#### Scenario: Non-admin cannot read relationships
- **WHEN** an anonymous or non-admin client queries `noche_parejas_relationships`
- **THEN** no relationship rows SHALL be returned
