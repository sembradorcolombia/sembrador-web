## ADDED Requirements

### Requirement: Consistent page title format
All pages SHALL use the title format "{Page Title} — El Sembrador" for consistency across the site.

#### Scenario: Page title on static pages
- **GIVEN** a user visits any page on the site
- **WHEN** the page renders
- **THEN** the document title SHALL follow the format "{Page Title} — El Sembrador" (e.g., "Blog — El Sembrador", "Dar — El Sembrador")

#### Scenario: Homepage title
- **WHEN** a user visits `/`
- **THEN** the document title SHALL be "El Sembrador — Iglesia en Medellín" (or a similar primary title without duplication)

### Requirement: Default meta description
All pages SHALL include a `<meta name="description">` tag with either page-specific content or a site-wide default.

#### Scenario: Page-specific description
- **GIVEN** a page has custom description content (e.g., blog post excerpt, event series description)
- **WHEN** the page renders
- **THEN** the meta description SHALL use the page-specific content

#### Scenario: Default description fallback
- **GIVEN** a page does not provide a custom description
- **WHEN** the page renders
- **THEN** the meta description SHALL use a site-wide default describing El Sembrador church

### Requirement: Open Graph meta tags
All public pages SHALL include Open Graph meta tags for social media sharing.

#### Scenario: Open Graph on content pages
- **GIVEN** a user shares a blog post or event page URL on social media
- **WHEN** the social platform fetches the page metadata
- **THEN** the page SHALL provide: `og:title`, `og:description`, `og:image`, `og:url`, and `og:type`

#### Scenario: Open Graph with featured image
- **GIVEN** a blog post has a featured image or an event has a speaker image
- **WHEN** the Open Graph tags are rendered
- **THEN** `og:image` SHALL use that content-specific image URL

#### Scenario: Open Graph default image
- **GIVEN** a page does not have a content-specific image
- **WHEN** the Open Graph tags are rendered
- **THEN** `og:image` SHALL use a default site image (e.g., from `siteSettings.heroImage`)

### Requirement: Reusable SeoHead component
The system SHALL provide a reusable `SeoHead` component that wraps `react-helmet-async` with site-wide defaults and accepts per-page overrides.

#### Scenario: SeoHead with defaults only
- **GIVEN** a page renders `<SeoHead />` with no props
- **WHEN** the head tags are applied
- **THEN** the page SHALL have the default site title, default description, and default Open Graph tags

#### Scenario: SeoHead with overrides
- **GIVEN** a page renders `<SeoHead title="Blog" description="Sermones y noticias" image={imageUrl} />`
- **WHEN** the head tags are applied
- **THEN** the page title SHALL be "Blog — El Sembrador", meta description SHALL be "Sermones y noticias", and og:image SHALL use the provided image URL
