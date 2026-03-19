## Context

The Footer component (`src/components/layout/Footer.tsx`) currently hardcodes all its display data: the church description, social media URLs, and copyright text. The site already uses Sanity CMS via the `siteSettings` singleton for global content (church name, tagline, about info, social links). The `socialLinks` field already exists in the schema but is not consumed by the Footer.

The existing data flow pattern is: `Sanity schema → cms.ts service (GROQ query) → CmsSiteSettings type → useSiteSettings hook → component`. This change extends that chain to include the Footer.

## Goals / Non-Goals

**Goals:**
- Extend the `siteSettings` Sanity schema with footer-specific fields: `footerTagline`, `address`, `contactPhone`, `contactEmail`
- Expand the `CmsSiteSettings` TypeScript type to include the new fields
- Update the GROQ query in `cms.ts` to fetch the new fields
- Refactor `Footer.tsx` to consume CMS data via `useSiteSettings`, falling back gracefully while loading
- Wire up `socialLinks` (already in schema and type) to the Footer's social section

**Non-Goals:**
- Changing the visual design or layout of the Footer
- Making navigation links CMS-managed (these are tied to routes and are safe as code)
- Adding a footer logo or complex rich text to the footer
- Building a custom Sanity Studio UI for the footer section

## Decisions

### Decision 1: Extend `siteSettings` rather than create a new `footerSettings` document type

**Chosen:** Add footer fields directly to the existing `siteSettings` singleton.

**Rationale:** The footer contains global church identity info (address, contact, social) — the same category as `churchName` and `tagline`. Creating a separate document adds unnecessary CMS complexity and requires editors to manage two singletons. The `siteSettings` singleton is already queried on every page load via `useSiteSettings`, so no additional network request is needed.

**Alternative considered:** A dedicated `footerSettings` singleton — rejected because it fragments related global config and doubles the number of singleton documents editors must manage.

### Decision 2: Reuse `useSiteSettings` hook as-is; no new hook needed

**Chosen:** The `Footer` component calls `useSiteSettings()` directly. The hook already caches with a 30-minute stale time via TanStack Query, so multiple components using it incur no extra fetches.

**Alternative considered:** Creating a `useFooter` hook — rejected as unnecessary indirection when the data source is the same singleton.

### Decision 3: Graceful loading with hardcoded fallbacks

**Chosen:** While `useSiteSettings` is loading or on error, the Footer renders with static fallback strings (current hardcoded values). This avoids layout shift on initial load since `siteSettings` is typically cached after the first page view.

**Alternative considered:** Show a skeleton loader — rejected as overkill for footer content that rarely changes.

### Decision 4: Social links icon mapping in the frontend

**Chosen:** The `socialLinks` array in Sanity stores a `platform` string (e.g., `"instagram"`, `"youtube"`). The Footer component maintains a small mapping object from platform name to Lucide icon component.

**Rationale:** Sanity cannot store React components. Keeping the mapping in the frontend keeps the CMS schema simple and avoids storing icon SVG strings in the CMS.

**Alternative considered:** Store icon SVG data in Sanity — rejected as overly complex and a security concern (raw SVG injection).

## Risks / Trade-offs

- **[Risk] Content editor leaves footer fields empty** → The Footer falls back to the current hardcoded strings, maintaining the current user experience with no visual regression.
- **[Risk] `socialLinks` platform string doesn't match known icons** → Unknown platforms render no icon; a warning can be logged in development. Add `facebook` and `tiktok` to the mapping proactively.
- **[Risk] Additional fields bloat the `siteSettings` GROQ query** → The added fields are scalar strings; the performance impact is negligible.

## Migration Plan

1. Update Sanity schema (deployed via Sanity CLI or Studio push) — additive only, no data migration required
2. Update TypeScript types and GROQ query in the web app
3. Refactor `Footer.tsx` to use `useSiteSettings`
4. Content editors populate the new fields in Sanity Studio
5. No rollback complexity — if CMS fields are empty, fallbacks ensure the footer still renders correctly

## Open Questions

- Should `footerTagline` replace or supplement the current "Iglesia El Sembrador Colombia" description text? (Assumed: replace, with that string as the fallback)
- Should `address` be a single string or structured (street, city, country)? (Assumed: single string for simplicity — can be structured in a future iteration)
