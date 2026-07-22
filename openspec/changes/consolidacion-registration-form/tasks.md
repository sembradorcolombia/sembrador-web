## 1. Database Setup

- [ ] 1.1 Create `consolidation_registrations` table in Supabase (id uuid PK, name, lastname, mobile, email, next_step, comment nullable, accepts_data_policy boolean, created_at timestamptz) with RLS enabled
- [ ] 1.2 Create `create_consolidation_registration` RPC function (SECURITY DEFINER) with parameters p_name, p_lastname, p_mobile, p_email, p_next_step, p_comment (default NULL), p_accepts_data_policy
- [ ] 1.3 Regenerate `src/lib/database.types.ts` from the updated Supabase schema

## 2. Validation Layer

- [ ] 2.1 Extract email validation logic (disposable domains, test local parts, repeated char patterns) from `src/lib/validations/subscription.ts` into shared `src/lib/validations/email.ts` exporting a reusable email schema
- [ ] 2.2 Update `src/lib/validations/subscription.ts` to import the shared email schema (no behavior change)
- [ ] 2.3 Create `src/lib/validations/consolidation.ts` with `NEXT_STEP_OPTIONS` constant, `consolidationFormSchema` (name, lastname, mobile, email via shared schema, nextStep enum, optional comment max 500, acceptsDataPolicy literal true), and `ConsolidationFormData` type

## 3. Service and Hook Layer

- [ ] 3.1 Create `src/lib/services/consolidation.ts` with `createConsolidationRegistration(data: ConsolidationFormData)` calling the RPC, with Spanish error handling
- [ ] 3.2 Create `src/lib/hooks/useCreateConsolidationRegistration.ts` wrapping the service in a `useMutation`

## 4. Form Component

- [ ] 4.1 Create `src/components/forms/ConsolidationForm.tsx` using TanStack Form following the `SubscriptionForm` pattern: `form.Field` with `validators.onChange`, `useId()` label pairing, inline error display, Spanish labels/placeholders
- [ ] 4.2 Implement fields: nombre (Input), apellido (Input), celular (Input tel), correo electrónico (Input email), paso a seguir (Select with NEXT_STEP_OPTIONS), comentario (textarea, optional), data policy checkbox linking to `/politica-de-datos`
- [ ] 4.3 Accept `defaultNextStep` prop to pre-select the step; on success navigate to `/consolidacion/registro-exitoso`; on error show toast

## 5. Routes

- [ ] 5.1 Create `src/routes/consolidacion/index.tsx` — form page with `validateSearch` for the `paso` param, `SeoHead`, header section, and `ConsolidationForm` with `defaultNextStep`
- [ ] 5.2 Create `src/routes/consolidacion/registro-exitoso.tsx` — success page following the existing pattern: `bg-secondary` centered layout, "¡Registro exitoso!" message, "Volver" link to `/`, Meta Pixel `trackCustom("ConsolidationSuccess")` on mount
- [ ] 5.3 Verify `src/routeTree.gen.ts` regenerates with the new routes

## 6. StepCard CTA Routing

- [ ] 6.1 Update `src/components/next-steps/StepCard.tsx` to detect consolidation step titles and render TanStack Router `<Link to="/consolidacion" search={{ paso: step.title }}>` instead of the CMS `ctaLink` for those cards; keep existing behavior for all other cards

## 7. Verification

- [ ] 7.1 Run `pnpm check` (Biome lint + format) and fix any issues
- [ ] 7.2 Run `pnpm build` (includes `tsc` type-check) successfully
- [ ] 7.3 Run `pnpm test` — all unit tests pass
- [ ] 7.4 Manual E2E smoke test: `/siguientes-pasos` → click "Conectar" CTA → `/consolidacion?paso=...` pre-selected → submit valid form → success page → record present in Supabase table
