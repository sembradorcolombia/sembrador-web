### Requirement: Navbar displays on public pages
The system SHALL render a persistent navigation bar at the top of all public pages with the church logo and navigation links.

#### Scenario: Navbar renders with navigation links
- **GIVEN** a user visits any public page (/, /blog, /acerca, /eventos, /siguientes-pasos, /dar)
- **WHEN** the page loads
- **THEN** the Navbar SHALL be visible at the top with the El Sembrador logo and links: Inicio, Blog, Acerca, Eventos, Siguientes Pasos, Dar

#### Scenario: Active link highlighting
- **GIVEN** a user is on the `/blog` page
- **WHEN** the Navbar renders
- **THEN** the "Blog" link SHALL be visually distinguished from other links to indicate the current section

### Requirement: Navbar responsive mobile menu
The system SHALL collapse the navigation links into a hamburger menu on small screens and display them in a slide-out or dropdown panel.

#### Scenario: Hamburger menu on mobile
- **GIVEN** a user visits any public page on a viewport narrower than the `md` breakpoint (768px)
- **WHEN** the page loads
- **THEN** the navigation links SHALL be hidden and a hamburger menu button SHALL be visible

#### Scenario: Opening mobile menu
- **GIVEN** the hamburger menu button is visible
- **WHEN** the user taps the hamburger button
- **THEN** a menu panel SHALL slide open showing all navigation links

#### Scenario: Closing mobile menu on navigation
- **GIVEN** the mobile menu panel is open
- **WHEN** the user taps a navigation link
- **THEN** the menu panel SHALL close and the user SHALL navigate to the selected route

### Requirement: Footer displays on public pages
The system SHALL render a footer at the bottom of all public pages with church information and quick links sourced from the Sanity CMS `siteSettings` document.

#### Scenario: Footer renders with CMS church info
- **GIVEN** a user visits any public page
- **WHEN** the page loads
- **THEN** the Footer SHALL display the church logo, a tagline from `siteSettings.footerTagline` (or fallback text), a copyright notice with the current year, and quick navigation links

#### Scenario: Footer social links from CMS
- **GIVEN** the church has social media profiles configured in `siteSettings.socialLinks`
- **WHEN** the Footer renders
- **THEN** social media links SHALL be displayed as icon links opening in a new tab, using the URLs and platform values from the CMS

#### Scenario: Footer renders without layout breaking when CMS data is loading
- **GIVEN** the `siteSettings` query has not yet resolved
- **WHEN** the Footer renders during initial load
- **THEN** the Footer SHALL display static fallback content without visual errors or empty sections

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

### Requirement: Navbar and Footer accessibility
The Navbar and Footer SHALL use semantic HTML elements and appropriate ARIA attributes for screen reader accessibility.

#### Scenario: Semantic navigation markup
- **WHEN** the Navbar renders
- **THEN** it SHALL use a `<nav>` element with `aria-label="Navegación principal"`

#### Scenario: Semantic footer markup
- **WHEN** the Footer renders
- **THEN** it SHALL use a `<footer>` element
