## Why

The current theme colors (`#FF2D77` pink, `#1D13BD` blue) are placeholders that don't match the El Sembrador brand. Additionally, the Equilibrio event series has its own distinct visual identity and needs an isolated theme so its routes can render with the correct palette without affecting the rest of the site.

## What Changes

- Replace the default CSS custom properties in `@theme` with the official El Sembrador brand palette (blues, greens, oranges, grays).
- Introduce a multi-theme system using a CSS data attribute (`data-theme="equilibrio"`) that scopes Equilibrio colors to the `/eventos/equilibrio` route subtree.
- Update all existing usages of `--color-primary` / `--color-secondary` across components and routes to use the new brand tokens.
- Apply the `data-theme="equilibrio"` attribute at the Equilibrio route layout so nested pages inherit it automatically.

## Capabilities

### New Capabilities

- `theme-system`: CSS multi-theme system — default El Sembrador brand theme plus a scoped `equilibrio` theme applied via `data-theme` attribute on the route layout.

### Modified Capabilities

- `event-series-pages`: The Equilibrio event series pages (`/eventos/equilibrio/**`) now render inside a scoped theme wrapper that overrides color tokens to the Equilibrio palette.

## Impact

- `src/styles.css` — `@theme` block rewritten; new `[data-theme="equilibrio"]` ruleset added.
- Components using `bg-primary`, `text-primary`, `border-secondary`, etc. — visually updated to brand palette (no API changes).
- `/eventos/equilibrio` layout route — gains a wrapping `div` with `data-theme="equilibrio"`.
- No new npm dependencies.
- No route path changes; no redirects needed.
- No Supabase or Sanity schema changes.
