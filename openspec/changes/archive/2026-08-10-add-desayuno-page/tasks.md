## 1. Database

- [x] 1.1 Add Supabase migration creating `desayuno_registrations` (id, name, lastname, email, phone, accepts_data_policy, created_at), enable RLS, and define `create_desayuno_registration` SECURITY DEFINER RPC
- [x] 1.2 Apply migration to the target Supabase project and regenerate `src/lib/database.types.ts`

## 2. Validation, service, and hook

- [x] 2.1 Add Zod schema and types in `src/lib/validations/desayuno.ts` (name, lastname, email via `emailSchema`, phone 10 digits, acceptsDataPolicy literal true) with Spanish error messages
- [x] 2.2 Add unit tests for the desayuno validation schema
- [x] 2.3 Add `createDesayunoRegistration` in `src/lib/services/desayuno.ts` calling the RPC with user-facing error handling
- [x] 2.4 Add service unit tests (success + RPC failure paths)
- [x] 2.5 Add `useCreateDesayunoRegistration` TanStack Query mutation hook

## 3. UI and routes

- [x] 3.1 Build `DesayunoForm` in `src/components/forms/DesayunoForm.tsx` (TanStack Form, existing UI primitives, policy link to `/politica-de-datos`, navigate to success on submit, error toast on failure)
- [x] 3.2 Add `/desayuno` route page with Spanish header copy and `SeoHead`
- [x] 3.3 Add `/desayuno/registro-exitoso` success page with confirmation copy, "Volver" to `/`, and Meta Pixel `DesayunoSuccess` when `fbq` is available

## 4. Verification

- [x] 4.1 Run unit tests for new validation/service coverage
- [x] 4.2 Run `pnpm check` (Biome) and fix any issues
- [x] 4.3 Run `pnpm build` (includes tsc) and fix type errors
- [x] 4.4 Manually smoke-test: open `/desayuno`, submit valid data → success page + row in Supabase; invalid fields show Spanish errors; unchecked policy blocks submit
