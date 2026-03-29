## 1. Setup

- [x] 1.1 Create `src/components/home/` directory

## 2. Hero Section

- [x] 2.1 Create `src/components/home/HeroSection.tsx` consuming `useSiteSettings` for church name, tagline, and hero image
- [x] 2.2 Add fallback content ("El Sembrador", generic welcome) when CMS data is unavailable
- [x] 2.3 Add a primary CTA button (e.g., linking to `/eventos` or `/acerca`)
- [x] 2.4 Style hero with full-width background image, overlay, and centered text using site theme colors

## 3. Preview Components

- [x] 3.1 Create `src/components/home/BlogPreview.tsx` displaying up to 3 recent blog posts as cards with title, excerpt, date, featured image, and a "Ver todos" link to `/blog`
- [x] 3.2 Create `src/components/home/EventsPreview.tsx` displaying upcoming events from active series with name, date, and a "Ver eventos" link to `/eventos`
- [x] 3.3 Create `src/components/home/NextStepsPreview.tsx` displaying up to 4 next step cards with title and description, and a "Ver más" link to `/siguientes-pasos`
- [x] 3.4 Create `src/components/home/GivePreview.tsx` with a giving message and CTA button linking to `/dar`
- [x] 3.5 Create `src/components/home/AboutPreview.tsx` displaying church description from `useSiteSettings` with a "Conocer más" link to `/acerca`
- [x] 3.6 Implement empty state handling: hide sections when CMS data is not available

## 4. Route Integration

- [x] 4.1 Rewrite `src/routes/index.tsx` to render the homepage with HeroSection and all preview sections stacked vertically
- [x] 4.2 Add loading skeleton or placeholder layout while CMS data loads
- [x] 4.3 Ensure responsive layout — single column on mobile, multi-column card grids on desktop

## 5. Verification

- [x] 5.1 Run `pnpm build` to verify TypeScript compilation passes
- [x] 5.2 Run `pnpm check` to verify Biome lint/format compliance
- [x] 5.3 Run `pnpm test` to verify existing tests still pass
- [x] 5.4 Manually verify homepage renders correctly with and without CMS data
