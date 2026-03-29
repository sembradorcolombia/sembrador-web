## ADDED Requirements

### Requirement: GA4 page view tracking on all routes
Google Analytics SHALL fire a `page_view` event on every route navigation across the entire site.

#### Scenario: GA4 tracks new page routes
- **GIVEN** GA4 is configured with `VITE_GA_MEASUREMENT_ID`
- **WHEN** a user navigates to any new route (`/blog`, `/acerca`, `/eventos`, `/siguientes-pasos`, `/dar`)
- **THEN** a GA4 `page_view` event SHALL fire with the correct page path

### Requirement: Meta Pixel expanded scope
Meta Pixel `PageView` events SHALL fire on all `/eventos/*` routes, replacing the previous `/equilibrio`-only scope.

#### Scenario: Meta Pixel on event routes
- **GIVEN** Meta Pixel is configured with `VITE_META_PIXEL_ID`
- **WHEN** a user navigates to any route under `/eventos/*`
- **THEN** a Meta Pixel `PageView` event SHALL fire

#### Scenario: Meta Pixel does not fire on non-event routes
- **GIVEN** Meta Pixel is configured
- **WHEN** a user navigates to `/blog`, `/acerca`, `/dar`, or `/siguientes-pasos`
- **THEN** a Meta Pixel `PageView` event SHALL NOT fire (unless the scope is broadened intentionally)

### Requirement: Custom analytics events for key interactions
The system SHALL fire custom GA4 events for significant user interactions on new pages.

#### Scenario: Blog post view event
- **GIVEN** a user visits `/blog/$slug`
- **WHEN** the blog post detail page renders
- **THEN** a GA4 custom event `blog_post_view` SHALL fire with the post slug and category as parameters

#### Scenario: Giving page view event
- **GIVEN** a user visits `/dar`
- **WHEN** the giving page renders
- **THEN** a GA4 custom event `giving_page_view` SHALL fire
