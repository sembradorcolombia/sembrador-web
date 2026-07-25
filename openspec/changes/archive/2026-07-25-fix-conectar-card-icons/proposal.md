## Why

The homepage "Conectar" preview cards render the CMS `icon` field as raw text (e.g., "hand-heart", "users", "life-buoy") instead of a visual icon. The `ConnectPreview` component was written when connect step icons were emojis, but the Sanity `connectStep` documents now store Lucide icon names in kebab-case — so visitors see the literal icon name printed on each card, which looks broken.

## What Changes

- Update `ConnectPreview` (homepage Conectar section) to resolve the CMS `icon` string to a Lucide icon component instead of rendering the raw string.
- Extract the existing `ICON_MAP` / `resolveIcon` logic from `ConnectCard` into a shared module so both the homepage preview and the `/conectar` page resolve icons identically.
- Add the missing `life-buoy` entry (used by current CMS content) to the icon map, with a sensible fallback icon for unknown names.
- Replace the fixed column counts in the homepage `ConnectPreview` and `EventsPreview` grids with a shared content-adaptive helper, so a section with fewer cards than columns no longer leaves an empty column in the row.

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `homepage`: The "Next steps preview section" requirement now specifies that each Conectar preview card SHALL render the connect step's CMS icon as a resolved visual icon (Lucide), never the raw icon name string, and that the card grid SHALL adapt its column count to the number of cards.
- `homepage`: The "Events preview section" requirement now specifies that the series card grid SHALL adapt its column count to the number of active series.

## Impact

- **Code:** `src/components/home/ConnectPreview.tsx` (icon rendering + adaptive grid), `src/components/connect/ConnectCard.tsx` (import shared map), `src/components/home/EventsPreview.tsx` (adaptive grid), new shared modules `src/lib/icons.ts` and `src/lib/grid.ts`.
- **Dependencies:** None new — `lucide-react` is already a dependency.
- **Bundle:** Negligible; `lucide-react` icons are tree-shaken and already imported by `ConnectCard` (same route-level chunks).
- **CMS:** No schema changes; relies on the existing `connectStep.icon` string field.
