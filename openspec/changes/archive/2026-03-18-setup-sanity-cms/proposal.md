## Why

The current application hardcodes event display content (speakers, images, dates, descriptions) in a static TypeScript constant (`EVENT_DETAILS_MAP`). Blog posts, site settings, and other content don't exist yet. As we expand from a single event landing page into a full church website with blog, events, about, next steps, and giving sections, we need a content management system so non-developers can create and update content without code changes or deployments. Sanity CMS provides a generous free tier, excellent React/TypeScript integration, and a hosted Studio for content editors.

## What Changes

- Create a new Sanity project (separate repository) with content schemas for all site content types
- Install Sanity client libraries in the web app (`@sanity/client`, `@sanity/image-url`)
- Add new environment variables for Sanity project configuration
- Create a Sanity client instance and image URL builder utility in the web app
- Create a CMS service layer with GROQ queries for fetching all content types
- Create TanStack Query hooks for each CMS content type
- Define TypeScript types for all CMS content models
- Seed initial Sanity content by migrating existing `EVENT_DETAILS_MAP` data

## Capabilities

### New Capabilities
- `cms-content-delivery`: Fetching and caching content from Sanity CMS via GROQ queries — covers blog posts, event series, individual events, authors/speakers, next step cards, giving options, and site-wide settings
- `cms-content-schemas`: Sanity schema definitions for all content types — the data model contract between the CMS Studio and the web app

### Modified Capabilities

## Impact

- **New dependencies**: `@sanity/client`, `@sanity/image-url` added to the web app
- **New environment variables**: `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET` required for all environments
- **New files**: `src/lib/sanity.ts` (client), `src/lib/services/cms.ts` (queries), `src/lib/hooks/useCms.ts` (hooks), `src/lib/types/cms.ts` (types)
- **No existing routes or components are modified** — this change only adds the CMS foundation layer. Consuming components will be built in subsequent changes.
- **Bundle size**: `@sanity/client` (~15KB gzipped) is the main addition. Since CMS hooks will only be imported by routes that need them, TanStack Router's auto code-splitting keeps the initial bundle unaffected.
- **Separate Sanity project**: The Studio and schemas live in their own repo/folder, deployed independently to Sanity's hosting. The web app only depends on the read-only client.
