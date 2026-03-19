## Context

The CMS schemas for `siteSettings`, `nextStep`, and `givingOption` are defined in the `setup-sanity-cms` change. The corresponding GROQ queries and TanStack Query hooks (`useSiteSettings`, `useNextSteps`, `useGivingOptions`) are ready. These three pages are simple CMS-consuming routes with minimal interactivity — they fetch data and render it.

## Goals / Non-Goals

**Goals:**
- Build three content-driven pages that display CMS data
- Create reusable card components (`StepCard`, `GivingOptionCard`) following existing UI conventions
- Handle empty CMS states gracefully
- Responsive layouts for all pages

**Non-Goals:**
- Interactive features on these pages (donations, forms, etc.)
- Google Maps embed on the about page (can be added later)
- Dynamic icon loading from CMS (use Lucide icon names as strings mapped to components)
- Multi-language support

## Decisions

### Decision 1: Simple route components with CMS hooks
**Choice:** Each page is a single route file that calls its CMS hook and renders the content. No complex state management or interactivity.
**Alternative:** Use route loaders to prefetch CMS data.
**Rationale:** Follows the existing pattern where components own their data fetching. TanStack Query handles caching, loading, and error states. Route loaders would add complexity for pages that don't require prefetching.

### Decision 2: Component directories by domain
**Choice:** `src/components/next-steps/StepCard.tsx` and `src/components/give/GivingOptionCard.tsx` in their own domain directories.
**Alternative:** Put them in `src/components/ui/` or directly in route files.
**Rationale:** Follows the existing domain-directory convention. These components are specific to their sections, not generic UI primitives. They could also be reused in the homepage preview sections.

### Decision 3: Lucide icon mapping for next step cards
**Choice:** The CMS `nextStep.icon` field stores a Lucide icon name string (e.g., "heart", "users", "book-open"). The `StepCard` component maps this string to the corresponding `lucide-react` component using a lookup object.
**Alternative:** Store icon SVGs in the CMS, or use a generic icon component.
**Rationale:** Lucide icons are already in the project. A string-to-component mapping is simple, type-safe, and avoids storing SVGs in the CMS. The lookup includes a fallback icon for unknown strings.

### Decision 4: About page uses `siteSettings` only
**Choice:** The about page reads all its content from the existing `siteSettings` CMS document (`aboutDescription`, `aboutLocation`, `aboutServiceTimes`).
**Alternative:** Create a dedicated `aboutPage` CMS document type.
**Rationale:** The about page is minimal (brief description, location, service times). A separate CMS type would be overkill. If the about page grows to include team bios or history sections, a dedicated type can be added later.

## Risks / Trade-offs

- **[Icon mapping maintenance]** If new Lucide icons are needed for next step cards, the mapping object in `StepCard.tsx` must be updated. → Mitigation: The mapping can include all commonly used Lucide icons upfront (20-30 icons). Unknown icons fall back to a default.

- **[Minimal about page]** The about page is intentionally simple. If stakeholders expect a rich experience with team bios, history, and media, the current design won't meet expectations. → Mitigation: Scoped as "minimal about" per user requirements. Can be expanded in a future change.
