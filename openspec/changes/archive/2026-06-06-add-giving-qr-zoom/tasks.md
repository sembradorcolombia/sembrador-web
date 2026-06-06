## 1. Image helper

- [x] 1.1 In `src/components/give/GivingOptionCard.tsx`, add a `qrImgLarge(source)` helper that requests a higher-resolution QR variant (~720px, `fit("clip")`) via `sanityImageUrl`, mirroring the existing named-helper pattern used by `qrImg`.

## 2. Zoomable QR implementation

- [x] 2.1 Import `Dialog`, `DialogTrigger`, `DialogContent`, and `DialogTitle` from `@/components/ui/dialog` in `GivingOptionCard.tsx`.
- [x] 2.2 Wrap the existing QR `<img>` in a `Dialog` whose `DialogTrigger asChild` renders a `<button type="button">` containing the thumbnail image; preserve the current QR footprint/sizing.
- [x] 2.3 Add the zoom affordance to the trigger: `cursor-zoom-in`, a focus-visible ring, and a Spanish `aria-label`/`title` (e.g. "Ampliar código QR de {option.title}").
- [x] 2.4 Render `DialogContent` with a `DialogTitle` (visually hidden if appropriate) referencing the option title, and the large QR via `qrImgLarge`, centered and constrained (`max-w`/`max-h`, `object-contain`) so it stays fully visible on mobile and desktop; override the default `max-w-lg` as needed.
- [x] 2.5 Ensure the Dialog (and its large image) is only rendered when `option.qrCodeImage` exists; confirm Escape, overlay click, and the existing "Cerrar" close button all dismiss it.

## 3. Testing

- [x] 3.1 Add/extend a unit test for `GivingOptionCard` verifying: the QR renders as an interactive button when a QR exists, activating it opens the dialog with the enlarged image, and no zoom control renders when `qrCodeImage` is absent.
- [x] 3.2 Manually verify on a narrow mobile viewport and a desktop viewport that the zoomed QR is fully visible, sharp, and dismissible via close button, Escape, and overlay click.

## 4. Verification & cleanup

- [x] 4.1 Run `pnpm check` (Biome lint + format) and resolve any issues, paying attention to chained `.fit()` lint rules.
- [x] 4.2 Run `pnpm build` (includes `tsc` type-check) and confirm it passes.
- [x] 4.3 Run `pnpm test` and confirm unit tests pass.
- [x] 4.4 Run `openspec validate add-giving-qr-zoom` and confirm the change is valid.
