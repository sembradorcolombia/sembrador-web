## MODIFIED Requirements

### Requirement: Event showcase preserves scroll-snapping UX
The event series page SHALL preserve the existing full-screen scroll-snapping behavior with background color transitions. For the Equilibrio series, the page SHALL render inside a `data-theme="equilibrio"` scoped wrapper so all UI components inherit the Equilibrio color palette.

#### Scenario: Scroll-snapping between events
- **WHEN** the user scrolls on the series page
- **THEN** the page SHALL snap between full-screen event sections with smooth background color transitions driven by each event's theme color from the CMS

#### Scenario: Equilibrio series renders with Equilibrio theme
- **WHEN** a user visits any route under `/eventos/equilibrio/**`
- **THEN** the layout SHALL wrap the page content in a `data-theme="equilibrio"` container
- **AND** all `--color-primary` and `--color-secondary` tokens SHALL resolve to the Equilibrio palette (pink/purple)

#### Scenario: Other series render with default brand theme
- **WHEN** a user visits any route under `/eventos/$seriesSlug/**` where `$seriesSlug` is NOT `equilibrio`
- **THEN** no `data-theme` attribute SHALL be applied
- **AND** all color tokens SHALL resolve to the default El Sembrador brand palette (dark blue/light blue)
