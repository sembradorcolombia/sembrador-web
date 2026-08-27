# noche-parejas-landing Specification

## Purpose

Provides the branded "Noche de Parejas" (Cena para parejas) couples dinner campaign: a full-bleed landing + registration page at `/noche-parejas`, client-side form validation, persistence via event subscriptions, and a success confirmation page.

## Requirements

### Requirement: Noche de Parejas landing + registration page
The system SHALL display a branded campaign landing at `/noche-parejas` for the couples dinner (Cena para parejas). The page SHALL be full-bleed (no shared Navbar/Footer), use the campaign lavender background, show the El Sembrador white logo, the campaign title graphic, the couple photo, the event label "Cena para parejas", and the datetime "Viernes" / "SEP. 18 7:00PM". The same page SHALL show the registration form with fields for nombre, apellido, email, teléfono, a note that only one spouse needs to register, a data-policy acceptance checkbox, and a submit control labeled "Registrarse". All user-facing copy SHALL be in Spanish. The layout SHALL remain usable on mobile viewports (content stacked; couple photo first).

#### Scenario: Landing renders campaign chrome, copy, and form
- **WHEN** a user visits `/noche-parejas`
- **THEN** the page SHALL display the white church logo, the campaign title graphic, "Cena para parejas", "Viernes" and "SEP. 18 7:00PM"
- **AND** the page SHALL display inputs labeled "Nombre:", "Apellido:", "Email:", and "Teléfono:"
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
The form SHALL validate all fields client-side using Zod schemas before submission, displaying inline Spanish error messages below invalid fields.

#### Scenario: Required field validation
- **WHEN** the user submits the form with empty nombres, apellidos, email, or teléfono
- **THEN** the form SHALL display inline error messages and SHALL NOT submit

#### Scenario: Name length validation
- **WHEN** the user enters nombres or apellidos shorter than 2 characters or longer than 100 characters
- **THEN** the form SHALL display the corresponding Spanish length error and SHALL NOT submit

#### Scenario: Phone format validation
- **WHEN** the user enters a teléfono value that is not exactly 10 digits
- **THEN** the form SHALL display the error "El teléfono debe tener 10 dígitos"

#### Scenario: Email validation
- **WHEN** the user enters an invalid email format, a disposable email domain, or a known test email address
- **THEN** the form SHALL display the corresponding Spanish error message and SHALL NOT submit

#### Scenario: Data policy must be accepted
- **WHEN** the user submits the form without checking the data policy checkbox
- **THEN** the form SHALL display the error "Debes aceptar la política de tratamiento de datos"
- **AND** the form SHALL NOT submit

### Requirement: Registration persistence via event subscriptions
On successful form submission, the system SHALL persist the registration as an `event_subscriptions` row for the seeded `events` record named "Noche de Parejas", using `create_subscription_with_increment`. The stored `name` SHALL be the concatenated nombres and apellidos (single space). Email, phone, `event_id`, and `accepts_data_policy` SHALL match the submitted values.

#### Scenario: Successful registration persists data
- **WHEN** the user submits a valid form and the "Noche de Parejas" event exists
- **THEN** a new `event_subscriptions` row SHALL be created for that event with `name` equal to nombres and apellidos joined by a space, plus email, phone, and `accepts_data_policy` true
- **AND** the event `current_count` SHALL increment

#### Scenario: Duplicate email for the same event
- **WHEN** the user submits a valid form with an email already registered for "Noche de Parejas"
- **THEN** the form SHALL display the error toast "Ya estás inscrito en este evento"
- **AND** the user SHALL remain on `/noche-parejas`

#### Scenario: Event at capacity
- **WHEN** the user submits a valid form and the event has reached `max_capacity`
- **THEN** the form SHALL display the error toast "Este evento ya alcanzó su capacidad máxima"
- **AND** the user SHALL remain on `/noche-parejas`

#### Scenario: Missing event
- **WHEN** the "Noche de Parejas" event cannot be resolved
- **THEN** the form SHALL NOT call the subscription RPC
- **AND** the submit control SHALL be disabled
- **AND** the user SHALL remain on `/noche-parejas`

#### Scenario: Unexpected RPC failure
- **WHEN** the RPC call fails for a reason other than capacity or duplicate
- **THEN** the form SHALL display an error toast "Ocurrió un error inesperado. Intenta de nuevo más tarde."
- **AND** the user SHALL remain on `/noche-parejas`

### Requirement: Success confirmation
After a successful registration, the system SHALL navigate to `/noche-parejas/registro-exitoso`, which SHALL use the campaign chrome, thank-you copy, and a control to return home. The layout SHALL remain usable on mobile viewports (content stacked; photo may sit below content).

#### Scenario: Navigation to success page
- **WHEN** a registration is persisted successfully
- **THEN** the user SHALL be navigated to `/noche-parejas/registro-exitoso`

#### Scenario: Success page content
- **WHEN** the user lands on `/noche-parejas/registro-exitoso`
- **THEN** the page SHALL display "Muchas gracias por registrarte" and "nos vemos en una noche especial"
- **AND** a control labeled "Ir al inicio" that navigates to `/`
- **AND** the shared Navbar and Footer SHALL NOT be rendered

#### Scenario: Success page analytics
- **WHEN** the user lands on `/noche-parejas/registro-exitoso`
- **THEN** a Meta Pixel `trackCustom("NocheParejasSuccess")` event SHALL fire when `fbq` is available

#### Scenario: Success page SEO
- **WHEN** a user visits `/noche-parejas/registro-exitoso`
- **THEN** the document title/meta SHALL describe the successful registration in Spanish via `SeoHead`

#### Scenario: Responsive success page
- **WHEN** a user visits `/noche-parejas/registro-exitoso` on a viewport narrower than 1024px
- **THEN** campaign content SHALL stack in a single column without horizontal overflow
- **AND** the thank-you copy and "Ir al inicio" control SHALL remain visible without requiring horizontal scroll
