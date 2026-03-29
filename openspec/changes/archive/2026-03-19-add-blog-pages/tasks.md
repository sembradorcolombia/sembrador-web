## 1. Dependencies

- [x] 1.1 Install `@portabletext/react` via pnpm

## 2. Components

- [x] 2.1 Create `src/components/blog/` directory
- [x] 2.2 Create `src/components/blog/BlogCard.tsx` — card component with featured image (via Sanity image URL builder), title, excerpt, published date, and category badge ("Sermón" / "Noticia")
- [x] 2.3 Create `src/components/blog/CategoryFilter.tsx` — filter tabs or buttons for "Todos", "Sermones", "Noticias" that read/write the `categoria` URL search param
- [x] 2.4 Create `src/components/blog/BlogContent.tsx` — Portable Text renderer with custom components map for headings, paragraphs, images, links, block quotes, and lists styled with Tailwind
- [x] 2.5 Add custom Portable Text serializer for inline/block images using `@sanity/image-url` with responsive sizing
- [x] 2.6 Add audio player rendering for posts with `audioUrl` (native `<audio>` element with controls)
- [x] 2.7 Add video embed rendering for posts with `videoUrl` (YouTube/Vimeo iframe detection, fallback to native `<video>`)
- [x] 2.8 Add scripture references display component (callout/sidebar for sermon posts)

## 3. Routes

- [x] 3.1 Create `src/routes/blog/index.tsx` — blog listing page with `CategoryFilter`, `BlogCard` grid, empty state message, page title "Blog — El Sembrador"
- [x] 3.2 Add `validateSearch` for `categoria` search param with Zod schema (optional string, one of "sermon" | "news")
- [x] 3.3 Create `src/routes/blog/$slug.tsx` — blog post detail page with `BlogContent`, author info, scripture references, audio/video embeds, not-found handling
- [x] 3.4 Add responsive layout — single column on mobile, constrained reading width on desktop with `max-w-prose` or similar

## 4. SEO

- [x] 4.1 Add `<Helmet>` meta tags to blog listing page (title, description)
- [x] 4.2 Add `<Helmet>` meta tags to blog detail page (title, description from excerpt, Open Graph og:title, og:description, og:image, og:type="article")

## 5. Verification

- [x] 5.1 Run `pnpm build` to verify TypeScript compilation passes
- [x] 5.2 Run `pnpm check` to verify Biome lint/format compliance
- [x] 5.3 Run `pnpm test` to verify existing tests still pass
- [x] 5.4 Manually verify blog listing renders with category filtering
- [x] 5.5 Manually verify blog post detail renders Portable Text content correctly
