## 1. Database

- [x] 1.1 Create migration `supabase/migrations/<ts>_add_noche_parejas_couples.sql` defining the `noche_parejas_couples` table (registrant name/lastname/email/phone, cónyuge conyuge_name/conyuge_lastname/conyuge_email/conyuge_phone, relationship, accepts_data_policy, id, created_at) with RLS enabled
- [x] 1.2 Add `create_noche_parejas_couple(...)` SECURITY DEFINER RPC that inserts one row (mirror `create_desayuno_registration`)
- [x] 1.3 Add `check_noche_parejas_emails(p_emails TEXT[]) RETURNS TEXT[]` SECURITY DEFINER RPC returning the subset of passed emails already present (case-insensitive match on `email` or `conyuge_email`)
- [x] 1.4 Add an admin-only SELECT RLS policy on `noche_parejas_couples` (mirror the desayuno admin policy)
- [x] 1.5 Apply the migration and regenerate `src/lib/database.types.ts` (do not hand-edit)

## 2. Validation

- [x] 2.1 In `src/lib/validations/noche-parejas.ts` add `RELATIONSHIP_OPTIONS` const tuple (`Casados`, `Novios`, `Comprometidos`, `Unión libre`)
- [x] 2.2 Extend `nocheParejasFormSchema` with `conyugeName`, `conyugeLastname` (2–100 chars), `conyugeEmail` (reuse `emailSchema`), `conyugePhone` (10-digit regex), and `relationship` (`z.enum(RELATIONSHIP_OPTIONS, { message: "Debes seleccionar una opción" })`)

## 3. Service & Hooks

- [x] 3.1 Create `src/lib/services/nocheParejas.ts` with `createNocheParejasCouple(formData)` calling the create RPC and mapping the generic error to "Ocurrió un error inesperado. Intenta de nuevo más tarde."
- [x] 3.2 Add `checkNocheParejasEmails(emails: string[]): Promise<string[]>` in the same service, calling the check RPC
- [x] 3.3 Add `fetchNocheParejasCouples()` in the same service (paged `range` loop, `PAGE_SIZE = 1000`, newest first) mirroring `fetchDesayunoRegistrations`; export a `NocheParejasCouple = Tables<"noche_parejas_couples">` type
- [x] 3.4 Create `src/lib/hooks/useCreateNocheParejasCouple.ts` (TanStack Query mutation) and an email-check helper/hook
- [x] 3.5 Create `src/lib/hooks/useNocheParejasCouples.ts` (query key `["dashboard", "noche-parejas-couples"]`)
- [x] 3.6 Remove `useNocheParejasEvent` / `useCreateSubscription` usage from the form path (delete the hook only if nothing else references it)

## 4. Form UI

- [x] 4.1 Update `src/components/forms/NocheParejasForm.tsx` default values and fields to include cónyuge nombre/apellido/email/teléfono and the relationship select
- [x] 4.2 Group registrant vs. cónyuge fields under clear Spanish headings; render relationship with `src/components/ui/select.tsx`
- [x] 4.3 Wire per-field Zod `safeParse` validators for all new fields (match existing inline-error pattern)
- [x] 4.4 On submit: run `checkNocheParejasEmails([email, conyugeEmail])`; if any collide, show a Spanish warning naming which email (registrant vs. cónyuge) is already registered, keep form state, and do not persist
- [x] 4.5 If no collision, call `createNocheParejasCouple` and navigate to `/noche-parejas/registro-exitoso` on success; show the generic error toast on failure

## 5. Dashboard admin view

- [x] 5.1 Extend `DashboardSection` union and add the `{ id: "noche-parejas", label: "Noche de Parejas" }` tab in `src/components/dashboard/DashboardTabs.tsx`
- [x] 5.2 Create `src/components/dashboard/NocheParejasTable.tsx` (clone `DesayunoTable.tsx`) with columns `#`, "Nombre", "Apellido", "Email", "Celular", "Cónyuge", "Email cónyuge", "Celular cónyuge", "Relación", "Política de datos", "Fecha"; default sort `created_at desc`
- [x] 5.3 Make the global filter match across registrant and cónyuge nombre/apellido/email/celular
- [x] 5.4 Wire CSV export with the Spanish column labels (both spouses + relationship) and filename `noche-parejas-registros-YYYY-MM-DD.csv`
- [x] 5.5 Create `src/components/dashboard/NocheParejasSection.tsx` (clone `DesayunoSection.tsx`) with loading/error/empty states and the total count
- [x] 5.6 Render `<NocheParejasSection />` for the new tab in `src/routes/dashboard.tsx`

## 6. Testing

- [x] 6.1 Update `src/lib/validations/__tests__/noche-parejas.test.ts` for the new fields and relationship enum (valid + each invalid case)
- [x] 6.2 Update `src/components/forms/__tests__/NocheParejasForm.test.tsx`: renders all new fields + relationship select; blocks submit with warning when registrant email exists; blocks with warning when cónyuge email exists; preserves field values on block; persists and navigates when neither email exists
- [x] 6.3 Add dashboard tests (mirror the Desayuno section/table tests): listing, empty state, load error, search across both spouses, sorting, pagination, and CSV export
- [x] 6.4 Run `pnpm test` and confirm the noche-parejas and dashboard suites pass

## 7. Verification

- [x] 7.1 Run `pnpm build` (tsc type-check) and fix any type errors
- [x] 7.2 Run `pnpm check` (Biome lint + format) and resolve findings
- [ ] 7.3 Manually verify the `/noche-parejas` flow: successful couple registration, and the block+warning path for an already-registered email
- [ ] 7.4 Manually verify the dashboard "Noche de Parejas" tab: listing, search, sort, pagination, and CSV export
