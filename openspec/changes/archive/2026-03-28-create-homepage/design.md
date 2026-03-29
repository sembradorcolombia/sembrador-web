## Context

The current `/` route (`src/routes/index.tsx`) is a simple splash page with a background image, the El Sembrador logo, "Próximamente" text, and a button linking to `/equilibrio`. This will be completely replaced with a full homepage that acts as the site's entry point. The homepage will consume CMS data via hooks created in the `setup-sanity-cms` change and be wrapped by the Navbar/Footer from `add-site-layout`.

## Goals / Non-Goals

**Goals:**
- Create a visually appealing homepage that establishes the church's identity
- Provide clear pathways to all major site sections via preview cards
- Handle missing CMS content gracefully (the CMS may not be fully seeded when this ships)
- Follow responsive design principles for mobile through desktop

**Non-Goals:**
- Animated hero or parallax effects (keep it simple and performant)
- Server-side rendering or static generation (this is a client-side SPA)
- CMS preview/draft mode integration
- Personalized content based on user state

## Decisions

### Decision 1: Preview components in `src/components/home/`
**Choice:** Each homepage section is a separate component in `src/components/home/`.
**Alternative:** A single monolithic homepage component.
**Rationale:** Separate components keep each section focused, testable, and maintainable. Each component manages its own CMS data fetching via hooks, enabling independent loading states.

### Decision 2: Each preview component fetches its own data
**Choice:** Each preview component calls its own CMS hook (e.g., `BlogPreview` calls `useBlogPosts`, `EventsPreview` calls `useCmsEventSeries`).
**Alternative:** Fetch all homepage data in the route loader and pass as props.
**Rationale:** Follows the existing pattern where components own their data fetching via TanStack Query hooks. This allows independent loading/error states per section and leverages TanStack Query's caching — if a user navigates to `/blog` and back, the blog preview data is already cached. Route loaders would add complexity and couple all sections together.

### Decision 3: Sections stack vertically with alternating visual treatment
**Choice:** Homepage sections are stacked vertically in a single column with full-width backgrounds. Alternating sections use subtle background color or padding variations for visual rhythm.
**Alternative:** Complex grid layouts mixing sections.
**Rationale:** A vertical stack is the most common and readable pattern for church landing pages. It works well on all screen sizes with minimal responsive complexity. Preview card grids within each section provide visual interest.

### Decision 4: Graceful empty states
**Choice:** Sections with no CMS data are hidden entirely rather than showing "no content" messages.
**Alternative:** Always show sections with placeholder content.
**Rationale:** The site is growing incrementally — blog posts may not exist when the homepage first ships. Hiding empty sections creates a cleaner experience. As content is added to the CMS, sections automatically appear.

### Decision 5: CMS site settings as the hero data source
**Choice:** The hero section pulls `churchName`, `tagline`, and `heroImage` from the `useSiteSettings` hook.
**Alternative:** Hardcode hero content.
**Rationale:** Allows content editors to update the hero banner without code changes. Fallback values ("El Sembrador", generic welcome) are hardcoded for when CMS is unavailable.

## Risks / Trade-offs

- **[Multiple CMS requests on homepage]** Each preview component makes its own API call. On first load, this could mean 4-5 parallel CMS requests. → Mitigation: Sanity CDN caching, TanStack Query's stale-while-revalidate, and the requests are all small read operations. Parallel fetches mean the page assembles progressively rather than waiting for a single large request.

- **[Visual gap during loading]** With each section loading independently, there may be layout shift as content loads in. → Mitigation: Use skeleton placeholders or fixed-height containers for each preview section to reserve space.

- **[Dependency on two prior PRs]** This change requires both `setup-sanity-cms` and `add-site-layout` to be merged first. → Mitigation: Clear dependency ordering in the project plan. Can be developed in parallel on a branch that includes the prior changes.
