## 1. Shared Icon Module

- [x] 1.1 Create `src/lib/icons.ts`: move `ICON_MAP`, `DEFAULT_ICON` (`HelpCircle`), and `resolveIcon()` from `src/components/connect/ConnectCard.tsx`, exporting all three
- [x] 1.2 Add the `"life-buoy": LifeBuoy` entry to `ICON_MAP` (import `LifeBuoy` from `lucide-react`)
- [x] 1.3 Update `ConnectCard.tsx` to import `resolveIcon` from `@/lib/icons` and remove its local `ICON_MAP`/`DEFAULT_ICON`/`resolveIcon` definitions and now-unused lucide imports

## 2. Homepage Preview Fix

- [x] 2.1 In `src/components/home/ConnectPreview.tsx`, replace the `<span role="img">{step.icon}</span>` block with a `StepIcon` helper that renders the resolved Lucide icon, and align card styling with `/conectar`'s `ConnectCard` (green circular icon badge `h-12 w-12 rounded-full bg-green-100 text-green-700`, Grotesk title, green CTA, `border-gray-100`, bottom-aligned CTA; skeleton placeholder updated to match)
- [x] 2.2 Verify the raw icon name string is no longer rendered anywhere in `ConnectPreview.tsx`

## 3. Content-Adaptive Preview Grids

- [x] 3.1 Create `src/lib/grid.ts` exporting `previewGridClass(count, maxColumns)`, mapping item count → literal Tailwind column classes (1 → clamped and left-aligned, 2 → clamped and centered, 3/4 → full-width multi-column), clamping `count` into `[1, maxColumns]`
- [x] 3.2 Update `ConnectPreview.tsx` to size its grid via `previewGridClass(..., 4)` instead of the fixed `sm:grid-cols-2 lg:grid-cols-4`, driving the loading skeleton from a shared `SKELETON_COUNT`
- [x] 3.3 Update `EventsPreview.tsx` to size its grid via `previewGridClass(..., 3)` instead of the fixed `sm:grid-cols-2 lg:grid-cols-3`, driving the loading skeleton from a shared `SKELETON_COUNT`

## 4. Verification

- [x] 4.1 Run `pnpm build` (includes `tsc` type-check) — must pass with no errors
- [x] 4.2 Run `pnpm check` (Biome lint + format) — must pass with no errors
- [x] 4.3 Run `pnpm test` — existing unit tests must pass
- [x] 4.4 Run `pnpm dev` and visually confirm on `/` that Conectar cards show Lucide icons for `hand-heart`, `users`, and `life-buoy`, and that `/conectar` still renders icons correctly
