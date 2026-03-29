## Why

The current `/` route is a "Próximamente" splash page with only the El Sembrador logo and a link to the Equilibrio event. With the site expanding into a full church website, the homepage needs to serve as the main entry point — showcasing the church identity with a hero section and providing preview cards that link visitors to each major section (blog, events, about, next steps, give).

## What Changes

- Replace the current `src/routes/index.tsx` splash page with a full homepage
- Create `HeroSection` component displaying church name, tagline, hero image from CMS `siteSettings`, and a primary call-to-action button
- Create `BlogPreview` component showing the 3 most recent published blog posts as cards
- Create `EventsPreview` component showing upcoming events from active event series
- Create `NextStepsPreview` component showing up to 4 action card previews
- Create `GivePreview` component with a giving call-to-action
- Create `AboutPreview` component with a brief church description snippet

## Capabilities

### New Capabilities
- `homepage`: Main church landing page with hero section and preview cards linking to blog, events, about, next steps, and giving sections

### Modified Capabilities

## Impact

- **Modified files**: `src/routes/index.tsx` (complete rewrite — old splash page replaced)
- **New files**: `src/components/home/HeroSection.tsx`, `src/components/home/BlogPreview.tsx`, `src/components/home/EventsPreview.tsx`, `src/components/home/NextStepsPreview.tsx`, `src/components/home/GivePreview.tsx`, `src/components/home/AboutPreview.tsx`
- **No new dependencies** — uses existing CMS hooks from `setup-sanity-cms`, TanStack Router `Link`, Tailwind CSS
- **Depends on**: `setup-sanity-cms` (CMS hooks for content), `add-site-layout` (Navbar/Footer wrapping)
- **Bundle size**: Homepage components are loaded eagerly since `/` is the entry route, but each preview component is small. CMS data is fetched client-side via TanStack Query.
