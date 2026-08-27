## 1. Database and assets

- [x] 1.1 Add a Supabase migration that inserts an `events` row named `Noche de Parejas` with `max_capacity` 100 and `current_count` 0 if no row with that name exists
- [x] 1.2 Apply the migration to the target Supabase project
- [x] 1.3 Export the Penpot title graphic and couple+hearts image as webp into `src/assets/images/` (reuse existing `logo-hw.svg` for the white logo)

## 2. Validation and form

- [x] 2.1 Add Zod schema and types in `src/lib/validations/noche-parejas.ts` (name, lastname, email via `emailSchema`, phone 10 digits, acceptsDataPolicy literal true) with Spanish error messages
- [x] 2.2 Add unit tests for the noche-parejas validation schema
- [x] 2.3 Add `NOCHE_PAREJAS_EVENT_NAME` constant and resolve the event id from `useEvents` / `fetchEvents` (Spanish error if missing)
- [x] 2.4 Build `NocheParejasForm` in `src/components/forms/NocheParejasForm.tsx` (TanStack Form, campaign-styled fields, policy link to `/politica-de-datos`, concatenate name+lastname, call existing `useCreateSubscription`, navigate to success on submit, toast capacity/duplicate/generic errors)

## 3. Layout and routes

- [x] 3.1 Add `NocheParejasLayout` (lavender `#e2a9f1` full-bleed, white logo, title graphic, couple photo, content slot; desktop two-column, stacked single column below `lg` with no horizontal overflow on landing, form, and success)
- [x] 3.2 Add `/noche-parejas` to `LAYOUT_OPT_OUT_PREFIXES` in `src/routes/__root.tsx`
- [x] 3.3 Add `/noche-parejas` route showing event details ("Cena para parejas", "Viernes / SEP. 18 7:00PM") and `NocheParejasForm` in the campaign layout, with `SeoHead`
- [x] 3.4 Add `/noche-parejas/registro-exitoso` with thank-you copy ("muchas gracias por registrarte" / "nos vemos en una noche especial"), "Ir al inicio" → `/`, Meta Pixel `NocheParejasSuccess` when `fbq` is available, and `SeoHead`

## 4. Verification

- [x] 4.1 Add unit tests that the form concatenates nombres+apellidos and submits `createSubscription` with the resolved event id
- [x] 4.2 Run unit tests for new validation/form coverage
- [x] 4.3 Run `pnpm check` (Biome) and fix any issues
- [x] 4.4 Run `pnpm build` (includes tsc) and fix type errors
- [x] 4.5 Smoke-test: form on `/noche-parejas`; valid submit → success page + `event_subscriptions` row; duplicate email shows error toast; invalid fields show Spanish errors
- [x] 4.6 Smoke-test viewports (~375px and desktop): landing + form and success stack to one column on mobile with no horizontal overflow; fields and "Ir al inicio" remain usable
