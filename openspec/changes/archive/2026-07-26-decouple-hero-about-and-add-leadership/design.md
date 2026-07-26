## Context

Two repositories are involved and they are not the same repo:

- `sembrador-studio` — its own git repo, holding `schemaTypes/*.ts` and `sanity.config.ts`. Schema and Studio structure.
- `sembrador-web` — this repo. Queries, types, hooks, components, routes.

They share one thing that neither owns: the **Sanity dataset** (`ogqd4wag` / `production`). Content is live data, not a per-branch artifact. A schema change deployed to the Studio takes effect for editors immediately, and a GROQ query shipped to production reads whatever is in the dataset at that moment. That single shared mutable dependency is what makes the ordering in the Migration Plan matter more than the code itself.

Current coupling:

- `siteSettings` holds `heroImage`, `aboutDescription`, `aboutLocation`, `aboutServiceTimes` alongside identity and contact fields.
- `HeroSection` builds the homepage banner from `churchName` + `tagline` + `heroImage` — identity fields used as display copy, so the heading is not independently editable.
- `routes/acerca.tsx` hardcodes its own banner (literal "Acerca" heading, `settings.tagline` as subtitle) with markup unrelated to `HeroSection`.
- `AboutPreview` on the homepage also reads `aboutDescription` / `aboutLocation` / `aboutServiceTimes` — a third consumer of the fields being moved, easy to miss.
- `author.role` is a free-text string, selected in two GROQ projections (`cms.ts:22` and `cms.ts:34`).

## Goals / Non-Goals

**Goals:**

- Make the homepage banner editable independently of church identity and About copy.
- Make banners reusable across pages through one component and one content type.
- Give the About page structured room for beliefs content and downloadable documents.
- Let one author hold several roles, and identify who belongs on a leadership listing.
- Migrate existing content without losing it and without a visibly broken production site.

**Non-Goals:**

- No general page-builder or block-content system. `hero` is a banner, not a section framework.
- No page-specific banner markup anywhere: every top-level page (`home`, `acerca`, `blog`, `eventos`, `conectar`, `dar`) renders its banner through the shared component. Detail routes (a blog post, an event series) keep their own layouts and are out of scope.
- No visual redesign of the homepage or About page beyond what the new content requires.
- No changes to blog, events, connect, or giving content types, beyond the author projection fix they are forced into.
- No localization of the new types. Spanish content, matching the rest of the CMS.

## Decisions

### `hero` is a document keyed by page, not an object embedded in page documents

A standalone `hero` document carries `key` (a constrained option list: `home`, `acerca`, …), `heading`, `backgroundImage`, `leadText`, `cta`.

*Why not embed it in page documents:* there are no page documents. `/` and `/acerca` are code routes with no CMS counterpart, so embedding would require inventing a `page` type first — a much larger content model change than the one being asked for.

*Why a key rather than a slug matched to the route:* an option list is validated at edit time. An editor cannot create a hero for a page that does not exist, and the frontend's `heroKey` values are checkable against the same list. A free-text slug would silently produce orphan heroes.

*Two banner heights, one component:* the homepage keeps the tall `min-h-[70vh]` banner; every other page renders a `min-h-[40vh]` compact variant, replacing the `bg-secondary` header bands those pages hardcoded. The height is a layout decision belonging to the page, not content an editor sets, so it is a component prop rather than a schema field.

*Uniqueness per key* is enforced with a Sanity validation rule that queries for another published document with the same key. This is a soft constraint — Sanity has no unique index — so the frontend query takes `[0]` and treats a duplicate as "first one wins" rather than erroring.

### The shared `Hero` component owns the banner; the homepage layers its own chrome on top

`Hero` renders heading, background, lead text, and CTA. The homepage's service schedule and location pills stay in `HeroSection`, composed *over* `Hero` rather than pushed into the `hero` document.

*Why:* the pills are homepage-specific and read from `siteSettings` (schedule, address, maps URL) — operational data that genuinely belongs in settings and would be wrong to duplicate per banner. Pushing them into `hero` would mean every future hero carries fields only one page uses.

