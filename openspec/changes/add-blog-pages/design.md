## Context

The CMS blog post schema is defined in the `setup-sanity-cms` change with fields for title, slug, category (sermon/news), Portable Text body, author reference, scripture references, and audio/video URLs. The CMS service layer provides GROQ queries and TanStack Query hooks (`useBlogPosts`, `useBlogPost(slug)`, `useBlogPostsByCategory`) are ready for consumption. No blog UI exists yet.

## Goals / Non-Goals

**Goals:**
- Build a complete blog experience with listing and detail pages
- Render Sanity Portable Text with custom serializers for church content
- Support category filtering with URL-persisted state
- Provide SEO meta tags for each blog post
- Ensure readable typography and responsive layout

**Non-Goals:**
- Blog post comments or reactions
- RSS feed generation
- Pagination (use "load more" or show all for MVP; pagination can be added later)
- Blog post search functionality
- Related posts / recommended reading

## Decisions

### Decision 1: Category filter via URL search params
**Choice:** Use TanStack Router's `validateSearch` to define a `categoria` search param on the `/blog` route. The `CategoryFilter` component reads and writes this param.
**Alternative:** Use React state for filtering.
**Rationale:** URL-based filtering makes filtered views shareable and bookmarkable. It follows the same pattern used in the current Equilibrio page with `?evento=` search param. TanStack Router provides type-safe search param handling.

### Decision 2: `@portabletext/react` with custom components map
**Choice:** Use `@portabletext/react`'s `<PortableText>` component with a custom `components` map for rendering headings, images, links, and church-specific blocks.
**Alternative:** Build a custom Portable Text renderer.
**Rationale:** `@portabletext/react` is the official Sanity library for rendering Portable Text in React. It handles the complex block-to-React mapping and supports custom component overrides. Building custom would be reinventing the wheel.

### Decision 3: Custom serializers for church content
**Choice:** Define custom Portable Text components for:
- **Images**: Use `@sanity/image-url` builder for responsive `<img>` with `srcset`
- **Links**: External links open in new tab, internal links use TanStack Router `<Link>`
- **Headings**: Apply Tailwind typography classes consistent with site design
- **Block quotes**: Style as callout boxes with church theme colors

**Alternative:** Use `@tailwindcss/typography` prose classes for generic styling.
**Rationale:** Prose classes provide a good baseline but church-specific content (scripture callouts, speaker quotes) benefits from custom styling that matches the site's visual identity.

### Decision 4: Blog components in `src/components/blog/`
**Choice:** `BlogCard.tsx`, `BlogContent.tsx`, `CategoryFilter.tsx` in `src/components/blog/`.
**Alternative:** Place components directly in route files.
**Rationale:** Follows the established domain-directory pattern (`dashboard/`, `events/`, `forms/`). `BlogCard` is reused in both the listing page and the homepage `BlogPreview` component.

### Decision 5: Audio/video rendering approach
**Choice:** For `audioUrl`, render a native `<audio>` element with controls. For `videoUrl`, detect YouTube/Vimeo URLs and render responsive `<iframe>` embeds; for other URLs, render a native `<video>` element.
**Alternative:** Use a third-party video player library.
**Rationale:** Native HTML5 audio/video elements are sufficient for simple playback. YouTube/Vimeo iframe embeds are standard and require no additional dependencies. Keeping it simple avoids bundle bloat.

## Risks / Trade-offs

- **[No pagination for MVP]** If the blog grows to 100+ posts, showing all on the listing page could cause performance issues. → Mitigation: For a church blog, growth will be gradual. TanStack Query caching mitigates repeat load times. Pagination can be added later as a non-breaking enhancement.

- **[Portable Text rendering complexity]** Custom content blocks in the CMS that don't have matching serializers will render as empty. → Mitigation: Define serializers for all standard blocks plus an `unknownType` fallback that logs a warning and renders nothing.

- **[Image optimization]** Sanity image URLs support transformations but the app doesn't have a built-in image optimization pipeline. → Mitigation: Use `@sanity/image-url` to request appropriate sizes and formats (WebP when supported). This is handled at the URL builder level, not the component level.
