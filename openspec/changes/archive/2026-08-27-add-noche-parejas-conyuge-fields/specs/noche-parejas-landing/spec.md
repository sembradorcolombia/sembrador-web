## MODIFIED Requirements

### Requirement: Noche de Parejas landing + registration page
The system SHALL display a branded campaign landing at `/noche-parejas` for the couples dinner (Cena para parejas). The page SHALL be full-bleed (no shared Navbar/Footer), use the campaign lavender background, show the El Sembrador white logo, the campaign title graphic, the couple photo, the event label "Cena para parejas", and the datetime "Viernes" / "SEP. 18 7:00PM". The same page SHALL show the registration form. The form SHALL capture the registrant with fields for nombre, apellido, email, and teléfono. The form SHALL provide an optional cónyuge step: a checkbox that, when checked, reveals cónyuge fields for nombre, apellido, email, and teléfono, plus a relationship-status select describing the couple with options Casados, Novios, Comprometidos, and Unión libre. When the checkbox is unchecked, the cónyuge fields SHALL NOT be displayed and SHALL NOT be required. The form SHALL retain the data-policy acceptance checkbox and a submit control labeled "Registrarse". The cónyuge fields SHALL be visually grouped under a clear Spanish heading so it is clear they belong to the cónyuge. All user-facing copy SHALL be in Spanish. The layout SHALL remain usable on mobile viewports (content stacked; couple photo first).

#### Scenario: Landing renders campaign chrome, copy, and form
- **WHEN** a user visits `/noche-parejas`
- **THEN** the page SHALL display the white church logo, the campaign title graphic, "Cena para parejas", "Viernes" and "SEP. 18 7:00PM"
- **AND** the page SHALL display registrant inputs labeled "Nombre:", "Apellido:", "Email:", and "Teléfono:"
- **AND** the page SHALL display a checkbox to also register the cónyuge
- **AND** a checkbox whose label includes "Política de tratamiento de datos" and links to `/politica-de-datos`
- **AND** a submit control labeled "Registrarse"
- **AND** the shared Navbar and Footer SHALL NOT be rendered

#### Scenario: Cónyuge fields are revealed on demand
- **WHEN** the user checks the "registrar también a mi cónyuge" checkbox
- **THEN** the page SHALL display cónyuge inputs for nombre, apellido, email, and teléfono
- **AND** the page SHALL display a relationship-status select with options "Casados", "Novios", "Comprometidos", and "Unión libre"
- **AND** when the checkbox is unchecked those fields SHALL NOT be displayed

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
The form SHALL validate all fields client-side using Zod schemas before submission, displaying inline Spanish error messages below invalid fields. Registrant fields SHALL always be validated. The cónyuge fields and the relationship-status select SHALL be validated only when the cónyuge checkbox is checked; when it is unchecked, empty cónyuge fields SHALL NOT block submission.

#### Scenario: Required registrant field validation
- **WHEN** the user submits the form with any empty registrant nombre, apellido, email, or teléfono
- **THEN** the form SHALL display inline error messages and SHALL NOT submit

#### Scenario: Cónyuge fields required only when adding a cónyuge
- **WHEN** the cónyuge checkbox is checked and any cónyuge nombre, apellido, email, teléfono, or the relationship is empty or invalid
- **THEN** the form SHALL display the corresponding Spanish error and SHALL NOT submit
- **AND** when the cónyuge checkbox is unchecked, the form SHALL submit with empty cónyuge fields

#### Scenario: Name length validation
- **WHEN** the user enters a registrant nombre or apellido — or, with the cónyuge checkbox checked, a cónyuge nombre or apellido — shorter than 2 characters or longer than 100 characters
- **THEN** the form SHALL display the corresponding Spanish length error and SHALL NOT submit

#### Scenario: Phone format validation
- **WHEN** the user enters a registrant teléfono — or, with the cónyuge checkbox checked, a cónyuge teléfono — that is not exactly 10 digits
- **THEN** the form SHALL display the error "El teléfono debe tener 10 dígitos"

#### Scenario: Email validation
- **WHEN** the user enters an invalid email format, a disposable email domain, or a known test email address for the registrant — or, with the cónyuge checkbox checked, for the cónyuge
- **THEN** the form SHALL display the corresponding Spanish error message and SHALL NOT submit

