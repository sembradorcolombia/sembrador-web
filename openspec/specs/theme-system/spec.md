### Requirement: El Sembrador brand palette as default theme
The system SHALL define the official El Sembrador brand colors as the default CSS custom properties in `@theme` inside `src/styles.css`, replacing the current placeholder colors.

#### Scenario: Brand primary color applied site-wide
- **WHEN** any page renders outside of a `[data-theme]` override block
- **THEN** `--color-primary` SHALL resolve to `#26466d` (brand dark blue)
- **AND** `--color-secondary` SHALL resolve to `#3479bc` (brand light blue)

#### Scenario: Full palette available as CSS tokens
- **WHEN** `src/styles.css` is loaded
- **THEN** the following tokens SHALL be defined in `@theme`:
  - `--color-primary: #26466d`
  - `--color-primary-dark: #1b4974`
  - `--color-secondary: #3479bc`
  - `--color-secondary-dark: #239650`
  - `--color-accent: #fcbb69`
  - `--color-accent-dark: #e77342`
  - `--color-green: #239650`
  - `--color-green-dark: #256d45`
  - `--color-gray: #8a8c8b`
  - `--color-dark: #222222`

### Requirement: Scoped Equilibrio theme via data attribute
The system SHALL provide a `[data-theme="equilibrio"]` CSS override block that restores the Equilibrio palette (pink/purple) for any DOM subtree carrying that attribute.

#### Scenario: Equilibrio theme tokens override defaults
- **WHEN** a DOM element has `data-theme="equilibrio"`
- **THEN** all descendant elements SHALL resolve `--color-primary` to `#FF2D77` (pink)
- **AND** `--color-primary-dark` SHALL resolve to `#CC245F`
- **AND** `--color-secondary` SHALL resolve to `#1D13BD` (purple)
- **AND** `--color-secondary-dark` SHALL resolve to `#100A66`

#### Scenario: Theme attribute does not affect sibling routes
- **WHEN** a user navigates from `/eventos/equilibrio` to any other route
- **THEN** the `data-theme="equilibrio"` attribute SHALL no longer be present in the DOM
- **AND** all color tokens SHALL resolve to the default El Sembrador palette
