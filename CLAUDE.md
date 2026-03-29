# CLAUDE.md

## Project Overview

El Sembrador Colombia web application — a React 19 SPA for a church website with event management, blog, and admin dashboard, built with TypeScript, Vite, and TanStack Router. Backend powered by Supabase (auth + Postgres) and Sanity CMS (content).

## Tech Stack

- **Framework:** React 19 + TypeScript 5.7 (strict mode)
- **Build tool:** Vite 7
- **Routing:** TanStack Router (file-based routing with auto code-splitting)
- **Data fetching:** TanStack Query
- **Forms:** TanStack Form + Zod 4 (via @tanstack/zod-form-adapter)
- **Backend:** Supabase (auth + database + RPC) + Sanity CMS (headless, content management)
- **CMS:** Sanity (separate project — `@sanity/client` + `@sanity/image-url`)
- **Styling:** Tailwind CSS 4
- **UI primitives:** Radix UI (dialog, slot) + CVA + tailwind-merge
- **Icons:** lucide-react
- **Toasts:** sonner
- **SEO:** react-helmet-async
- **Testing:** Vitest + @testing-library/react (unit), Playwright (E2E)
- **Linting/Formatting:** Biome
- **Package manager:** pnpm
- **Analytics:** Google Analytics (GA4) + Meta Pixel

## Commands

```bash
pnpm dev           # Start dev server on port 3000
pnpm build         # Production build (includes tsc type-check)
pnpm preview       # Preview production build
pnpm test          # Run unit tests (Vitest, single run)
pnpm test:watch    # Run unit tests in watch mode
pnpm test:e2e      # Run E2E tests (Playwright)
pnpm test:e2e:ui   # Run E2E tests with Playwright UI
pnpm lint          # Lint with Biome
pnpm format        # Format with Biome
pnpm check         # Full Biome check (lint + format)
```

## Project Structure

```
src/
├── assets/            # Custom fonts (Right Grotesk) and images
├── components/
│   ├── blog/          # BlogCard, BlogContent (Portable Text), CategoryFilter
│   ├── dashboard/     # EventCard, SubscribersTable, SubscriberSearch
│   ├── events/        # EventShowcaseSection, SubscriptionModal
│   ├── forms/         # SubscriptionForm
│   ├── give/          # GivingOptionCard
│   ├── home/          # HeroSection, AboutPreview, EventsPreview, BlogPreview, NextStepsPreview, GivePreview
│   ├── next-steps/    # StepCard
│   ├── ui/            # Base components (alert, button, dialog, input, label, select)
│   └── SeoHead.tsx    # Reusable SEO/Open Graph head component (wraps react-helmet-async)
├── lib/
│   ├── constants/     # Static event metadata
│   ├── hooks/         # useAuth, useCreateSubscription, useDashboardData, useEvents, useScrollSpy, useBlog, useCmsEvents, useNextSteps, useGiving, useSiteSettings
│   ├── services/      # Supabase service layer (auth, dashboard, events) + CMS service layer (cms.ts)
│   ├── types/         # TypeScript definitions (event.ts, cms.ts)
│   ├── validations/   # Zod schemas (email validation, subscription)
│   ├── database.types.ts  # Auto-generated Supabase types — DO NOT edit
│   ├── supabase.ts    # Supabase client instance
│   ├── sanity.ts      # Sanity CMS client instance + image URL builder
│   ├── csv.ts         # CSV export utility
│   └── utils.ts       # cn() class merging utility
├── routes/            # File-based routes (TanStack Router)
├── test/              # Test setup (Vitest + testing-library)
├── main.tsx           # Entry point (router, QueryClient, auth context, GA4 + Meta Pixel tracking)
├── styles.css         # Tailwind + custom theme (colors, fonts)
└── routeTree.gen.ts   # Auto-generated — DO NOT edit
```

## Routes

| Path | File | Auth |
|------|------|------|
| `/` | `index.tsx` | Public |
| `/acerca` | `acerca.tsx` | Public |
| `/blog` | `blog/index.tsx` | Public |
| `/blog/$slug` | `blog/$slug.tsx` | Public |
| `/eventos` | `eventos/index.tsx` | Public |
| `/eventos/$seriesSlug` | `eventos/$seriesSlug/index.tsx` | Public |
| `/eventos/$seriesSlug/conexion` | `eventos/$seriesSlug/conexion.tsx` | Public |
| `/eventos/$seriesSlug/registro-exitoso` | `eventos/$seriesSlug/registro-exitoso.tsx` | Public |
| `/siguientes-pasos` | `siguientes-pasos.tsx` | Public |
| `/dar` | `dar.tsx` | Public |
| `/login` | `login.tsx` | Public (redirects if admin) |
| `/dashboard` | `dashboard.tsx` | Admin only (`beforeLoad` redirect) |
| `/politica-de-datos` | `politica-de-datos.tsx` | Public |

## Environment Variables

All prefixed with `VITE_` for client-side access:

```
VITE_SUPABASE_URL         # Supabase project URL
VITE_SUPABASE_ANON_KEY    # Supabase publishable anon key
VITE_GA_MEASUREMENT_ID    # Google Analytics 4 measurement ID
VITE_META_PIXEL_ID        # Meta (Facebook) Pixel ID
VITE_SANITY_PROJECT_ID    # Sanity CMS project ID
VITE_SANITY_DATASET       # Sanity CMS dataset (typically "production")
```

## Backend (Supabase)

- **Auth:** Supabase Auth with `app_metadata.is_admin` for role-based access
- **Tables:** `events`, `event_subscriptions` (FK: event_subscriptions.event_id → events.id)
- **RPC:** `create_subscription_with_increment` — handles capacity checks and duplicate prevention
- **Services:** `src/lib/services/` contains `auth.ts`, `events.ts`, `dashboard.ts`

## CMS (Sanity)

- **Client:** `src/lib/sanity.ts` — exports `sanityClient` and `sanityImageUrl` builder
- **Service:** `src/lib/services/cms.ts` — GROQ query functions for all content types
- **Hooks:** `useSiteSettings`, `useBlog` (posts + by slug + by category), `useCmsEvents` (series), `useNextSteps`, `useGivingOptions`
- **Types:** `src/lib/types/cms.ts` — `CmsBlogPost`, `CmsBlogPostSummary`, `CmsEventSeries`, `CmsEvent`, `CmsNextStep`, `CmsGivingOption`, `CmsSiteSettings`
- **Content types in Sanity:** `blogPost`, `eventSeries`, `event`, `nextStep`, `givingOption`, `siteSettings`
- **Image rendering:** Use `sanityImageUrl(source).width(N).height(N).fit("crop").url()` — extract to named helper functions to avoid Biome lint issues with chained `.fit()` calls

## Key Conventions

- **Path alias:** `@/*` maps to `./src/*`
- **Route files** in `src/routes/` are auto-detected; the route tree is generated automatically (`routeTree.gen.ts`)
- **Biome** handles both linting and formatting — uses tab indentation, double quotes
- **Biome excludes:** `src/routeTree.gen.ts` and `src/styles.css`
- **TypeScript** strict mode is enabled; unused variables and parameters are errors
- **Tailwind CSS** utility classes are used for all styling
- **Pre-commit hooks:** Husky runs lint-staged (Biome check with auto-fix) + unit tests
- **CI:** GitHub Actions runs E2E tests on PRs to main
