## MODIFIED Requirements

### Requirement: Noche de Parejas landing + registration page
The system SHALL display a branded campaign landing at `/noche-parejas` for the couples dinner (Cena para parejas). The page SHALL be full-bleed (no shared Navbar/Footer), use the campaign lavender background, show the El Sembrador white logo, the campaign title graphic, the couple photo, the event label "Cena para parejas", and the datetime "Viernes" / "SEP. 18 7:00PM". The same page SHALL show the registration form. The form SHALL capture the registrant with fields for nombre, apellido, email, and teléfono, and SHALL capture the cónyuge with fields for nombre, apellido, email, and teléfono, plus a relationship-status select describing the couple with options Casados, Novios, Comprometidos, and Unión libre. The form SHALL retain the data-policy acceptance checkbox and a submit control labeled "Registrarse". The two people's fields SHALL be visually grouped so it is clear which fields belong to the registrant and which belong to the cónyuge. All user-facing copy SHALL be in Spanish. The layout SHALL remain usable on mobile viewports (content stacked; couple photo first).

#### Scenario: Landing renders campaign chrome, copy, and form
- **WHEN** a user visits `/noche-parejas`
- **THEN** the page SHALL display the white church logo, the campaign title graphic, "Cena para parejas", "Viernes" and "SEP. 18 7:00PM"
- **AND** the page SHALL display registrant inputs labeled "Nombre:", "Apellido:", "Email:", and "Teléfono:"
- **AND** the page SHALL display cónyuge inputs for nombre, apellido, email, and teléfono
- **AND** the page SHALL display a relationship-status select with options "Casados", "Novios", "Comprometidos", and "Unión libre"
- **AND** a checkbox whose label includes "Política de tratamiento de datos" and links to `/politica-de-datos`
- **AND** a submit control labeled "Registrarse"
- **AND** the shared Navbar and Footer SHALL NOT be rendered

#### Scenario: Landing SEO
- **WHEN** a user visits `/noche-parejas`
- **THEN** the document title/meta SHALL describe the couples dinner in Spanish via `SeoHead`

#### Scenario: Responsive landing + form layout
- **WHEN** a user visits `/noche-parejas` on a viewport narrower than 1024px
- **THEN** campaign content SHALL stack in a single column without horizontal overflow
- **AND** the couple photo SHALL appear first, followed by the title graphic, event details, and form
- **AND** the "Cena para parejas" label SHALL appear above the event date
- **AND** the form SHALL display in a single-column layout with full-width fields

### Requirement: Form validation
The form SHALL validate all fields client-side using Zod schemas before submission, displaying inline Spanish error messages below invalid fields. Validation SHALL cover both the registrant fields and the cónyuge fields, plus the required relationship-status select.

#### Scenario: Required field validation
- **WHEN** the user submits the form with any empty registrant or cónyuge nombre, apellido, email, or teléfono
- **THEN** the form SHALL display inline error messages and SHALL NOT submit

#### Scenario: Name length validation
- **WHEN** the user enters a registrant or cónyuge nombre or apellido shorter than 2 characters or longer than 100 characters
- **THEN** the form SHALL display the corresponding Spanish length error and SHALL NOT submit

#### Scenario: Phone format validation
- **WHEN** the user enters a registrant or cónyuge teléfono value that is not exactly 10 digits
- **THEN** the form SHALL display the error "El teléfono debe tener 10 dígitos"

#### Scenario: Email validation
- **WHEN** the user enters an invalid email format, a disposable email domain, or a known test email address for either the registrant or the cónyuge
- **THEN** the form SHALL display the corresponding Spanish error message and SHALL NOT submit

#### Scenario: Relationship required
- **WHEN** the user submits the form without selecting a relationship status
- **THEN** the form SHALL display a Spanish error indicating the relationship is required and SHALL NOT submit

#### Scenario: Data policy must be accepted
- **WHEN** the user submits the form without checking the data policy checkbox
- **THEN** the form SHALL display the error "Debes aceptar la política de tratamiento de datos"
- **AND** the form SHALL NOT submit

## ADDED Requirements

### Requirement: Registration persistence via couples table
On successful form submission, the system SHALL persist the registration as a single row in the dedicated `noche_parejas_couples` table via a Supabase RPC. The row SHALL store the registrant's nombre, apellido, email, and teléfono; the cónyuge's nombre, apellido, email, and teléfono; the selected relationship status; and the data-policy acceptance flag. All stored values SHALL match the submitted values.

#### Scenario: Successful registration persists couple data
- **WHEN** the user submits a valid form and neither email is already registered
- **THEN** a new `noche_parejas_couples` row SHALL be created holding both people's nombre, apellido, email, and teléfono, the selected relationship status, and `accepts_data_policy` true
- **AND** the user SHALL be navigated to `/noche-parejas/registro-exitoso`

#### Scenario: Unexpected RPC failure
- **WHEN** the RPC call fails for a reason other than a duplicate email
- **THEN** the form SHALL display an error toast "Ocurrió un error inesperado. Intenta de nuevo más tarde."
- **AND** the user SHALL remain on `/noche-parejas`

### Requirement: Duplicate email detection blocks submission
Before persisting, the system SHALL check both the registrant's email and the cónyuge's email against existing Noche de Parejas registrations. If either email is already registered, the system SHALL block the submission, SHALL NOT persist the registration, and SHALL display a Spanish warning naming which email is already registered. The form SHALL keep its entered values so the user can correct the offending email and resubmit.

#### Scenario: Registrant email already registered
- **WHEN** the user submits a valid form whose registrant email is already registered for Noche de Parejas
- **THEN** the form SHALL NOT persist the registration
- **AND** the form SHALL display a Spanish warning stating that the registrant's email is already registered
- **AND** the entered field values SHALL be preserved
- **AND** the user SHALL remain on `/noche-parejas`

#### Scenario: Cónyuge email already registered
- **WHEN** the user submits a valid form whose cónyuge email is already registered for Noche de Parejas
- **THEN** the form SHALL NOT persist the registration
- **AND** the form SHALL display a Spanish warning stating that the cónyuge's email is already registered
- **AND** the entered field values SHALL be preserved
- **AND** the user SHALL remain on `/noche-parejas`

#### Scenario: Neither email registered
- **WHEN** the user submits a valid form and neither the registrant nor the cónyuge email is already registered
- **THEN** the system SHALL proceed to persist the registration

## REMOVED Requirements

### Requirement: Registration persistence via event subscriptions
**Reason**: Noche de Parejas is a couples registration capturing two people plus a relationship status, which does not fit the single-person `event_subscriptions` shape. Persistence moves to the dedicated `noche_parejas_couples` table (see "Registration persistence via couples table"), and duplicate-email handling moves to a pre-submit check (see "Duplicate email detection blocks submission").
**Migration**: New submissions are written to `noche_parejas_couples` via the new RPC instead of `create_subscription_with_increment`. Any existing `event_subscriptions` rows previously created for the "Noche de Parejas" event remain in place and are not migrated by this change; if a consolidated view is needed later it can union both sources.
