## MODIFIED Requirements

### Requirement: Layout opt-out for specific routes
Certain routes SHALL NOT render the shared Navbar and Footer, preserving their custom layouts.

#### Scenario: Dashboard without shared layout
- **GIVEN** an admin navigates to `/dashboard`
- **WHEN** the page loads
- **THEN** the Navbar and Footer SHALL NOT be rendered

#### Scenario: Login without shared layout
- **GIVEN** a user navigates to `/login`
- **WHEN** the page loads
- **THEN** the Navbar and Footer SHALL NOT be rendered

#### Scenario: Event series showcase preserves custom header
- **GIVEN** a user navigates to `/eventos/$seriesSlug` (e.g., `/eventos/equilibrio`)
- **WHEN** the page loads
- **THEN** the shared Navbar SHALL NOT be rendered, allowing the event series page to use its own custom header

#### Scenario: Noche de Parejas campaign without shared layout
- **GIVEN** a user navigates to `/noche-parejas` or `/noche-parejas/registro-exitoso`
- **WHEN** the page loads
- **THEN** the Navbar and Footer SHALL NOT be rendered
