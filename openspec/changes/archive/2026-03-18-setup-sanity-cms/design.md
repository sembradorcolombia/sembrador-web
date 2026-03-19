## Context

The El Sembrador web app currently uses Supabase as its sole backend — handling auth, event registrations, and subscriptions. Event display content (speakers, images, dates) is hardcoded in `src/lib/constants/eventDetails.ts` as a static TypeScript map. As the site expands into a full church website with blog, events, about, next steps, and giving sections, we need a content management layer that non-developers can operate.

The existing data-fetching pattern follows: **service functions** (`src/lib/services/`) → **TanStack Query hooks** (`src/lib/hooks/`) → **React components**. The CMS integration will follow this same pattern.

## Goals / Non-Goals

**Goals:**
- Establish Sanity CMS as the content layer for the church website
- Create a reusable service/hook layer for fetching CMS content
- Define all content schemas needed by subsequent PRs (blog, events, pages)
- Enable non-developers to manage content via Sanity Studio
- Maintain the existing Supabase data flow for registrations/auth (CMS is additive, not a replacement)

**Non-Goals:**
- Building any UI components or routes that consume CMS data (done in subsequent PRs)
- Replacing Supabase for event registration, auth, or any transactional data
- Real-time content preview or draft mode (can be added later)
- Content localization/i18n (site is Spanish-only)
- Building the Sanity Studio UI beyond initializing the project with schemas

## Decisions

### Decision 1: Sanity CMS over alternatives
**Choice:** Sanity  
**Alternatives considered:**
- **Strapi** — Self-hosted, requires managing infrastructure. Overkill for a church site with limited dev resources.
- **Contentful** — Good but the free tier (25K records) is more restrictive. Pricing scales poorly.
- **Directus** — Could sit on Supabase Postgres, but adds complexity to the existing database and mixes content management with transactional data.

**Rationale:** Sanity's free tier (100K API CDN requests/mo, 500K total API requests/mo, 10GB bandwidth) is generous for a church site. The hosted Studio means zero infrastructure to manage. TypeScript-first client and GROQ query language provide excellent DX. Separate project keeps concerns clean.

### Decision 2: Separate Sanity project (not embedded)
**Choice:** Sanity Studio lives in its own repository/folder, deployed to Sanity's hosting.  
**Alternative:** Embed Studio as a route in the SPA (e.g., `/studio`).  
**Rationale:** Embedding adds ~1MB+ to the bundle and couples content management tooling with the public site. Separate deployment allows independent Studio updates and keeps the web app lean. The Studio URL can be bookmarked by content editors.

### Decision 3: CDN API for all reads
**Choice:** Use `useCdn: true` on the Sanity client for all public-facing reads.  
**Alternative:** Direct API (no CDN caching).  
**Rationale:** Content changes infrequently (blog posts, event info). CDN responses are cached and fast. This also keeps API usage well within free tier limits. If real-time preview is needed later, a separate client instance with `useCdn: false` can be created.

### Decision 4: GROQ queries in a centralized service file
**Choice:** All GROQ queries live in `src/lib/services/cms.ts`, one function per content type.  
**Alternative:** Colocate queries with the hooks or components that use them.  
**Rationale:** Follows the existing pattern where `src/lib/services/events.ts` and `src/lib/services/dashboard.ts` centralize Supabase queries. Keeps queries testable and avoids scattering GROQ strings across the codebase.

### Decision 5: TanStack Query hooks with 5-minute stale time for CMS data
**Choice:** 5-minute `staleTime` for CMS content queries.  
**Alternative:** Use the global 1-minute stale time already configured in `QueryClient`.  
**Rationale:** CMS content changes far less frequently than registration data. A 5-minute stale time reduces unnecessary refetches while still picking up content changes within a reasonable window. Site settings could use an even longer stale time (e.g., 30 minutes) since they change rarely.

### Decision 6: TypeScript types manually defined (not auto-generated)
**Choice:** Manually define TypeScript interfaces in `src/lib/types/cms.ts` matching Sanity schemas.  
**Alternative:** Use `sanity-typegen` to auto-generate types from schemas.  
**Rationale:** Since the Sanity project is a separate repo, auto-generation would require a cross-project build step. Manual types are simpler for a small number of schemas (8 types). If schemas grow significantly, `sanity-typegen` can be adopted later.

### Decision 7: Link CMS events to Supabase via `supabaseEventId`
**Choice:** Each Sanity `event` document has a `supabaseEventId` string field containing the Supabase `events.id` UUID.  
**Alternative:** Use event slugs for matching, or store CMS document IDs in Supabase.  
**Rationale:** The Supabase `events.id` is the stable, existing primary key for all registration logic. Storing it in Sanity makes the CMS the "aware" party — content editors can link an event to its registration record. The web app merges data from both sources client-side, similar to the current `useEventsWithDetails` pattern that merges Supabase data with `EVENT_DETAILS_MAP`.

## Risks / Trade-offs

- **[Third-party dependency]** Sanity is a hosted service. If it experiences downtime, content won't load. → Mitigation: TanStack Query caching means previously loaded content remains available during outages. Critical transactional features (registration, auth) remain on Supabase and are unaffected.

- **[Manual type maintenance]** TypeScript types could drift from Sanity schemas since they're manually maintained. → Mitigation: Types are simple interfaces with few fields. Integration tests or a CI validation step can be added later. Consider `sanity-typegen` if schema count grows beyond ~15.

- **[Content seeding]** Initial content must be manually entered in Sanity Studio or via the Sanity CLI import tool. The existing `EVENT_DETAILS_MAP` data needs manual migration. → Mitigation: Only 2 events and their speakers need migration. This is a one-time task during the PR.

- **[Environment variable management]** Two new env vars (`VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`) are required. → Mitigation: Add to `.env.example`, document in `CLAUDE.md`, fail gracefully if missing.

## Open Questions

- Should we set up Sanity webhooks to invalidate TanStack Query cache on content publish? (Not needed for MVP, but could improve content freshness.)
- Should the Sanity Studio repo be in the same GitHub organization or a separate one?
