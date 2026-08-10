## Purpose

TBD - Desayuno registration flow at `/desayuno` for capturing visitor contact data in Supabase.

## Requirements

### Requirement: Desayuno registration form display
The system SHALL display a registration form at `/desayuno` with the following fields: nombre (name), apellido (lastname), correo electrónico (email), celular (phone), and a data policy acceptance checkbox. The form SHALL render within the shared site layout (Navbar/Footer) and be usable on mobile viewports. All user-facing copy SHALL be in Spanish.

#### Scenario: Form renders with all fields
- **WHEN** a user visits `/desayuno`
- **THEN** the page SHALL display input fields for nombre, apellido, correo electrónico, and celular
- **AND** a checkbox whose label links to `/politica-de-datos`
- **AND** a submit control to send the registration

#### Scenario: Responsive form layout
- **WHEN** a user visits `/desayuno` on a mobile viewport (narrower than 768px)
- **THEN** the form SHALL display in a single-column layout with full-width fields

#### Scenario: Page SEO
- **WHEN** a user visits `/desayuno`
- **THEN** the document title/meta SHALL describe the desayuno registration in Spanish via `SeoHead`

### Requirement: Form validation
The form SHALL validate all fields client-side using Zod schemas before submission, displaying inline Spanish error messages below invalid fields.

#### Scenario: Required field validation
- **WHEN** the user submits the form with empty nombre, apellido, correo electrónico, or celular
- **THEN** the form SHALL display inline error messages and SHALL NOT submit

#### Scenario: Name length validation
- **WHEN** the user enters a nombre or apellido shorter than 2 characters or longer than 100 characters
- **THEN** the form SHALL display the corresponding Spanish length error and SHALL NOT submit

#### Scenario: Phone format validation
- **WHEN** the user enters a celular value that is not exactly 10 digits
- **THEN** the form SHALL display the error "El teléfono debe tener 10 dígitos"

#### Scenario: Email validation
- **WHEN** the user enters an invalid email format, a disposable email domain, or a known test email address
- **THEN** the form SHALL display the corresponding Spanish error message and SHALL NOT submit

#### Scenario: Data policy must be accepted
- **WHEN** the user submits the form without checking the data policy checkbox
- **THEN** the form SHALL display the error "Debes aceptar la política de tratamiento de datos"
- **AND** the form SHALL NOT submit

### Requirement: Registration data persistence
On successful form submission, the system SHALL persist the registration to the `desayuno_registrations` Supabase table via the `create_desayuno_registration` RPC function, storing name, lastname, email, phone, and accepts_data_policy.

#### Scenario: Successful registration persists data
- **WHEN** the user submits a valid form
- **THEN** a new row SHALL be inserted into `desayuno_registrations` with the submitted values and a `created_at` timestamp

#### Scenario: Public clients cannot insert without RPC
- **WHEN** an unauthenticated client attempts a direct insert into `desayuno_registrations`
- **THEN** Row Level Security SHALL deny the operation
- **AND** only the SECURITY DEFINER RPC path SHALL create rows for public submissions

#### Scenario: Submission error handling
- **WHEN** the RPC call fails
- **THEN** the form SHALL display an error toast "Ocurrió un error inesperado. Intenta de nuevo más tarde." and SHALL NOT navigate away

### Requirement: Success flow
After successful registration, the system SHALL navigate to `/desayuno/registro-exitoso`, which SHALL display a confirmation message and a link back to the homepage.

#### Scenario: Navigation to success page
- **WHEN** a registration is persisted successfully
- **THEN** the user SHALL be navigated to `/desayuno/registro-exitoso`

#### Scenario: Success page content
- **WHEN** the user lands on `/desayuno/registro-exitoso`
- **THEN** the page SHALL display "¡Registro exitoso!" and a message indicating the church will contact them
- **AND** a "Volver" link navigating to `/`

#### Scenario: Success page analytics
- **WHEN** the user lands on `/desayuno/registro-exitoso`
- **THEN** a Meta Pixel `trackCustom("DesayunoSuccess")` event SHALL fire when `fbq` is available