*Consequence:* `Hero` needs a `children` slot or equivalent for the composed content, so `HeroSection` becomes `<Hero heroKey="home">{pills}</Hero>`. Keep the slot generic — it is a layout affordance, not a "homepage" prop.

### `aboutPage` uses named fields, not a flexible section array

Explicit `description`, `vision`, `mission`, `coreValues[]`, `coreBeliefs[]`.

*Why over a repeatable `{ title, body }` array:* the frontend styles vision differently from a values grid. With a flexible array the only way to know which is which is matching on the title string, which breaks the moment an editor renames "Visión" to "Nuestra visión". Named fields cost editor flexibility and buy the frontend the ability to lay each section out on purpose.

*Trade-off accepted:* adding a "Nuestra historia" section later requires a schema change rather than an editor action. That is the deliberate side of the trade.

`description` is rich text (Portable Text) rather than the current flat `text`, rendered with `@portabletext/react`, which is already a dependency.

**Values and beliefs use rich text too — reversed after seeing the real content.** The original decision was plain `description` strings, on the reasoning that they are short labels and Portable Text in a grid card is more machinery than the content warrants. The copy the church actually published disproved that: the beliefs are multi-item bulleted lists ("- La Iglesia: …", "- Bautismo: …"), which a plain string renders as one run-on paragraph. Rendering them as real `<ul><li>` is the point of the field, not a nicety.

The block type is deliberately constrained: `normal` style only, bullet and numbered lists, `strong`/`em`, and links. Headings are excluded because the card's `title` is already the heading, and an `h2` inside a grid card would fight it.

### PDF documents are a `file` array on `aboutPage`, with accept validation

`documents[]` of `{ title, description?, file }`, `file` constrained to `application/pdf` via the field's `accept` option plus a validation rule.

*Note on the `accept` option:* it filters the OS file picker but does not prevent a drag-and-drop or a determined upload, so the validation rule is what actually enforces it. Both are needed — one for the affordance, one for the constraint.

*Why on `aboutPage` rather than a standalone `document` type:* the only consumer is the About page. A standalone type would need its own listing and ordering UI for no gain. Revisit if documents ever need to appear elsewhere.

Files are served from Sanity's CDN. The GROQ projection must resolve `file.asset->url`, which is easy to forget and produces a broken link rather than a query error.

### `roles[]` replaces `role`, with conditional leadership fields

`roles` is an `array of string` with `options.list` of the three values — `speaker`, `leader`, `publisher` — and `options.layout: "grid"` (checkboxes), plus `validation: rule.unique()`.

*Why no `pastor` option:* it would be redundant with `leader`. Every pastor belongs on the leadership listing, and `leadershipTitle` already states the position precisely ("Pastor principal", "Pastor de jóvenes"). A separate role would encode the same fact twice and leave the two free to disagree.

`leadershipTitle` and `leadershipOrder` use Sanity's `hidden` callback keyed on `parent?.roles?.includes("leader")`.

*Important limitation:* `hidden` controls visibility, not validity. An author who was a leader, had a title set, then lost the `leader` role keeps the stored `leadershipTitle` in the dataset — invisible in the Studio but still returned by a query that selects it. The leadership GROQ query must therefore filter on `"leader" in roles` rather than on the presence of `leadershipTitle`. Same reasoning for the required-title rule: it must be conditional (`rule.custom`) so it only fires for leaders, otherwise non-leaders become unpublishable.

*Why not a separate `leader` document type:* a pastor who writes blog posts and speaks at events would become two documents with two images and two bios to keep in sync. The whole point of multi-role is that one person is one record.

### Author projections must be updated in lockstep with the schema

`cms.ts:22` and `cms.ts:34` select `role`. Once the schema drops that field, those projections return `undefined` — silently, since GROQ does not error on a missing field. `CmsAuthor.role` becomes `roles?: AuthorRole[]`, and TypeScript will surface the frontend consumers. Grep for `.role` before assuming the type check caught everything, since the field is optional.

### Three components read the fields being moved, not two

