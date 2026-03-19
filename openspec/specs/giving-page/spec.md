## ADDED Requirements

### Requirement: Giving page displays payment methods
The system SHALL display giving options at `/dar` sourced from CMS `givingOption` documents, ordered by the `order` field.

#### Scenario: Giving page with options
- **GIVEN** there are giving option documents in the CMS
- **WHEN** a user visits `/dar`
- **THEN** the page SHALL display all giving options ordered by their `order` field
- **AND** each option SHALL show: title, description, payment type indicator (bank / Nequi / Daviplata / other), and detail text (account numbers, instructions)

#### Scenario: Giving page with QR codes
- **GIVEN** a giving option has a `qrCodeImage` populated in the CMS
- **WHEN** the giving page renders that option
- **THEN** a QR code image SHALL be displayed alongside the payment details, rendered via the Sanity image URL builder

#### Scenario: Giving page empty state
- **GIVEN** there are no giving option documents in the CMS
- **WHEN** a user visits `/dar`
- **THEN** the page SHALL display a fallback message with general giving information or a contact prompt

#### Scenario: Responsive layout
- **GIVEN** a user visits `/dar`
- **WHEN** the viewport is narrower than `md` (768px)
- **THEN** giving option cards SHALL stack vertically
- **WHEN** the viewport is wider than `lg` (1024px)
- **THEN** giving option cards SHALL display in a multi-column layout

### Requirement: Giving page metadata
The giving page SHALL include appropriate page title.

#### Scenario: Page title
- **WHEN** a user visits `/dar`
- **THEN** the page title SHALL be "Dar — El Sembrador"
