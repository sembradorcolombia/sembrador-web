## Purpose

The consolidation flow (`/consolidacion`) lets visitors register their interest in next steps at El Sembrador (Comunidades misionales, Discipulado 1:1, Consejería), capturing contact data in Supabase so the pastoral team can follow up.
## Requirements
### Requirement: Consolidation registration form display
The system SHALL display a registration form at `/consolidacion` with the following fields: nombre (name), apellido (lastname), celular (mobile), correo electrónico (email), paso a seguir (next step selector), comentario (comment, optional), and a data policy acceptance checkbox. The form SHALL render within the shared site layout (Navbar/Footer) and be usable on mobile viewports.

#### Scenario: Form renders with all fields
- **WHEN** a user visits `/consolidacion`
- **THEN** the page SHALL display input fields for nombre, apellido, celular, and correo electrónico
- **AND** a select field for the next step with options: "Comunidades misionales", "Discipulado 1:1", "Consejería"
- **AND** an optional comment textarea
- **AND** a checkbox with the label linking to `/politica-de-datos`

#### Scenario: Responsive form layout
- **WHEN** a user visits `/consolidacion` on a mobile viewport (narrower than 768px)
- **THEN** the form SHALL display in a single-column layout with full-width fields

### Requirement: Next step pre-selection from query parameter
The form SHALL pre-select the next step option when a `paso` search parameter is present in the URL and matches one of the available options.

#### Scenario: Valid paso parameter pre-selects the step
- **WHEN** a user visits `/consolidacion?paso=Comunidades misionales`
- **THEN** the next step selector SHALL be pre-selected with "Comunidades misionales"

#### Scenario: Missing or invalid paso parameter
- **WHEN** a user visits `/consolidacion` without a `paso` parameter, or with a value that does not match any option
- **THEN** the next step selector SHALL display the empty placeholder option

### Requirement: Form validation
The form SHALL validate all fields client-side using Zod schemas before submission, displaying inline Spanish error messages below invalid fields.

#### Scenario: Required field validation
- **WHEN** the user submits the form with empty nombre, apellido, celular, correo, or next step
- **THEN** the form SHALL display inline error messages and SHALL NOT submit

#### Scenario: Mobile format validation
- **WHEN** the user enters a celular value that is not exactly 10 digits
- **THEN** the form SHALL display the error "El teléfono debe tener 10 dígitos"

#### Scenario: Email validation
- **WHEN** the user enters an invalid email format, a disposable email domain, or a known test email address
- **THEN** the form SHALL display the corresponding Spanish error message and SHALL NOT submit

#### Scenario: Data policy must be accepted
- **WHEN** the user submits the form without checking the data policy checkbox
- **THEN** the form SHALL display the error "Debes aceptar la política de tratamiento de datos"

### Requirement: Registration data persistence
On successful form submission, the system SHALL persist the registration to the `consolidation_registrations` Supabase table via the `create_consolidation_registration` RPC function, storing name, lastname, mobile, email, next_step, comment, and accepts_data_policy.

#### Scenario: Successful registration persists data
- **WHEN** the user submits a valid form
- **THEN** a new row SHALL be inserted into `consolidation_registrations` with the submitted values and a `created_at` timestamp

#### Scenario: Submission error handling
- **WHEN** the RPC call fails
- **THEN** the form SHALL display an error toast "Ocurrió un error inesperado. Intenta de nuevo más tarde." and SHALL NOT navigate away

### Requirement: Success flow
After successful registration, the system SHALL navigate to `/consolidacion/registro-exitoso`, which SHALL display a confirmation message and a link back to the homepage.

#### Scenario: Navigation to success page
- **WHEN** a registration is persisted successfully
- **THEN** the user SHALL be navigated to `/consolidacion/registro-exitoso`

#### Scenario: Success page content
- **WHEN** the user lands on `/consolidacion/registro-exitoso`
- **THEN** the page SHALL display "¡Registro exitoso!" and a message indicating the church will contact them
- **AND** a "Volver" link navigating to `/`

#### Scenario: Success page analytics
- **WHEN** the user lands on `/consolidacion/registro-exitoso`
- **THEN** a Meta Pixel `trackCustom("ConsolidationSuccess")` event SHALL fire