`HeroSection`, `routes/acerca.tsx`, **and `AboutPreview`** all read `aboutDescription` / `aboutLocation` / `aboutServiceTimes`. `AboutPreview` is the one that gets missed — it is a homepage component with an early return keyed on `aboutDescription`, so if it is not updated it silently stops rendering when the field is removed rather than failing loudly.

## Risks / Trade-offs

- **Removing `siteSettings` fields before content is migrated** → the values remain in the dataset but become unreachable through the Studio, and the site falls back to placeholder copy. This is why removal is a separate, final step gated on production verification, not part of the initial schema PR.
- **The two repos deploy independently and can land out of order** → a frontend querying `aboutPage` before the Studio defines it renders fallbacks (recoverable); a Studio that drops `siteSettings.heroImage` before the frontend stops reading it produces a broken banner (visible). Ship Studio-additive first, frontend second, Studio-removal last.
- **One change spanning two PRs breaks the project's one-change-one-PR convention** → the change cannot be verified or archived from a single merge. Track both PRs in this change directory and treat the change as incomplete until both land.
- **Content migration is manual against live production data** → a mistake edits real content with no undo beyond Sanity's document history. Prefer doing the migration through the Studio UI where an editor can see the result, or script it against a dataset copy first. Sanity retains document history, which is the actual rollback path — know how to use it before starting.
- **`AboutPreview` fails silently** → its early return means removing `aboutDescription` blanks a homepage section without any error. Explicitly verify the homepage after each phase, not just `/acerca`.
- **`hidden` on leadership fields is cosmetic** → stale `leadershipTitle` values persist for demoted leaders. Filter on `roles` in GROQ, never on title presence.
- **Duplicate hero keys are not truly prevented** → validation queries can race and only apply on publish. The frontend must tolerate duplicates by taking the first match rather than assuming uniqueness.
- **Portable Text for `description` changes the rendering path** → the current `whitespace-pre-line` plain-text rendering is replaced by `@portabletext/react`. Migrated plain text becomes a single block; line breaks that relied on `pre-line` will collapse and need re-entry as real paragraphs. Check the migrated description visually rather than assuming it carried over.
- **Growing the hero key list requires a Studio deploy** → adding a hero for a new page is not a pure content action. Acceptable at this scale; it is the cost of validating keys at edit time.

## Migration Plan

Ordered, with each phase verifiable before the next:

1. **Studio, additive** — add `hero` and `aboutPage`, change `author.role` → `roles[]` + leadership fields, register structure entries. Leave every `siteSettings` field in place. Deploy the Studio.
2. **Content migration** — create the `home` and `acerca` heroes (copying `heroImage`); populate `aboutPage` from `aboutDescription`; assign `roles[]` on every existing author from their old `role`, and set `leadershipTitle` / `leadershipOrder` for leaders. Report any author whose old role does not map to an option instead of dropping it.
3. **Frontend** — build `Hero`, the About sections, and the leadership section; point queries at the new types; update `HeroSection`, `AboutPreview`, `acerca.tsx`, and both author projections. Deploy.
4. **Verify in production** — homepage banner, homepage About preview, `/acerca` in full, blog and event author rendering. Both viewports.
5. **Studio, subtractive** — only now remove `heroImage`, `aboutDescription`, and the old `role` field from the schema. Deploy.

**Rollback:** phases 1–2 are additive and safe to leave in place. Phase 3 rolls back by reverting the frontend deploy, which resumes reading `siteSettings` — this only works while phase 5 has not run, which is the reason phase 5 waits for production verification rather than being bundled into the same PR.

## Open Questions

- **Should `aboutLocation` and `aboutServiceTimes` stay in `siteSettings`?** This change keeps them there — they are operational contact data also used by `HeroSection`'s pills and the footer, so they are not About-specific. Worth confirming that matches the intent, since the request grouped them under "about us content".
- **What Spanish label should the leadership section use?** The spec suggests "Nuestro liderazgo"; confirm with whoever owns the site copy.
- **Does any hero need a video or gradient background?** The type is image-only. Cheap to answer now, a schema migration to answer later.
