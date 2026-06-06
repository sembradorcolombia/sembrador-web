## MODIFIED Requirements

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
- **AND** the QR code image SHALL be an interactive control that, when activated, opens an enlarged (zoomed) view of the same QR code

#### Scenario: Opening the zoomed QR code
- **GIVEN** a giving option displays a QR code image
- **WHEN** the user clicks or taps the QR code, or focuses it and presses Enter or Space
- **THEN** the system SHALL open a modal overlay displaying a larger, scan-friendly version of that QR code
- **AND** the enlarged image SHALL be requested at a higher resolution than the thumbnail via the Sanity image URL builder
- **AND** the modal SHALL be fully visible within the viewport on both mobile and desktop

#### Scenario: Closing the zoomed QR code
- **GIVEN** the zoomed QR code modal is open
- **WHEN** the user activates the close control, presses Escape, or clicks the overlay outside the image
- **THEN** the modal SHALL close and return focus to the page
- **AND** the close control SHALL be labeled in Spanish ("Cerrar")

#### Scenario: Zoom affordance and accessibility
- **GIVEN** a giving option displays a QR code image
- **WHEN** the user hovers or focuses the QR code
- **THEN** the QR code SHALL present a visible affordance indicating it can be enlarged (zoom cursor and/or focus ring)
- **AND** the interactive QR code SHALL expose a Spanish accessible label indicating it opens an enlarged view (e.g. "Ampliar código QR")

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
