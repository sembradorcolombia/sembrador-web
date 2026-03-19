## 1. Sanity Project Setup

- [x] 1.1 Create Sanity project using `pnpm create sanity@latest` in a sibling directory (e.g., `../sembrador-studio`)
- [x] 1.2 Configure CORS origins in Sanity project settings (localhost:3000, production domain)
- [x] 1.3 Define `blogPost` schema with all required and optional fields per spec
- [x] 1.4 Define `author` schema with all required and optional fields per spec
- [x] 1.5 Define `eventSeries` schema with all required and optional fields per spec
- [x] 1.6 Define `event` schema with `supabaseEventId` field and all other fields per spec
- [x] 1.7 Define `nextStep` schema with ordered action card fields per spec
- [x] 1.8 Define `givingOption` schema with type enum and QR code image per spec
- [x] 1.9 Define `siteSettings` singleton schema per spec
- [x] 1.10 Deploy Sanity Studio to Sanity hosting (`sanity deploy`)

## 2. Web App Dependencies & Configuration

- [x] 2.1 Install `@sanity/client` and `@sanity/image-url` via pnpm
- [x] 2.2 Add `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET` to `.env.example` and local `.env`
- [x] 2.3 Create `src/lib/sanity.ts` with Sanity client instance (CDN enabled) and image URL builder
- [x] 2.4 Update `CLAUDE.md` to document new environment variables and CMS architecture

## 3. TypeScript Types

- [x] 3.1 Create `src/lib/types/cms.ts` with interfaces for all CMS content types: `CmsBlogPost`, `CmsAuthor`, `CmsEventSeries`, `CmsEvent`, `CmsNextStep`, `CmsGivingOption`, `CmsSiteSettings`
- [x] 3.2 Include Sanity-specific types for image references and Portable Text blocks

## 4. CMS Service Layer

- [x] 4.1 Create `src/lib/services/cms.ts` with GROQ query for fetching all published blog posts (ordered by publishedAt desc)
- [x] 4.2 Add GROQ query for fetching a single blog post by slug (with full body, author, references)
- [x] 4.3 Add GROQ query for fetching blog posts filtered by category
- [x] 4.4 Add GROQ query for fetching all event series
- [x] 4.5 Add GROQ query for fetching a single event series by slug (with associated events)
- [x] 4.6 Add GROQ query for fetching events by series slug (with speaker details and supabaseEventId)
- [x] 4.7 Add GROQ query for fetching all next step documents (ordered by order field)
- [x] 4.8 Add GROQ query for fetching all giving option documents (ordered by order field)
- [x] 4.9 Add GROQ query for fetching the site settings singleton

## 5. TanStack Query Hooks

- [x] 5.1 Create `src/lib/hooks/useBlog.ts` with `useBlogPosts`, `useBlogPost(slug)`, and `useBlogPostsByCategory(category)` hooks (5-minute stale time)
- [x] 5.2 Create `src/lib/hooks/useCmsEvents.ts` with `useCmsEventSeries`, `useCmsEventSeriesBySlug(slug)`, and `useCmsEventsBySeries(seriesSlug)` hooks (5-minute stale time)
- [x] 5.3 Create `src/lib/hooks/useNextSteps.ts` with `useNextSteps` hook (5-minute stale time)
- [x] 5.4 Create `src/lib/hooks/useGiving.ts` with `useGivingOptions` hook (5-minute stale time)
- [x] 5.5 Create `src/lib/hooks/useSiteSettings.ts` with `useSiteSettings` hook (30-minute stale time)

## 6. Content Seeding

- [x] 6.1 Create author documents in Sanity for existing speakers (John Gallahorn, Cathy Gallahorn)
- [x] 6.2 Create "Equilibrio" event series document in Sanity
- [x] 6.3 Create event documents for existing events (paz-financiera, emociones-y-liderazgo) with supabaseEventId values matching current UUIDs
- [x] 6.4 Create initial site settings document with El Sembrador church info

## 7. Verification & Cleanup

- [x] 7.1 Run `pnpm build` to verify TypeScript compilation passes with new files
- [x] 7.2 Run `pnpm check` to verify Biome lint/format compliance
- [x] 7.3 Run `pnpm test` to verify existing tests still pass
- [x] 7.4 Verify Sanity client can connect and fetch seeded content (manual test or temporary script)
