## Why

The QR code on the `/dar` (giving) page renders at a fixed 160px, which is often too small for a phone camera to reliably scan — especially when the donor is viewing the page on the same device they would use to scan. Letting users tap/click the QR code to enlarge it removes this friction and increases the chance a donation is completed.

## What Changes

- Make the QR code image in each `GivingOptionCard` interactive: clicking/tapping it opens a zoomed (enlarged) view of the same image.
- Render the zoomed view in a modal/lightbox overlay using the existing Radix `Dialog` primitive, displaying the QR at a larger, scan-friendly size.
- Add affordances so the zoom is discoverable and accessible: a pointer cursor, a hover/focus hint, keyboard operability (Enter/Space to open, Escape to close), and a clear close control.
- Request a higher-resolution image variant from the Sanity image URL builder for the zoomed view so it remains crisp when enlarged.
- No CMS schema changes, no new routes, and no changes to how giving options are fetched.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `giving-page`: Add a requirement that the QR code image is zoomable — users can open an enlarged, scan-friendly view of a giving option's QR code and dismiss it.

## Impact

- **Components:** `src/components/give/GivingOptionCard.tsx` (make QR interactive, add zoom modal).
- **UI primitives:** Reuses existing `src/components/ui/dialog.tsx` (Radix Dialog) — no new primitive needed.
- **Image handling:** Adds a higher-resolution `sanityImageUrl` variant for the zoomed view alongside the existing thumbnail variant.
- **Dependencies:** None added (Radix Dialog + lucide-react already in the project).
- **Routes / redirects:** None.
- **Bundle size:** Negligible; Dialog is already used elsewhere, so it is likely already in a shared chunk.
- **CMS / backend:** No Sanity schema or Supabase changes.
