## Why

The Navbar and Footer currently reference a placeholder `/header-logo.svg` that doesn't exist in the repo. The official brand SVG assets are now available at `/brand/logo-el-sembrador-h.svg` (colored horizontal) and `/brand/logo-el-sembrador-hw.svg` (white horizontal), and should be used in their respective contexts.

## What Changes

- **Navbar:** Replace `src="/header-logo.svg"` with `src="/brand/logo-el-sembrador-h.svg"` and remove the `brightness-0 invert` CSS filter workaround if present.
- **Footer:** Replace `src="/header-logo.svg"` with `src="/brand/logo-el-sembrador-hw.svg"` and remove the `brightness-0 invert` filter since the `-hw` variant is already white.

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

_(none — logo display is already specified in `site-navigation`; only the asset path changes, not the behavior)_

## Impact

- `src/components/layout/Navbar.tsx` — `src` attribute on the logo `<img>` updated.
- `src/components/layout/Footer.tsx` — `src` attribute on the logo `<img>` updated; `brightness-0 invert` Tailwind classes removed.
- No new dependencies. No route changes. No Supabase or Sanity changes.
