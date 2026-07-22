## MODIFIED Requirements

### Requirement: Consolidation registration form display
The system SHALL display a registration form at `/consolidacion` with the following fields: nombre (name), apellido (lastname), celular (mobile), correo electrónico (email), conectar selector, comentario (comment, optional), and a data policy acceptance checkbox. The form SHALL render within the shared site layout (Navbar/Footer) and be usable on mobile viewports.

#### Scenario: Form renders with all fields
- **WHEN** a user visits `/consolidacion`
- **THEN** the page SHALL display input fields for nombre, apellido, celular, and correo electrónico
- **AND** a select field labeled "¿Cómo quieres conectar?" with options: "Comunidades misionales", "Discipulado 1:1", "Consejería"
- **AND** an optional comment textarea
- **AND** a checkbox with the label linking to `/politica-de-datos`

#### Scenario: Responsive form layout
- **WHEN** a user visits `/consolidacion` on a mobile viewport (narrower than 768px)
- **THEN** the form SHALL display in a single-column layout with full-width fields

### Requirement: Form validation
The form SHALL validate all fields client-side using Zod schemas before submission, displaying inline Spanish error messages below invalid fields.

#### Scenario: Required field validation
- **WHEN** the user submits the form with empty nombre, apellido, celular, correo, or conectar selector
- **THEN** the form SHALL display inline error messages and SHALL NOT submit
- **AND** the conectar selector error SHALL be "Debes seleccionar una opción"

#### Scenario: Mobile format validation
- **WHEN** the user enters a celular value that is not exactly 10 digits
- **THEN** the form SHALL display the error "El teléfono debe tener 10 dígitos"

#### Scenario: Email validation
- **WHEN** the user enters an invalid email format, a disposable email domain, or a known test email address
- **THEN** the form SHALL display the corresponding Spanish error message and SHALL NOT submit

#### Scenario: Data policy must be accepted
- **WHEN** the user submits the form without checking the data policy checkbox
- **THEN** the form SHALL display the error "Debes aceptar la política de tratamiento de datos"
