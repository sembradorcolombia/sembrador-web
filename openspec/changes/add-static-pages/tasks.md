## 1. Components

- [ ] 1.1 Create `src/components/next-steps/` directory
- [ ] 1.2 Create `src/components/next-steps/StepCard.tsx` — action card with title, description, Lucide icon (mapped from string), and CTA button/link. Follow shadcn/ui conventions (cn(), Tailwind).
- [ ] 1.3 Add Lucide icon name-to-component mapping with fallback default icon
- [ ] 1.4 Create `src/components/give/` directory
- [ ] 1.5 Create `src/components/give/GivingOptionCard.tsx` — payment method card with title, description, type badge (Banco / Nequi / Daviplata), detail text, and optional QR code image via Sanity image URL builder

## 2. Routes

- [ ] 2.1 Create `src/routes/acerca.tsx` — about page consuming `useSiteSettings` hook, displaying church description, location, service times, with fallback content and page title "Acerca — El Sembrador"
- [ ] 2.2 Create `src/routes/siguientes-pasos.tsx` — next steps page consuming `useNextSteps` hook, displaying `StepCard` grid ordered by `order` field, with empty state and page title "Siguientes Pasos — El Sembrador"
- [ ] 2.3 Create `src/routes/dar.tsx` — giving page consuming `useGivingOptions` hook, displaying `GivingOptionCard` grid ordered by `order` field, with empty state and page title "Dar — El Sembrador"

## 3. Responsive Layout

- [ ] 3.1 Ensure next steps cards use responsive grid: single column on mobile, 2-3 columns on desktop
- [ ] 3.2 Ensure giving option cards use responsive layout: single column on mobile, multi-column on desktop
- [ ] 3.3 Ensure about page content is readable with appropriate max-width and spacing

## 4. Verification

- [ ] 4.1 Run `pnpm build` to verify TypeScript compilation passes
- [ ] 4.2 Run `pnpm check` to verify Biome lint/format compliance
- [ ] 4.3 Run `pnpm test` to verify existing tests still pass
- [ ] 4.4 Manually verify all three pages render correctly with and without CMS data
