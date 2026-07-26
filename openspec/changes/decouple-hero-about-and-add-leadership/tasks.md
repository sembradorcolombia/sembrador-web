## 1. Studio schema — additive (repo: sembrador-studio)

- [x] 1.1 Create `schemaTypes/hero.ts`: `key` (string, `options.list` of `home` / `acerca`, required), `heading` (string, required), `backgroundImage` (image, hotspot, with `alt` field, required), `leadText` (text, optional), `cta` (object `{ text, link }`, optional)
- [x] 1.2 Add a `rule.custom` validation on `cta` rejecting a partially filled CTA (text without link or link without text), while allowing both empty
- [x] 1.3 Add a `rule.custom` validation on `key` querying for another published hero with the same key, blocking duplicates
- [x] 1.4 Add a `preview` to `hero` showing the heading as title and the page key as subtitle
- [x] 1.5 Create `schemaTypes/aboutPage.ts`: `description` (Portable Text array), `vision` (text), `mission` (text), `coreValues[]` and `coreBeliefs[]` (arrays of `{ title (required), description }`), each with a preview
- [x] 1.6 Add `documents[]` to `aboutPage`: array of `{ title (required), description (optional), file (required) }` with the file field constrained to PDF via both `options.accept` and a validation rule
- [x] 1.7 Change `schemaTypes/author.ts`: replace `role` (string) with `roles` (array of string, `options.list` of speaker/pastor/leader/publisher, `options.layout: "grid"`, `rule.unique()`) — keep the old `role` field in place for now so migration can read it
- [x] 1.8 Add `leadershipTitle` (string) and `leadershipOrder` (number) to `author`, both with a `hidden` callback keyed on `parent?.roles?.includes("leader")`
- [x] 1.9 Add a conditional `rule.custom` requiring `leadershipTitle` only when `roles` includes `leader`, so non-leaders remain publishable
- [x] 1.10 Update the `author` preview to show name as title and roles as subtitle
- [x] 1.11 Register `hero` and `aboutPage` in `schemaTypes/index.ts`
- [x] 1.12 Add Studio structure entries in `sanity.config.ts`: `aboutPage` as a singleton alongside `siteSettings`, `hero` as a regular list; exclude `aboutPage` from the `documentTypeListItems()` filter as `siteSettings` already is
- [ ] 1.13 Run the Studio locally and confirm every validation rule fires as intended (required fields, partial CTA, duplicate key, conditional leadership title)
- [ ] 1.14 Deploy the Studio — this is phase 1 of the migration plan; `siteSettings` is untouched at this point

## 2. Content migration (Sanity dataset)

- [ ] 2.1 Confirm the rollback path before touching production content: verify Sanity document history is available and that you know how to restore a document from it
- [ ] 2.2 Create the `home` hero, copying `siteSettings.heroImage` into `backgroundImage` and setting a heading (previously the borrowed `churchName`)
- [ ] 2.3 Create the `acerca` hero with heading "Acerca" and a background image, replacing the hardcoded banner's content
- [ ] 2.4 Create the `aboutPage` document, moving `siteSettings.aboutDescription` into `description` — re-enter paragraph breaks as real Portable Text blocks, since the old `whitespace-pre-line` line breaks will not survive as-is
- [ ] 2.5 Populate `vision`, `mission`, `coreValues`, and `coreBeliefs` with the content the church wants to publish (needs source copy from the content owner)
- [ ] 2.6 Upload the confession of faith and any other PDFs into `aboutPage.documents`
- [ ] 2.7 Assign `roles[]` on every existing author from their stored `role` value; report any value that does not map to a defined option for manual assignment rather than dropping it
- [ ] 2.8 Set `leadershipTitle` and `leadershipOrder` for each author carrying the `leader` role
- [ ] 2.9 Verify in the Studio that no author lost their designation and that the leadership set is who it should be
- [ ] 2.10 Create the `blog`, `eventos`, `conectar`, and `dar` heroes; until each exists the page keeps rendering its previous heading and subtitle as the fallback

## 3. Frontend types and data layer (repo: sembrador-web)

- [x] 3.1 Add `CmsHero`, `CmsAboutPage`, `CmsAboutDocument`, `CmsCoreItem`, and `AuthorRole` types to `src/lib/types/cms.ts`
- [x] 3.2 Change `CmsAuthor.role?: string` to `roles?: AuthorRole[]` and add optional `leadershipTitle` / `leadershipOrder`; add a `CmsLeader` type for the leadership projection
- [x] 3.3 Remove `heroImage` and `aboutDescription` from `CmsSiteSettings`
- [x] 3.4 Add `fetchHeroByKey(key)` to `src/lib/services/cms.ts`, projecting heading, background image, lead text, and CTA, taking `[0]` so a duplicate key cannot error
- [x] 3.5 Add `fetchAboutPage()`, resolving `documents[].file.asset->url` — a missing dereference yields a broken link, not a query error
- [x] 3.6 Add `fetchLeadership()` filtering on `"leader" in roles` (NOT on the presence of `leadershipTitle`, which persists for demoted leaders), ordered by `leadershipOrder` ascending then `name`
- [x] 3.7 Update the two existing author projections (`cms.ts:22` and `cms.ts:34`) to select `roles` instead of `role`
- [x] 3.8 Remove `heroImage` and `aboutDescription` from the `siteSettings` projection
- [x] 3.9 Create `useHero`, `useAboutPage`, and `useLeadership` hooks with dedicated query keys, matching the existing CMS hook pattern

