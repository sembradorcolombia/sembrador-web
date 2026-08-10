## Why

El Sembrador needs a dedicated public registration page for the breakfast event (desayuno) so attendees can leave name, last name, email, phone, and data-policy consent without going through the general event subscription flow. Capturing these leads in Supabase enables follow-up and reporting.

## What Changes

- Add a public route at `/desayuno` with a registration form (name, last name, email, phone, data policy acceptance).
- Add a success route at `/desayuno/registro-exitoso` shown after a successful submission.
- Add a new Supabase table (and SECURITY DEFINER RPC) to store desayuno registrations.
- Add Zod validation, service layer, and TanStack Query mutation hook following the consolidation registration pattern.
- Link the data policy checkbox to `/politica-de-datos`.
- Spanish UI copy throughout; optional Meta Pixel custom event on success (consistent with consolidation).

## Capabilities

### New Capabilities
- `desayuno-registration`: Public breakfast registration form, success page, validation, and Supabase persistence for desayuno leads.

### Modified Capabilities
- (none)

## Impact

- **Routes:** new `src/routes/desayuno/index.tsx` and `src/routes/desayuno/registro-exitoso.tsx` (TanStack Router auto code-splitting; `routeTree.gen.ts` regenerates).
- **Backend:** new Supabase migration (table + RLS + insert RPC); regenerate `src/lib/database.types.ts`.
- **Frontend layers:** new validation schema, service, hook, and form component under existing `src/lib/` and `src/components/forms/` conventions.
- **Dependencies:** no new npm packages.
- **Nav/SEO:** public page with `SeoHead`; navbar inclusion is optional/out of scope unless product asks for it later.
- **Admin dashboard:** out of scope for this change (table can be queried later; no admin UI required now).
