## Why

The church needs a blog for publishing sermon summaries and news articles. The CMS content model for blog posts (with categories, authors, Portable Text body, scripture references, and audio/video embeds) was defined in the `setup-sanity-cms` change. The service layer and TanStack Query hooks for fetching blog data are already in place. This change builds the UI pages that display the content.

## What Changes

- Install `@portabletext/react` for rendering Sanity Portable Text rich content
- Create `/blog` listing page with a card grid layout and category filtering (Todos / Sermones / Noticias)
- Create `/blog/$slug` detail page with Portable Text rendering, author info, scripture references, and audio/video embeds
- Create `BlogCard` component for the listing grid (featured image, title, excerpt, date, category badge)
- Create `BlogContent` component wrapping `@portabletext/react` with custom serializers for church-specific content blocks
- Create `CategoryFilter` component for filtering by sermon or news category
- Add SEO meta tags per blog post via `react-helmet-async`

## Capabilities

### New Capabilities
- `blog-listing`: Blog listing page with card grid layout, category filtering, and responsive design
- `blog-detail`: Individual blog post page with Portable Text rendering, author attribution, media embeds, and SEO meta tags

### Modified Capabilities

## Impact

- **New dependency**: `@portabletext/react` (~5KB gzipped)
- **New files**: `src/routes/blog/index.tsx`, `src/routes/blog/$slug.tsx`, `src/components/blog/BlogCard.tsx`, `src/components/blog/BlogContent.tsx`, `src/components/blog/CategoryFilter.tsx`
- **No existing files modified** — this change is entirely additive
- **Depends on**: `setup-sanity-cms` (CMS hooks for blog data), `add-site-layout` (Navbar/Footer)
- **Bundle size**: `@portabletext/react` is small. Blog routes are auto-code-split by TanStack Router, so the library only loads when visiting `/blog/*`
