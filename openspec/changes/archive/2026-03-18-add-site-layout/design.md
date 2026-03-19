## Context

The root layout (`__root.tsx`) currently renders only `<Outlet />`, `<Toaster />`, and devtools. There is an unused `Header.tsx` component with a basic hamburger menu that doesn't match the site's branding. The site uses Tailwind CSS 4 with a custom theme (primary pink, secondary blue), Right Grotesk display font, and Montserrat body font. Navigation uses TanStack Router's `Link` component with `activeProps` for active state styling.

## Goals / Non-Goals

**Goals:**
- Establish a consistent navigation and footer layout across all public pages
- Support responsive design with a mobile-friendly hamburger menu
- Allow specific routes to opt out of the shared layout
- Follow existing component conventions (Tailwind utilities, lucide-react icons)

**Non-Goals:**
- Dynamic navigation items from CMS (nav structure is fixed for now)
- Search functionality in the navbar
- Sticky/scroll-aware navbar behavior (can be added later)
- Authentication-aware navigation (show/hide admin links)

## Decisions

### Decision 1: Layout opt-out via route path matching
**Choice:** Check the current route path in `__root.tsx` using `useMatches()` or `useRouterState()` to determine whether to render Navbar/Footer. Routes like `/dashboard`, `/login`, and `/eventos/*/` (the event showcase, not the listing) will be excluded.
**Alternative:** Use route-level `staticData` or context to flag layout preferences per route.
**Rationale:** Path-based matching is simpler and doesn't require modifying every route file. The opt-out list is small and unlikely to change frequently. If it grows, we can switch to a route context approach.

### Decision 2: Components in `src/components/layout/`
**Choice:** Place `Navbar.tsx` and `Footer.tsx` in a new `src/components/layout/` directory.
**Alternative:** Place them directly in `src/components/`.
**Rationale:** Groups layout-related components together, following the existing pattern of domain-specific directories (`dashboard/`, `equilibrio/`, `forms/`, `ui/`).

### Decision 3: Static navigation items array
**Choice:** Navigation items are a hardcoded array in the Navbar component: `[{ label: "Inicio", to: "/" }, { label: "Blog", to: "/blog" }, ...]`.
**Alternative:** Fetch navigation structure from CMS `siteSettings`.
**Rationale:** The navigation structure maps directly to the route architecture and changes infrequently. Hardcoding avoids a CMS dependency for the layout and keeps the Navbar self-contained. If the site adds many more sections, this can be revisited.

### Decision 4: Mobile menu as a state-driven sidebar
**Choice:** Use a simple `useState` toggle for the mobile menu with a slide-in panel, similar to the existing (unused) `Header.tsx` pattern but with improved styling.
**Alternative:** Use the Radix Dialog component for the mobile menu.
**Rationale:** A mobile nav doesn't need the full dialog/portal/focus-trap semantics. A simple sidebar with a backdrop overlay and `translate-x` animation is sufficient and avoids adding complexity. The existing `Header.tsx` already demonstrates this pattern.

### Decision 5: Remove unused `Header.tsx`
**Choice:** Delete `src/components/Header.tsx` entirely.
**Alternative:** Keep it as a reference or refactor it.
**Rationale:** The new Navbar completely replaces it. Keeping dead code adds confusion. Git history preserves the old component if needed.

## Risks / Trade-offs

- **[Event series page layout conflict]** The event series showcase pages (`/eventos/$seriesSlug`) have their own sticky header with scroll-based color transitions. The shared Navbar must not render on these pages to avoid conflicting headers. → Mitigation: Path-based opt-out in `__root.tsx` explicitly excludes `/eventos/$seriesSlug` routes while keeping the Navbar on `/eventos` (listing page).

- **[Navigation item drift]** If new routes are added but the nav array isn't updated, users won't see links to new sections. → Mitigation: This is a small, static list. Document it clearly. The nav items correspond directly to the route structure defined in the overall plan.
