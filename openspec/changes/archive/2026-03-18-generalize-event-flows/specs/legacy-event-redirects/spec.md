## ADDED Requirements

### Requirement: Redirect old Equilibrio URLs to new event URLs
The system SHALL redirect all old `/equilibrio/*` paths to their corresponding `/eventos/equilibrio/*` paths to preserve existing QR codes and shared links.

#### Scenario: Redirect equilibrio index
- **GIVEN** a user visits `/equilibrio`
- **WHEN** the route resolves
- **THEN** the user SHALL be redirected to `/eventos/equilibrio` with any search params preserved

#### Scenario: Redirect equilibrio child routes
- **GIVEN** a user visits `/equilibrio/registro-exitoso`
- **WHEN** the route resolves
- **THEN** the user SHALL be redirected to `/eventos/equilibrio/registro-exitoso`

#### Scenario: Redirect equilibrio with search params
- **GIVEN** a user visits `/equilibrio?evento=paz-financiera`
- **WHEN** the route resolves
- **THEN** the user SHALL be redirected to `/eventos/equilibrio?evento=paz-financiera`

#### Scenario: Redirect equilibrio attendance confirmation with token
- **GIVEN** a user visits `/equilibrio/confirmar-asistencia?token=abc-123`
- **WHEN** the route resolves
- **THEN** the user SHALL be redirected to `/eventos/equilibrio/confirmar-asistencia?token=abc-123`

#### Scenario: All equilibrio child routes redirect
- **WHEN** a user visits any of the following paths: `/equilibrio/conexion`, `/equilibrio/conexion-exitosa`, `/equilibrio/asistencia-confirmada`, `/equilibrio/feedback`, `/equilibrio/feedback-exitoso`
- **THEN** each SHALL redirect to its corresponding `/eventos/equilibrio/*` path
