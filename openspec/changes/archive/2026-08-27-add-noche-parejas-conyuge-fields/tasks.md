## 1. Database

- [x] 1.1 Create migration `supabase/migrations/20260827000001_add_noche_parejas_couple_relationships.sql` that drops the earlier `noche_parejas_couples` experiment (table + `create_noche_parejas_couple` + `check_noche_parejas_emails`)
- [x] 1.2 In the same migration, create the `noche_parejas_relationships` table (`id`, `event_id`, `subscription_id`, `conyuge_subscription_id`, `conyuge_name`, `conyuge_lastname`, `relationship`, `created_at`) referencing `event_subscriptions`, with an index on `subscription_id` and RLS enabled
- [x] 1.3 Add `create_noche_parejas_registration(...)` SECURITY DEFINER RPC that inserts the registrant into `event_subscriptions`, reuses or creates the cónyuge subscription, records the relationship, guards `conyuge_same_email`, checks capacity, and returns TRUE when the cónyuge was already registered
- [x] 1.4 Add an admin-only SELECT RLS policy on `noche_parejas_relationships` (mirror the event_subscriptions admin policy)
- [x] 1.5 Apply the migration and regenerate `src/lib/database.types.ts` (do not hand-edit)

## 2. Validation

- [x] 2.1 In `src/lib/validations/noche-parejas.ts` add `RELATIONSHIP_OPTIONS` const tuple (`Casados`, `Novios`, `Comprometidos`, `Unión libre`) and shared field schemas (name, lastname, phone, relationship)
- [x] 2.2 Extend `nocheParejasFormSchema` with `withConyuge` (boolean) and `conyugeName`, `conyugeLastname`, `conyugeEmail`, `conyugePhone`, `relationship`; validate the cónyuge fields and relationship via `superRefine` only when `withConyuge` is true

## 3. Service & Hooks

- [x] 3.1 Create `src/lib/services/nocheParejas.ts` with `createNocheParejasRegistration(input)` calling the `create_noche_parejas_registration` RPC, passing cónyuge args only when `withConyuge`, and mapping errors (capacity, `23505`, `conyuge_same_email`, generic)
- [x] 3.2 Return `{ conyugeAlreadyRegistered }` from the service based on the RPC boolean result
- [x] 3.3 Create `src/lib/hooks/useCreateNocheParejasRegistration.ts` (TanStack Query mutation) invalidating `["events"]`
- [x] 3.4 Reuse the existing `useNocheParejasEvent` hook to resolve the event id in the form path

## 4. Form UI

- [x] 4.1 Update `src/components/forms/NocheParejasForm.tsx` default values and fields to include the `withConyuge` checkbox and the cónyuge nombre/apellido/email/teléfono and relationship select
- [x] 4.2 Render the cónyuge block conditionally via `form.Subscribe` on `withConyuge`, grouped under a clear Spanish heading; render relationship with `src/components/ui/select.tsx`
- [x] 4.3 Wire per-field Zod validators for the new fields; short-circuit the cónyuge validators when `withConyuge` is false (match existing inline-error pattern)
- [x] 4.4 On submit: call `createNocheParejasRegistration`; if the cónyuge was already registered, show a Spanish warning toast that the relationship was linked to the existing subscription
- [x] 4.5 Navigate to `/noche-parejas/registro-exitoso` on success; show the mapped error toast on failure

## 5. Dashboard admin view

- [x] 5.1 Enrich `fetchEventsWithSubscriptions()` in `src/lib/services/dashboard.ts` with couple info (cónyuge nombre/apellido, relationship) from `noche_parejas_relationships`, keyed by `subscription_id`; extend the `EventSubscription` type
- [x] 5.2 Add "Relación", "Cónyuge nombre", and "Cónyuge apellido" columns to `src/components/dashboard/SubscribersTable.tsx` with a "—" placeholder for non-couple rows
- [x] 5.3 Include the relationship and cónyuge columns in the subscribers CSV export

## 6. Testing

- [x] 6.1 Update `src/lib/validations/__tests__/noche-parejas.test.ts` for the `withConyuge` field, the conditional cónyuge validation, and the relationship enum (valid + invalid cases)
- [x] 6.2 Update `src/components/forms/__tests__/NocheParejasForm.test.tsx`: renders registrant fields + optional cónyuge checkbox; reveals cónyuge fields on check; registers a single person; registers a couple; warns when the cónyuge was already registered; blocks submit when the data policy is not accepted
- [x] 6.3 Update the dashboard tests (`SubscribersTable`, `EventCard`, `SubscriberSearch`) for the enriched couple columns
- [x] 6.4 Run `pnpm test` and confirm the noche-parejas and dashboard suites pass

## 7. Verification

- [x] 7.1 Run `pnpm build` (tsc type-check) and fix any type errors
- [x] 7.2 Run `pnpm check` (Biome lint + format) and resolve findings
- [x] 7.3 Manually verify the `/noche-parejas` flow: single registration, couple registration, and the warning path when the cónyuge is already registered
- [x] 7.4 Manually verify the events dashboard couple columns: relationship + cónyuge nombre/apellido display and CSV export
