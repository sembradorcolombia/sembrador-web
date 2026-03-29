## 1. Setup

- [x] 1.1 Create `src/components/layout/` directory
- [x] 1.2 Delete unused `src/components/Header.tsx`

## 2. Navbar Component

- [x] 2.1 Create `src/components/layout/Navbar.tsx` with church logo, desktop navigation links (Inicio, Blog, Acerca, Eventos, Siguientes Pasos, Dar), and active link highlighting using TanStack Router `Link` with `activeProps`
- [x] 2.2 Add responsive mobile hamburger menu with slide-in sidebar panel (hidden on md+ screens, visible on smaller screens)
- [x] 2.3 Ensure mobile menu closes on link navigation
- [x] 2.4 Add semantic `<nav>` element with `aria-label="Navegación principal"`
- [x] 2.5 Style Navbar using site theme colors, Montserrat font, and Tailwind utilities

## 3. Footer Component

- [x] 3.1 Create `src/components/layout/Footer.tsx` with church name, copyright with dynamic year, quick navigation links, and social media icon links (Instagram, YouTube, etc.)
- [x] 3.2 Social media links open in new tab with `target="_blank"` and `rel="noopener noreferrer"`
- [x] 3.3 Use semantic `<footer>` element
- [x] 3.4 Style Footer using site theme colors and Tailwind utilities

## 4. Root Layout Integration

- [x] 4.1 Update `src/routes/__root.tsx` to import and render Navbar and Footer wrapping `<Outlet />`
- [x] 4.2 Implement route path matching logic to opt out of Navbar/Footer on `/dashboard`, `/login`, and event series showcase routes (`/eventos/$seriesSlug` children)
- [x] 4.3 Verify the data policy page (`/politica-de-datos`) renders with the shared layout

## 5. Verification

- [x] 5.1 Run `pnpm build` to verify TypeScript compilation passes
- [x] 5.2 Run `pnpm check` to verify Biome lint/format compliance
- [x] 5.3 Run `pnpm test` to verify existing tests still pass
- [x] 5.4 Manually verify Navbar and Footer render on public pages and do not render on dashboard/login
