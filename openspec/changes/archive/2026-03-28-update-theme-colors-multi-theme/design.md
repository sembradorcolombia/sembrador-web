## Context

`src/styles.css` currently defines four CSS custom properties in `@theme` with placeholder colors (`#FF2D77` primary, `#CC245F` primary-dark, `#1D13BD` secondary, `#100A66` secondary-dark). These are used throughout the codebase via Tailwind utilities (`bg-primary`, `text-secondary`, etc.).

The Equilibrio event series has a distinct visual identity (pink + purple) that should be preserved for its routes while the rest of the site adopts the official El Sembrador brand palette (blues, greens, oranges).

## Goals / Non-Goals

**Goals:**
- Replace the default `@theme` tokens with the El Sembrador brand palette.
- Scope the Equilibrio palette to `/eventos/equilibrio/**` via a CSS attribute selector without touching any other route.
- Keep the theming mechanism entirely in CSS — no JS theme context or React state.

**Non-Goals:**
- Dark mode support.
- Theming for other event series beyond Equilibrio.
- Changing the token names (`--color-primary`, `--color-secondary`) — only their values change.

## Decisions

### 1. CSS attribute selector for scoped theming (`data-theme="equilibrio"`)

**Decision:** A `[data-theme="equilibrio"]` ruleset in `styles.css` overrides `--color-primary` and `--color-secondary`. The Equilibrio layout route wraps its outlet in `<div data-theme="equilibrio">`.

**Alternatives considered:**
- *React context + inline styles*: More flexible but adds JS overhead and breaks Tailwind's static class extraction.
- *Separate CSS file imported only on Equilibrio routes*: Possible with dynamic imports, but complicates the build and adds async flash risk.
- *CSS class (`.theme-equilibrio`)*: Equivalent to attribute selector; attribute chosen because it's semantically a theme identifier, not a style modifier.

**Why attribute selector wins:** Zero JS, works with Tailwind 4's `@theme` inheritance, co-located with the rest of the theme in one file, and naturally scopes to the DOM subtree.

### 2. Token naming: keep existing names, change values

**Decision:** The existing token names (`--color-primary`, `--color-primary-dark`, `--color-secondary`, `--color-secondary-dark`) are reused. Default values switch to the El Sembrador brand; the Equilibrio override block restores the old values.

**Why:** All components already use these names via Tailwind utilities. No component code changes needed — only `styles.css` changes.

### 3. El Sembrador default palette mapping

| Token | Value | Brand color |
|---|---|---|
| `--color-primary` | `#26466d` | Brand dark blue |
| `--color-primary-dark` | `#1b4974` | Logo title blue |
| `--color-secondary` | `#3479bc` | Brand light blue |
| `--color-secondary-dark` | `#239650` | Brand green |

Orange (`#fcbb69`, `#e77342`) and green-dark (`#256d45`) are added as standalone named tokens (`--color-accent`, `--color-accent-dark`, `--color-green-dark`) for future use but are not wired into existing utilities.

### 4. Equilibrio layout route as theme boundary

**Decision:** The existing `src/routes/eventos/$seriesSlug` parent layout (or a new Equilibrio-specific layout if needed) wraps the `<Outlet />` in `<div data-theme="equilibrio">`.

Because TanStack Router uses file-based routing, the cleanest boundary is a layout file that matches only the `equilibrio` slug. The current layout at `eventos/$seriesSlug/index.tsx` is series-agnostic. Options:

- Add a conditional `data-theme` prop driven by `seriesSlug` param — keeps one layout file.
- Create `eventos/equilibrio.tsx` as a dedicated layout — cleaner separation, no conditional.

**Decision:** Conditional attribute on the existing `$seriesSlug` layout is preferred (one file to maintain, no route tree changes). The layout reads `seriesSlug` from `useParams` and sets `data-theme={seriesSlug === "equilibrio" ? "equilibrio" : undefined}`.

## Risks / Trade-offs

- **Tailwind purging**: Tailwind 4 statically extracts classes. The `data-theme` attribute and its CSS custom property overrides live in CSS, not in class names, so purging is not a concern. ✅
- **SSR / hydration flash**: The app is a pure SPA (no SSR), so no flash risk. ✅
- **Component visual regression**: Switching primary from `#FF2D77` to `#26466d` is a visible change across all non-Equilibrio pages. Intentional, but a visual review pass is recommended. ⚠️
- **Future event series themes**: Each new themed series would add one override block to `styles.css` and one conditional branch in the layout. Scales linearly, acceptable for the foreseeable number of series.
