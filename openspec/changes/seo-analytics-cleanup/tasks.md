## 1. SeoHead Component

- [x] 1.1 Create `src/components/SeoHead.tsx` — reusable component wrapping `<Helmet>` with props: `title?`, `description?`, `image?`, `type?` (default "website"). Applies title format "{title} — El Sembrador", default description, and Open Graph tags (og:title, og:description, og:image, og:url, og:type).
- [x] 1.2 Add default fallback values: site description, default OG image (static asset or CMS site settings hero image)

## 2. Apply SeoHead Across All Pages

- [x] 2.1 Replace or add `<SeoHead>` in `src/routes/index.tsx` (homepage) with title "El Sembrador — Iglesia en Medellín"
- [x] 2.2 Replace or add `<SeoHead>` in `src/routes/blog/index.tsx` with title "Blog"
- [x] 2.3 Replace or add `<SeoHead>` in `src/routes/blog/$slug.tsx` with dynamic title, excerpt as description, featured image as OG image, type "article"
- [x] 2.4 Replace or add `<SeoHead>` in `src/routes/acerca.tsx` with title "Acerca"
- [x] 2.5 Replace or add `<SeoHead>` in `src/routes/eventos/index.tsx` with title "Eventos"
- [x] 2.6 Replace or add `<SeoHead>` in `src/routes/eventos/$seriesSlug/index.tsx` with dynamic series name as title
- [x] 2.7 Replace or add `<SeoHead>` in `src/routes/siguientes-pasos.tsx` with title "Siguientes Pasos"
- [x] 2.8 Replace or add `<SeoHead>` in `src/routes/dar.tsx` with title "Dar"
- [x] 2.9 Ensure `src/routes/politica-de-datos.tsx` has `<SeoHead>` with title "Política de Datos"

## 3. Analytics Updates

- [x] 3.1 Update Meta Pixel scope in `src/main.tsx` `onResolved` handler: change `/equilibrio` check to `/eventos`
- [x] 3.2 Add GA4 custom event `blog_post_view` in `/blog/$slug` route (fire on page load with slug and category params)
- [x] 3.3 Add GA4 custom event `giving_page_view` in `/dar` route (fire on page load)

## 4. Documentation

- [x] 4.1 Update `CLAUDE.md` route table with all new routes (/blog, /blog/$slug, /acerca, /eventos, /eventos/$seriesSlug/*, /siguientes-pasos, /dar)
- [x] 4.2 Update `CLAUDE.md` project structure section with new directories (components/layout, components/home, components/events, components/blog, components/next-steps, components/give)
- [x] 4.3 Update `CLAUDE.md` with CMS architecture documentation (Sanity integration, new env vars, services/hooks)
- [x] 4.4 Update `CLAUDE.md` environment variables section with `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET`

## 5. Testing

- [x] 5.1 Write unit test for `SeoHead` component: verifies title format, default description, Open Graph tags, and prop overrides
- [x] 5.2 Write smoke tests for new route components (blog listing, blog detail, about, next steps, give, events listing)
- [x] 5.3 Update any existing tests that reference old `/equilibrio` paths to use `/eventos/equilibrio`

## 6. Final Cleanup

- [x] 6.1 Search codebase for any remaining hardcoded "equilibrio" references in generic code and remove/update them
- [x] 6.2 Run `pnpm build` to verify TypeScript compilation passes
- [x] 6.3 Run `pnpm check` to verify Biome lint/format compliance
- [x] 6.4 Run `pnpm test` to verify all tests pass
