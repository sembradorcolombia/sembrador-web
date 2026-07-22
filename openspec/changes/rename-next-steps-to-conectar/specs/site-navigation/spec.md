## MODIFIED Requirements

### Requirement: Navbar displays on public pages
The system SHALL render a persistent navigation bar at the top of all public pages with the church logo and navigation links.

#### Scenario: Navbar renders with navigation links
- **GIVEN** a user visits any public page (/, /blog, /acerca, /eventos, /conectar, /dar)
- **WHEN** the page loads
- **THEN** the Navbar SHALL be visible at the top with the El Sembrador logo and links: Inicio, Blog, Acerca, Eventos, Conectar, Dar
- **AND** the "Conectar" link SHALL navigate to `/conectar`

#### Scenario: Active link highlighting
- **GIVEN** a user is on the `/blog` page
- **WHEN** the Navbar renders
- **THEN** the "Blog" link SHALL be visually distinguished from other links to indicate the current section
