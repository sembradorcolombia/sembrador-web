## 1. Update HeroSection

- [x] 1.1 Import `Clock` and `MapPin` from `lucide-react` in `src/components/home/HeroSection.tsx`
- [x] 1.2 Extract `aboutServiceTimes`, `aboutLocation`, and `address` from `settings` with fallbacks (`"Domingos 10:00 AM"` and `"Medellín, Colombia"`)
- [x] 1.3 Replace the `<Link to="/eventos">Nuestros eventos</Link>` CTA with a service info block: two pill-style items (Clock + schedule, MapPin + location) displayed in a centered row below the tagline
- [x] 1.4 Add a secondary "Conocer más" ghost/outline `<Link to="/acerca">` below the info block
- [x] 1.5 Add skeleton placeholder shapes for the info pills in the `isLoading` branch

## 2. Verification

- [x] 2.1 Run `pnpm build` to confirm no TypeScript errors
- [x] 2.2 Run `pnpm check` (Biome lint + format) and fix any issues
- [ ] 2.3 Start `pnpm dev` and visually verify the hero shows schedule + location pills and the "Conocer más" link on the home page
- [ ] 2.4 Verify the "Conocer más" link navigates correctly to `/acerca`
- [x] 2.5 Run `pnpm test` to confirm unit tests pass