## 4. Hero component

- [x] 4.1 Create the shared `Hero` component: renders heading (as `h1` when it is the page banner), background image via `sanityImageUrl`, optional lead text, optional CTA — following the project's component conventions and extracting the image URL builder to a named helper to avoid the Biome chained-`.fit()` issue
- [x] 4.2 Accept a `children` slot for page-specific chrome composed over the banner; keep it generic rather than homepage-specific
- [x] 4.3 Render the CTA as a router `Link` for internal paths and an `<a target="_blank" rel="noopener noreferrer">` for external URLs
- [x] 4.4 Add the loading skeleton matching the hero layout, and fallback heading + background image for when no hero document exists or the fetch fails
- [x] 4.5 Ensure the overlay treatment keeps text legible over light or busy images, and that the layout holds below 640px
- [x] 4.6 Rewrite `HeroSection` as `<Hero heroKey="home">` with the existing service schedule/location pills passed as children, still sourced from `siteSettings`; keep the "Conocer más" → `/acerca` fallback for when the hero defines no CTA

- [x] 4.7 Extend the hero key list to every top-level page — `blog`, `eventos`, `conectar`, `dar` — in both the Studio `options.list` and the frontend `HeroKey` type
- [x] 4.8 Add a `variant` prop to `Hero` (`full` for the homepage, `compact` for every other page) so the shared banner can replace the shorter `bg-secondary` header bands

## 5. About page

- [x] 5.1 Replace the hardcoded banner in `routes/acerca.tsx` with `<Hero heroKey="acerca" />`
- [x] 5.2 Render `description` with `@portabletext/react` instead of the current `whitespace-pre-line` plain text
- [x] 5.3 Create the beliefs sections (vision, mission, core values grid, core beliefs) as components under `src/components/about/`, omitting any section whose content is absent — no empty headings or stray dividers
- [x] 5.4 Create the documents section: Spanish "Documentos" heading, each entry linking to its file URL with `target="_blank" rel="noopener noreferrer"` and a visual cue that it is a downloadable file; omit the section when empty
- [x] 5.5 Create the leadership section: image with alt text falling back to the leader's name, name, leadership title, optional bio; omit the section when there are no leaders
- [x] 5.6 Give the leadership section its own loading and error handling so a failure there does not break the rest of `/acerca`
- [x] 5.7 Compose the sections in the specified order: hero, description, vision/mission, core values, core beliefs, documents, leadership, location and service times
- [x] 5.8 Keep location and service times reading from `siteSettings` (see the open question in design.md about whether they belong here)

- [x] 5.9 Replace the hardcoded headers on `/blog`, `/eventos`, `/conectar`, and `/dar` with `<Hero>`, passing each page's current heading and subtitle as fallbacks; restructure `/eventos` so its banner renders in the loading, error, and empty states too

## 6. Update remaining consumers

- [x] 6.1 Update `AboutPreview.tsx` to read from `aboutPage` — note its early return is keyed on `aboutDescription`, so leaving it unchanged silently blanks a homepage section instead of failing loudly
- [x] 6.2 Grep for `\.role\b` and `heroImage` across `src/` and update every remaining consumer; the optional-field types mean TypeScript will not catch all of them
- [x] 6.3 Update any test fixtures or mocks carrying `author.role`, `heroImage`, or `aboutDescription`

## 7. Testing

- [x] 7.1 Test `Hero`: renders CMS content; omits lead text and CTA cleanly when absent; internal vs external CTA link behavior; loading skeleton; fallback when no hero exists
- [x] 7.2 Test that `HeroSection` renders the service pills over the hero and falls back to "Conocer más" when the hero defines no CTA
- [x] 7.3 Test the About sections: full content renders; absent sections are omitted; Portable Text formatting is preserved; fallback text when `aboutPage` is empty
- [x] 7.4 Test the documents section: entries render with titles and links; description shown when present; section omitted when empty
- [x] 7.5 Test the leadership section: only `leader`-role authors appear; ordering with and without `leadershipOrder`; bio omitted cleanly; section omitted when there are no leaders; image alt falls back to the name
- [x] 7.6 Run `pnpm test` and confirm existing home, about, and blog tests still pass

- [x] 7.7 Test the `Hero` variants: compact by default, full on request

## 8. Verification

- [x] 8.1 Run `pnpm check` (Biome lint + format) and fix any findings
- [x] 8.2 Run `pnpm build` and confirm the TypeScript type-check passes
- [x] 8.3 Run `pnpm test:e2e`
- [ ] 8.4 Manually verify the homepage (banner, service pills, About preview), `/acerca` in full, and the banners on `/blog`, `/eventos`, `/conectar`, and `/dar`, on mobile and desktop viewports
- [ ] 8.5 Verify blog post and event pages still render their authors correctly after the `role` → `roles` projection change
- [ ] 8.6 Deploy the frontend — phase 3 of the migration plan
- [ ] 8.7 Verify all of the above again against production content before proceeding to the removal phase

## 9. Studio schema — subtractive (repo: sembrador-studio)

- [ ] 9.1 Only after production verification passes: remove `heroImage` and `aboutDescription` from `siteSettings.ts`
- [ ] 9.2 Remove the old `role` field from `author.ts`
- [ ] 9.3 Deploy the Studio and confirm editors see the new structure with no orphaned fields
- [ ] 9.4 Record both PR links (studio and web) in this change directory, since this change spans two repositories and cannot be verified from a single merge
