## Context

The `/dar` page (`src/routes/dar.tsx`) renders a grid of `GivingOptionCard` components. Each card optionally shows a Sanity-hosted QR code image via the `qrImg` helper at a fixed 160px (`w-40 h-40`, requested at 240×240 with `fit("clip")`). At that size, scanning the QR is unreliable, particularly on the same phone the user is browsing with. We want a tap/click-to-zoom interaction scoped entirely to `GivingOptionCard`.

The project already vendors a Radix-based `Dialog` (`src/components/ui/dialog.tsx`) used elsewhere in the app, with overlay, animations, focus management, Escape-to-close, and an accessible close button. The Sanity image URL builder (`sanityImageUrl`) supports requesting arbitrary dimensions.

## Goals / Non-Goals

**Goals:**
- Allow users to tap/click a giving option's QR code to view an enlarged, scan-friendly version.
- Provide an accessible, discoverable affordance (cursor, focus ring, keyboard support).
- Serve a higher-resolution image variant in the zoomed view so it stays crisp.
- Keep the change confined to `GivingOptionCard` and reuse the existing `Dialog` primitive.

**Non-Goals:**
- No pan/pinch-zoom-within-zoom, gallery, or multi-image carousel.
- No CMS schema, route, data-fetching, or Supabase changes.
- No new npm dependencies.
- No global "image lightbox" abstraction (kept local to this card for now).

## Decisions

### Decision: Reuse the existing Radix `Dialog` as the zoom container
Use `Dialog`, `DialogTrigger`, and `DialogContent` from `src/components/ui/dialog.tsx` rather than building a bespoke overlay.

**Rationale:** The Dialog already provides overlay, fade/zoom animations, Escape-to-close, focus trapping, portal rendering, and an accessible localized close button ("Cerrar"). It is already in the bundle, so the marginal cost is near zero.

**Alternatives considered:**
- *Custom absolutely-positioned overlay* — would re-implement focus trapping and accessibility from scratch; rejected.
- *A new dedicated `ImageLightbox` UI primitive* — premature abstraction for a single use site; can extract later if a second consumer appears.

### Decision: Make the QR image a button-typed trigger
Wrap the existing `<img>` in a `DialogTrigger asChild` rendering a `<button type="button">`, so the QR is keyboard-focusable and activates on Enter/Space natively.

**Rationale:** Native button semantics give keyboard operability and screen-reader affordance for free. `asChild` avoids nesting interactive elements.

**Alternatives considered:**
- *`onClick` on the `<img>`* — not keyboard-operable, not announced as interactive; rejected.

### Decision: Request a higher-resolution image variant for the zoom view
Add a second helper (e.g. `qrImgLarge`) that requests a larger size (e.g. ~720px, `fit("clip")`) from `sanityImageUrl`, used inside `DialogContent`. Keep the existing 240px `qrImg` for the thumbnail.

**Rationale:** Upscaling the 240px thumbnail would look blurry when enlarged; a dedicated larger request keeps the QR sharp and scannable. Per project conventions, chained `.fit()` calls live in a named helper to avoid Biome lint issues.

**Alternatives considered:**
- *Reuse the 240px URL and CSS-scale it up* — blurry, defeats the purpose; rejected.
- *Request the original asset with no transform* — risks very large payloads; a bounded large size is sufficient.

### Decision: Size the zoomed image responsively within the dialog
Render the large QR centered, constrained to viewport (e.g. `max-w` / `max-h` with `object-contain`) so it is large on desktop yet fully visible on small screens. Override the default `DialogContent` `max-w-lg` as needed.

**Rationale:** The whole point is a bigger, fully-visible QR; it must not overflow on mobile.

### Decision: Keep affordances minimal and localized in Spanish
Add `cursor-zoom-in` and a focus-visible ring on the trigger, plus accessible labels in Spanish (e.g. button `aria-label`/`title` like "Ampliar código QR de {título}"; dialog title referencing the option title). Render the zoom modal only when a QR exists.

**Rationale:** Matches the site's Spanish UI convention and keeps the feature discoverable without clutter.

## Risks / Trade-offs

- **Discoverability of the zoom affordance** → Mitigate with `cursor-zoom-in`, a focus ring, and an `aria-label`/`title` hint; optionally a small visual cue.
- **Nested interactive elements / a11y violations** → Use `DialogTrigger asChild` with a single `<button>` wrapping the image; do not place other interactive controls inside the trigger.
- **Larger image payload on zoom** → Bound the large variant to a reasonable size (~720px) and only load it within the dialog (rendered when QR exists); acceptable for an intentional user action.
- **Dialog title/description a11y warnings (Radix)** → Provide a `DialogTitle` (visually hidden if needed) so Radix does not warn about a missing accessible title.
- **Visual regression in card layout** → Trigger button should not alter the QR's existing footprint; keep wrapper sizing equivalent to the current `<img>`.
