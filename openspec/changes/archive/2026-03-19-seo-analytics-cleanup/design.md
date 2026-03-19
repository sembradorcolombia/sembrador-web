## Context

The app uses `react-helmet-async` for managing `<head>` tags. Currently, some routes have `<Helmet>` tags (e.g., Equilibrio page sets its title) but there's no consistent strategy. GA4 page views already fire on all route navigations via `main.tsx` router `onResolved` handler. Meta Pixel currently fires `PageView` only on `/equilibrio` routes. The project documentation (`CLAUDE.md`) reflects the old structure.

## Goals / Non-Goals

**Goals:**
- Establish consistent SEO meta tags across all pages
- Create a reusable `SeoHead` component for DRY meta tag management
- Expand Meta Pixel tracking to `/eventos/*` routes
- Add custom GA4 events for blog and giving page interactions
- Update project documentation to reflect the new architecture
- Add test coverage for new routes and components

**Non-Goals:**
- Server-side rendering for SEO (this is a client-side SPA; crawlers that don't execute JS won't see dynamic meta tags)
- Structured data / JSON-LD markup
- Sitemap.xml generation
- Performance optimization or lighthouse score tuning

## Decisions

### Decision 1: Reusable `SeoHead` component
**Choice:** Create `src/components/SeoHead.tsx` that wraps `<Helmet>` with default values and accepts overrides via props (`title`, `description`, `image`, `type`). The component handles the title suffix ("— El Sembrador"), default descriptions, and Open Graph tags.
**Alternative:** Continue using `<Helmet>` directly in each route with repeated boilerplate.
**Rationale:** A reusable component ensures consistency and reduces boilerplate across 10+ route files. Changes to the title format or default image only need to happen in one place.

### Decision 2: Title format convention
**Choice:** `{Page Title} — El Sembrador` for all pages. The homepage uses `El Sembrador — Iglesia en Medellín` as a special case.
**Alternative:** `El Sembrador | {Page Title}` (site name first).
**Rationale:** Page-specific title first improves SEO since search engines give more weight to the beginning of the title. The homepage is the exception because the brand name IS the page identity.

### Decision 3: Default OG image from site settings
**Choice:** Default Open Graph image comes from `siteSettings.heroImage` in the CMS. Content pages (blog posts, events) override with their own featured images.
**Alternative:** Use a static default image committed to the repo.
**Rationale:** CMS-driven default allows content editors to update the social sharing image without code changes. Fallback to a static image in `public/` if CMS is unavailable.

### Decision 4: Meta Pixel scope update in `main.tsx`
**Choice:** Change the condition in the `onResolved` handler from checking for `/equilibrio` to checking for `/eventos` in the route path.
**Alternative:** Fire Meta Pixel on all routes.
**Rationale:** Keeping the pixel scoped to event routes maintains the original campaign tracking intent while covering all event series. The existing `SubscribeButtonClick` and `SubscribeSuccess` custom events remain scoped to event flows.

### Decision 5: Test strategy
**Choice:** Add unit tests for:
- `SeoHead` component (renders correct title format, defaults, overrides)
- CMS hooks (mock Sanity client, test query key structure and stale times)
- New route components (smoke tests that they render without errors)
**Alternative:** E2E tests only.
**Rationale:** Unit tests are faster and more focused. The existing E2E setup with Playwright can be extended later for full user flow testing across the new site structure.

## Risks / Trade-offs

- **[SPA SEO limitations]** Since this is a client-side SPA, search engine crawlers that don't execute JavaScript won't see the dynamically injected meta tags. → Mitigation: Major crawlers (Google, Bing) execute JS. For maximum SEO, the app could be migrated to SSR/SSG later (e.g., with TanStack Start or Next.js), but that's a separate concern.

- **[Test maintenance burden]** Adding tests for all new routes and components creates ongoing maintenance. → Mitigation: Keep tests focused on behavior (renders without error, correct title) rather than implementation details. Avoid snapshot tests for CMS-driven content.
