## Context

Two brand SVGs live in `public/brand/`:
- `logo-el-sembrador-h.svg` — full-color horizontal logo (for light backgrounds)
- `logo-el-sembrador-hw.svg` — white horizontal logo (for dark backgrounds)

Both files are served as static assets by Vite from the `public/` directory, accessible at `/brand/logo-el-sembrador-h.svg` and `/brand/logo-el-sembrador-hw.svg` without any import needed.

The Navbar has a white background (`bg-white`) — the colored logo is correct here.
The Footer has a dark background (`bg-gray-900`) — the white logo variant is correct here, and the existing `brightness-0 invert` CSS filter hack can be removed since the dedicated white SVG makes it unnecessary.

## Goals / Non-Goals

**Goals:**
- Point each logo `<img>` to the correct brand asset.
- Remove the CSS filter workaround from the Footer.

**Non-Goals:**
- Resizing, repositioning, or redesigning the logo presentation.
- Adding responsive logo variants.

## Decisions

### Use `<img src="...">` with public path — no change to approach

Both components already use `<img src="...">` pointing to `public/`. This pattern is correct for static SVGs that don't need React component treatment or dynamic theming. No change to the rendering approach.

## Risks / Trade-offs

- None. Asset swaps in `public/` are zero-risk — no bundle impact, no type changes, no API surface changes.
