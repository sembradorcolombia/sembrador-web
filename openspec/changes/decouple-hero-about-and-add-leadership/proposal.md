## Why

`siteSettings` has become a dumping ground. It holds the church identity (name, tagline, contact, social links) *and* the homepage banner image *and* the About page copy, all in one singleton. Three consequences:

- **The hero and the About content are coupled.** `heroImage` and `aboutDescription` live in the same document, so there is no way to change the homepage banner without editing the same record that holds the About page text. The hero heading is not editable at all — `HeroSection` renders `churchName` and `tagline`, which are identity fields borrowed for display.
- **The banner is not reusable.** `/acerca` has its own hardcoded banner markup with a literal "Acerca" heading and `settings.tagline` as its subtitle. Every new page repeats the pattern by hand.
- **The About page cannot say what the church believes.** There is one flat `aboutDescription` text field. Vision, mission, core values, core beliefs, and downloadable documents like the confession of faith have nowhere to live.

Separately, `author.role` is a single free-text string. A pastor who also speaks at events and writes posts gets one label, and there is no way to identify who belongs on a leadership page.

## What Changes

- **New `hero` document type**, keyed per page (`home`, `acerca`, `blog`, `eventos`, `conectar`, `dar`). Fields: `heading` and `backgroundImage` (both required), `leadText` and a `cta { text, link }` (both optional).
- **New shared `Hero` component** on the frontend, rendering any hero by key, replacing `HeroSection`'s banner and the hardcoded headers on `/acerca`, `/blog`, `/eventos`, `/conectar`, and `/dar`. The homepage keeps the tall banner; the other pages use a compact variant.
- **New `aboutPage` singleton document**: rich `description`, `vision`, `mission`, repeatable `coreValues[]` and `coreBeliefs[]` (each `{ title, description }`), and a `documents[]` array of downloadable PDFs such as the confession of faith.
- **`/acerca` renders the new About content**, including the beliefs sections and a download list for the attached documents.
- **Author roles become multi-valued.** `author.role` (single string) is replaced by `roles[]` with defined options — speaker, pastor, leader, publisher. When `roles` includes `leader`, a conditional `leadershipTitle` field appears, plus a `leadershipOrder` for display sequence. **BREAKING** for the `author` schema shape and the `CmsAuthor` type.
- **New leadership section** on `/acerca`, listing authors that carry the `leader` role, ordered by `leadershipOrder`, showing image, name, leadership title, and bio.
- **Content migration** of `heroImage` → `hero(home)` and `aboutDescription` / `aboutLocation` / `aboutServiceTimes` → `aboutPage`, and `author.role` → `author.roles[]`. The old `siteSettings` fields are removed only after the new content is verified in production.
- **Studio navigation** gains the new singletons and document types in a sensible order.

## Capabilities

### New Capabilities

- `hero-content-type`: The CMS `hero` document, its per-page keying, required/optional field rules, and the shared frontend component that renders it with fallbacks.
- `about-page-content`: The `aboutPage` singleton — description, vision, mission, core values, core beliefs — and its rendering at `/acerca`.
- `about-page-documents`: Downloadable PDF documents attached to the About page (confession of faith and similar), including how they are listed and accessed.
- `leadership-section`: The leadership listing on `/acerca` — which authors appear, their ordering, and what is displayed.
- `author-roles`: Multi-valued author roles, the available options, and the conditional leadership title.

### Modified Capabilities

- `about-page`: The About page currently specifies content sourced from `siteSettings` (`aboutDescription`, `aboutLocation`, `aboutServiceTimes`). Those requirements change to source content from the new `aboutPage` document and to include the hero, beliefs, documents, and leadership sections.
- `hero-section`: The homepage hero currently specifies heading and image derived from `siteSettings` (`churchName`, `tagline`, `heroImage`). Those requirements change to source them from the `hero` document keyed `home`.
- `cms-content-schemas`: Adds the `hero` and `aboutPage` document types and changes the `author` type's role field; removes the migrated `siteSettings` fields.
- `cms-content-delivery`: Adds GROQ queries and hooks for heroes, the About page, and leadership authors; changes the author projection to select `roles` instead of `role`.

## Impact

- **Two repositories, two PRs.** Schema and Studio changes live in `sembrador-studio` (`schemaTypes/`, `sanity.config.ts`); the frontend lives in this repo. The project convention of one change per PR does not hold here — see design.md for the required ordering between them.
- **Routes:** `/`, `/acerca`, `/blog`, `/eventos`, `/conectar`, and `/dar`. No new routes, no redirects, no URL changes.
- **New code (this repo):** `src/components/ui/Hero.tsx` (or `components/hero/`), `src/components/about/` (beliefs, documents, leadership), `useHero`, `useAboutPage`, `useLeadership` hooks, GROQ queries in `src/lib/services/cms.ts`, new types in `src/lib/types/cms.ts`.
- **Modified code (this repo):** `HeroSection.tsx` and `AboutPreview.tsx` (both read the fields being moved), `routes/acerca.tsx` (hardcoded banner + About sections), `CmsAuthor` type and any consumer of `author.role`.
- **New code (studio repo):** `schemaTypes/hero.ts`, `schemaTypes/aboutPage.ts`, changes to `author.ts` and `siteSettings.ts`, structure entries in `sanity.config.ts`.
- **Content migration:** required, and the site shows fallback content for any field not migrated. Sanity content is shared across environments — a schema field removed in the Studio does not delete the stored data, but a field removed *before* migration leaves the data unreachable through the Studio UI.
- **Dependencies:** none new — `@sanity/client`, `@sanity/image-url`, and `@portabletext/react` are already in use.
- **Bundle size:** negligible; the new components ship on the `/` and `/acerca` chunks, which are already code-split.
