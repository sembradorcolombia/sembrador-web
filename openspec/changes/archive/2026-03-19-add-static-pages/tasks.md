## 1. Components

- [x] 1.1 Create `src/components/next-steps/` directory
- [x] 1.2 Create `src/components/next-steps/StepCard.tsx` — action card with title, description, Lucide icon (mapped from string), and CTA button/link. Follow shadcn/ui conventions (cn(), Tailwind).
- [x] 1.3 Add Lucide icon name-to-component mapping with fallback default icon
- [x] 1.4 Create `src/components/give/` directory
- [x] 1.5 Create `src/components/give/GivingOptionCard.tsx` — payment method card with title, description, type badge (Banco / Nequi / Daviplata), detail text, and optional QR code image via Sanity image URL builder

## 2. Routes

- [x] 2.1 Create `src/routes/acerca.tsx` — about page consuming `useSiteSettings` hook, displaying church description, location, service times, with fallback content and page title "Acerca — El Sembrador"
- [x] 2.2 Create `src/routes/siguientes-pasos.tsx` — next steps page consuming `useNextSteps` hook, displaying `StepCard` grid ordered by `order` field, with empty state and page title "Siguientes Pasos — El Sembrador"
- [x] 2.3 Create `src/routes/dar.tsx` — giving page consuming `useGivingOptions` hook, displaying `GivingOptionCard` grid ordered by `order` field, with empty state and page title "Dar — El Sembrador"

## 3. Responsive Layout

- [x] 3.1 Ensure next steps cards use responsive grid: single column on mobile, 2-3 columns on desktop
- [x] 3.2 Ensure giving option cards use responsive layout: single column on mobile, multi-column on desktop
- [x] 3.3 Ensure about page content is readable with appropriate max-width and spacing

## 4. Verification

- [x] 4.1 Run `pnpm build` to verify TypeScript compilation passes
- [x] 4.2 Run `pnpm check` to verify Biome lint/format compliance
- [x] 4.3 Run `pnpm test` to verify existing tests still pass
- [x] 4.4 Manually verify all three pages render correctly with and without CMS data