#### Scenario: Relationship required when adding a cónyuge
- **WHEN** the cónyuge checkbox is checked and the user submits without selecting a relationship status
- **THEN** the form SHALL display a Spanish error indicating the relationship is required and SHALL NOT submit

#### Scenario: Data policy must be accepted
- **WHEN** the user submits the form without checking the data policy checkbox
- **THEN** the form SHALL display the error "Debes aceptar la política de tratamiento de datos"
- **AND** the form SHALL NOT submit

## ADDED Requirements

### Requirement: Registration persistence via event subscriptions and relationship link
On successful form submission, the system SHALL persist every person as an `event_subscriptions` row for the Noche de Parejas event via a Supabase RPC. The registrant SHALL always be inserted. When a cónyuge is added and is not already registered for the event, the cónyuge SHALL be inserted as a second `event_subscriptions` row; when the cónyuge is already registered for the event, that existing subscription SHALL be reused rather than duplicated. When a cónyuge is added, the system SHALL record the couple link in the `noche_parejas_relationships` table, referencing the registrant's and the cónyuge's `event_subscriptions` rows and storing the cónyuge nombre, cónyuge apellido, and the selected relationship status. Capacity SHALL be checked for the number of new subscriptions required before any row is inserted.

#### Scenario: Registrant only
- **WHEN** the user submits a valid form with the cónyuge checkbox unchecked
- **THEN** one `event_subscriptions` row SHALL be created for the registrant
- **AND** no `noche_parejas_relationships` row SHALL be created
- **AND** the user SHALL be navigated to `/noche-parejas/registro-exitoso`

#### Scenario: Couple where the cónyuge is not yet registered
- **WHEN** the user submits a valid form with the cónyuge checkbox checked and the cónyuge email is not already registered for the event
- **THEN** two `event_subscriptions` rows SHALL be created (registrant and cónyuge)
- **AND** a `noche_parejas_relationships` row SHALL link them with the cónyuge nombre, apellido, and relationship
- **AND** the user SHALL be navigated to `/noche-parejas/registro-exitoso`

#### Scenario: Couple where the cónyuge is already registered
- **WHEN** the user submits a valid form with the cónyuge checkbox checked and the cónyuge email is already registered for the event
- **THEN** the cónyuge's existing `event_subscriptions` row SHALL be reused and no duplicate subscription SHALL be created
- **AND** a `noche_parejas_relationships` row SHALL link the registrant to that existing subscription
- **AND** the form SHALL display a Spanish warning that the cónyuge was already registered and the relationship was linked to the existing registration
- **AND** the user SHALL be navigated to `/noche-parejas/registro-exitoso`

#### Scenario: Cónyuge email equals registrant email
- **WHEN** the user submits with the cónyuge checkbox checked and the cónyuge email equals the registrant email
- **THEN** the system SHALL NOT persist the registration
- **AND** the form SHALL display a Spanish error that the cónyuge email cannot be the same as the registrant's

#### Scenario: Registrant already registered
- **WHEN** the registrant email is already registered for the event
- **THEN** the form SHALL display the Spanish error "Ya estás inscrito en este evento"
- **AND** the user SHALL remain on `/noche-parejas`

#### Scenario: Event at capacity
- **WHEN** persisting the required new subscriptions would exceed the event's maximum capacity
- **THEN** the form SHALL display the Spanish error "Este evento ya alcanzó su capacidad máxima"
- **AND** the user SHALL remain on `/noche-parejas`

#### Scenario: Unexpected RPC failure
- **WHEN** the RPC call fails for a reason other than the handled cases above
- **THEN** the form SHALL display an error toast "Ocurrió un error inesperado. Intenta de nuevo más tarde."
- **AND** the user SHALL remain on `/noche-parejas`

## REMOVED Requirements

### Requirement: Registration persistence via event subscriptions
**Reason**: Superseded by "Registration persistence via event subscriptions and relationship link", which keeps the single-person `event_subscriptions` persistence but adds the optional cónyuge subscription and the `noche_parejas_relationships` couple link. The prior single-person requirement no longer describes the couple behavior.
**Migration**: New submissions go through the `create_noche_parejas_registration` RPC. Existing `event_subscriptions` rows for the event remain valid and unchanged; rows created before this change simply have no associated `noche_parejas_relationships` entry.
