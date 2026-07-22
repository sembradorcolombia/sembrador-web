## Why

Visitors who want to take next steps at El Sembrador (Comunidades misionales, Discipulado 1:1, Consejería) currently have no way to register their interest from the `/siguientes-pasos` page. A dedicated consolidation flow is needed to capture visitor data, route them to the right ministry, and allow pastoral follow-up.

## What Changes

- New route `/consolidacion` with a registration form (name, lastname, mobile, email, step selector, comment, data policy checkbox)
- New route `/consolidacion/registro-exitoso` as a success confirmation page
- New Supabase table `consolidation_registrations` to persist registration records
- New Supabase RPC function `create_consolidation_registration` to handle inserts
- Update `/siguientes-pasos` step card CTAs for "Conectar" options to navigate to `/consolidacion` with a pre-selected step via query parameter
- New Zod validation schema for the consolidation form, with shared email validation extracted to a reusable utility
- New TanStack Form component (`ConsolidationForm`) following existing form patterns
- New service layer function and TanStack Query mutation hook

## Capabilities

### New Capabilities
- `consolidation-registration`: Registration form, validation, Supabase persistence, and success flow for the consolidation process at `/consolidacion`

### Modified Capabilities
- `next-steps-page`: Step card CTAs for "Conectar" options must link to `/consolidacion` with the selected step as a query parameter instead of their CMS-defined `ctaLink`

## Impact

- **Routes**: Two new route files under `src/routes/consolidacion/`; TanStack Router auto code-splitting handles bundle impact
- **Database**: New `consolidation_registrations` table + RPC function in Supabase; `src/lib/database.types.ts` regenerated
- **Services**: New `src/lib/services/consolidation.ts` service file
- **Hooks**: New `useCreateConsolidationRegistration` mutation hook
- **Components**: New `ConsolidationForm` component in `src/components/forms/`; `StepCard` CTA link logic updated
- **Validation**: New `src/lib/validations/consolidation.ts` schema + shared `src/lib/validations/email.ts` utility (extracted from `subscription.ts`)
- **Dependencies**: No new npm packages required
- **Analytics**: Fire Meta Pixel custom event on successful registration (consistent with existing patterns)
