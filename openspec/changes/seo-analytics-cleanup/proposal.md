## Why

With all new pages in place (homepage, blog, events, about, next steps, give), the site needs consistent SEO meta tags across every page, proper Open Graph tags for social sharing, and expanded analytics tracking. Some blog and event pages already have basic `<Helmet>` tags from their respective changes, but there's no site-wide consistency or default fallbacks. Additionally, the project documentation (`CLAUDE.md`) needs updating to reflect the new architecture, and tests need to cover the new routes.

## What Changes

- Establish a consistent SEO meta tag strategy across all pages: title format "{Page} — El Sembrador", default description, and Open Graph defaults
- Create a reusable `SeoHead` component that wraps `react-helmet-async` with site-wide defaults and per-page overrides
- Add Open Graph meta tags (og:title, og:description, og:image, og:url) to all pages, with blog posts and events using their featured images
- Extend Meta Pixel tracking in `main.tsx` to fire `PageView` on `/eventos/*` routes (replacing the old `/equilibrio` check)
- Add custom GA4 events for key user interactions on new pages (blog post view, giving page view)
- Clean up any remaining Equilibrio-specific references in generic code
- Update `CLAUDE.md` with the new complete route table, project structure, and CMS architecture documentation
- Add or update unit tests for new hooks, components, and routes

## Capabilities

### New Capabilities
- `seo-meta`: Consistent SEO meta tags and Open Graph tags across all pages with a reusable component
- `analytics-tracking`: Extended Google Analytics and Meta Pixel tracking covering all new site sections

### Modified Capabilities

## Impact

- **Modified files**: `src/main.tsx` (Meta Pixel scope update), multiple route files (add/update `<Helmet>` or `SeoHead` usage), `CLAUDE.md` (documentation update)
- **New files**: `src/components/SeoHead.tsx` (reusable SEO component), new test files
- **No new dependencies**
- **Depends on**: All prior changes (3-6) being merged — this is the final sweep
- **No route path changes**
