## Context

The homepage Conectar preview (`src/components/home/ConnectPreview.tsx`) renders `step.icon` directly as text inside a `<span role="img">`. This worked when `connectStep` icons in Sanity were emojis, but the CMS now stores Lucide icon names in kebab-case (`hand-heart`, `users`, `life-buoy`), so the raw string is displayed to visitors.

The `/conectar` page (`src/components/connect/ConnectCard.tsx`) already solves this correctly with a local `ICON_MAP` (kebab-case name → `LucideIcon` component) and a `resolveIcon()` helper with a `HelpCircle` fallback. However, that map lives inside `ConnectCard.tsx`, is not reusable, and is missing `life-buoy` — a name current CMS content uses.

Separately, both homepage preview sections (`ConnectPreview` and `EventsPreview`) hardcode their grid column counts. Because the card counts come from the CMS and currently sit below those maximums — 3 connect steps against 4 columns, 1 active event series against 3 — each section renders with visibly empty columns.

## Goals / Non-Goals

**Goals:**
- Homepage Conectar preview cards render the CMS icon as a Lucide component, never the raw icon name string.
- Single shared source of truth for icon-name resolution used by both `ConnectPreview` and `ConnectCard`.
- Cover all icon names currently stored in the CMS (including `life-buoy`) and degrade gracefully for unknown names.
- Homepage preview grids size themselves to the number of CMS items instead of a hardcoded column count, so no empty column is left in the row.

**Non-Goals:**
- No Sanity schema changes (the `connectStep.icon` string field stays as-is).
- No visual redesign of the individual card contents or the `/conectar` page. (Card *styling* is aligned to `ConnectCard` per Decision 3, and the previews' *grid sizing* changes per Decision 4, but the card anatomy and `/conectar` itself are untouched.)
- No dynamic/lazy loading of the full Lucide catalog — keep the explicit allowlist map.

## Decisions

### 1. Extract the icon map into a shared module `src/lib/icons.ts`

Move `ICON_MAP`, `DEFAULT_ICON`, and `resolveIcon()` out of `ConnectCard.tsx` into `src/lib/icons.ts` and import them from both components.

- **Why:** Two renderers consume the same CMS field; a shared module prevents drift (this bug exists precisely because the preview never got the mapping logic).
- **Alternatives considered:**
  - *Duplicate the map in `ConnectPreview`* — rejected: guaranteed future drift.
  - *Reuse `ConnectCard` in the preview* — rejected: the preview has a different card layout, CTA semantics, and its own grid; coupling them would be a larger intrusion.

### 2. Add `life-buoy` to the map, keep `HelpCircle` fallback

Add `"life-buoy": LifeBuoy` (exported by `lucide-react`). `resolveIcon(name)` keeps lowercasing the input and returning `HelpCircle` for missing/unknown names, so bad CMS data can never leak raw text to the page again.

- **Why:** `life-buoy` is live CMS content (visible in the bug screenshot). The fallback guarantees the fix is robust against any future editor input, not just today's values.

### 3. Replace the `<span role="img">{step.icon}</span>` block in `ConnectPreview` and match the `/conectar` card look

Render the resolved icon via a small `StepIcon` helper (fallback included, so the block always renders). Style the preview cards to match `ConnectCard` on `/conectar`: green circular icon badge (`h-12 w-12 rounded-full bg-green-100 text-green-700`, icon size 24), `font-grotesk-compact-black text-xl` title, `text-sm leading-relaxed` description, green CTA (`text-green-700 hover:text-green-900`), `border border-gray-100`, and `flex flex-col` + `flex-1` description so CTAs align at the bottom. The skeleton's icon placeholder updates to `h-12 w-12 rounded-full` to match.

- **Why:** One recognizable card design for connect steps across the site; reusing `ConnectCard`'s exact tokens avoids inventing a second visual language. The preview keeps its own card markup (different CTA semantics and grid sizing), only the styling is aligned.

### 4. Size the preview grids from the item count via a shared `src/lib/grid.ts`

Both homepage previews hardcoded their column counts (`sm:grid-cols-2 lg:grid-cols-4` for Conectar, `sm:grid-cols-2 lg:grid-cols-3` for Eventos), so a section with fewer items than columns left a visibly empty slot — the CMS currently returns 3 connect steps and 1 active event series. `previewGridClass(count, maxColumns)` returns the column classes for `count` items, clamped into `[1, maxColumns]`:

| Items | Layout |
|---|---|
| 1 | single column, `max-w-sm`, left-aligned with the section heading |
| 2 | two columns, `max-w-3xl`, horizontally centered |
| 3 | up to 3 columns, full container width |
| 4 | up to 4 columns, full container width |

- **Why:** The empty-column artifact is the same defect in both sections, and the card counts are CMS-driven, so neither can be fixed by picking a better fixed number. A single helper keeps the two previews from drifting — the same reasoning as Decision 1 for the icon map.
- **Class strings are written out in full**, never composed from fragments, because Tailwind's scanner only sees literal class names in source.
- **1 item is left-aligned, not centered** — a lone card centered under a left-aligned heading reads as a layout bug; aligning it to the heading's left edge keeps the section's vertical rhythm.
- **Alternatives considered:**
  - *`auto-fit`/`minmax` CSS grid* — rejected: it makes column width, not column count, the thing you control, giving less predictable card sizes across the two sections' different maximums.
  - *`justify-center` on a fixed grid* — rejected: centers the tracks but still sizes cards against the full-width column template, so a single card stretches.

## Risks / Trade-offs

- [CMS editors add an icon name not in the map] → Renders the `HelpCircle` fallback instead of text; acceptable degradation, and the fix prevents raw strings from ever showing. Mitigation: keep the map close to the CMS field documentation.
- [Legacy emoji values in old CMS documents] → They resolve to the fallback icon rather than rendering as emoji. Current production content uses Lucide names exclusively, and behavior becomes consistent with `/conectar`.
- [Bundle size] → Only one new icon import (`LifeBuoy`); `lucide-react` is tree-shaken, impact is negligible.
- [A future preview section needs a column maximum other than 3 or 4] → `previewGridClass`'s `maxColumns` is typed `3 | 4`, so the call fails to compile until a matching `GRID_BY_COUNT` entry is added. Deliberate: it surfaces the missing literal class string at build time rather than silently rendering an undefined class.
- [Loading skeletons guess the item count] → Each preview renders a fixed `SKELETON_COUNT` (3) because the real count is unknown until the query resolves, so a section that resolves to a different count shifts layout slightly on load. Accepted: 3 matches current CMS content for Conectar and the shift is a one-time settle.
