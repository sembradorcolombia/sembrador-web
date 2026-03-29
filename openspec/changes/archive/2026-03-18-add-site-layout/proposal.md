## Why

The current site has no shared navigation or footer. The root `/` is a standalone splash page and each route renders independently with no consistent layout shell. As we add new sections (blog, events, about, next steps, give), users need a persistent navigation bar to move between them and a footer with church information. The existing `Header.tsx` component is an unused placeholder with minimal styling that doesn't match the site's visual identity.

## What Changes

- Create a new `Navbar` component with church logo, navigation links for all main sections (Inicio, Blog, Acerca, Eventos, Siguientes Pasos, Dar), active link highlighting, and a responsive mobile hamburger menu
- Create a new `Footer` component with church name, social media links, quick navigation links, and copyright
- Update `__root.tsx` to wrap all public routes with the Navbar and Footer layout shell
- Implement route-specific layout control so certain routes (dashboard, login, event series showcase pages) can opt out of the shared layout
- Remove the unused `src/components/Header.tsx` component

## Capabilities

### New Capabilities
- `site-navigation`: Persistent site-wide navigation bar and footer providing consistent navigation and church information across all public pages

### Modified Capabilities

## Impact

- **Modified files**: `src/routes/__root.tsx` (add layout wrapper with conditional rendering)
- **Deleted files**: `src/components/Header.tsx` (replaced by new Navbar)
- **New files**: `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`
- **No new dependencies** — uses existing Tailwind CSS, lucide-react icons, and TanStack Router `Link` component
- **All existing routes continue to work** — the layout is additive
- **No existing route paths change**
- **Bundle size**: Negligible — Navbar and Footer are small components included in the main bundle since they render on every page
