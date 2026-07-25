# Rename "Siguientes Pasos" to "Conectar"

## Why

The church wants to rebrand the "Siguientes Pasos" (next steps) section as "Conectar" to better communicate its purpose: helping visitors connect with the community. The current name and all its supporting code, CMS schema, routes, and form wording use "siguientes pasos" / "next steps" terminology and must be renamed consistently to avoid a fragmented user experience.

## What Changes

- **BREAKING (URL)**: Move the page from `/siguientes-pasos` to `/conectar` (`src/routes/siguientes-pasos.tsx` → `src/routes/conectar.tsx`); add a legacy redirect from `/siguientes-pasos` → `/conectar` to preserve shared links and SEO (following the `legacy-event-redirects` precedent).
- Update all user-facing copy: page H1 and SEO title/description, Navbar and Footer link labels ("Siguientes Pasos" → "Conectar"), homepage preview section heading and "Ver más" link.
- Update the consolidation form (`/consolidacion`) selector wording: label "Paso a seguir" → "¿Cómo quieres conectar?", placeholder and validation messages drop "paso" wording.
- Rename frontend code identifiers: `NEXT_STEP_OPTIONS` → `CONNECT_OPTIONS`, `NextStepOption` → `ConnectOption`, `CmsNextStep` → `CmsConnectStep`, `fetchNextSteps` → `fetchConnectSteps`, `useNextSteps` → `useConnectSteps`, `NextStepsPreview` → `ConnectPreview`, `StepCard` → `ConnectCard` (`src/components/next-steps/` → `src/components/connect/`), TanStack Query key `["cms", "nextSteps"]` → `["cms", "connectSteps"]`.
- **BREAKING (CMS)**: Rename the Sanity Studio document type `nextStep` → `connectStep` (separate Studio project) and migrate existing documents; update the GROQ query in `src/lib/services/cms.ts` accordingly.
- Update tests (unit `-static-pages.test.tsx`, E2E `cms-content.spec.ts`), `docs/add-consolidation-option.md`, and the `CLAUDE.md` route table.
- The Supabase contract stays unchanged: `consolidation_registrations.next_step` column, `p_next_step` RPC param, and the form's internal Zod field name `nextStep` remain as-is (documented decision in design).

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `next-steps-page`: Page moves to `/conectar` and is rebranded "Conectar"; legacy `/siguientes-pasos` URL redirects to `/conectar`; cards sourced from renamed `connectStep` CMS type.
- `site-navigation`: Navbar and Footer link label changes from "Siguientes Pasos" to "Conectar" and points to `/conectar`.
- `homepage`: Next steps preview section heading/link updated to "Conectar" branding and `/conectar` route.
- `consolidation-registration`: Selector label and validation copy drop "paso" wording in favor of "conectar" wording.
- `cms-content-schemas`: Sanity document type renamed from `nextStep` to `connectStep` (Studio change + content migration).
- `cms-content-delivery`: Fetch requirement renamed from next step cards to connect cards (type, hook, query key).
- `analytics-tracking`: Route references updated from `/siguientes-pasos` to `/conectar` in tracking scenarios.

## Impact

- **Routes**: `/siguientes-pasos` becomes `/conectar`; one new redirect route file; `routeTree.gen.ts` auto-regenerates.
- **Code**: ~15 files touched across `src/routes/`, `src/components/` (layout, home, next-steps→connect, forms), `src/lib/` (hooks, services, types, validations).
- **CMS (Sanity Studio, separate project)**: schema type rename `nextStep` → `connectStep` plus a content migration of existing documents; **deployment order matters** — the web app GROQ query change must deploy together with (or after) the Studio schema migration, or the page will render empty.
- **Supabase**: no changes (DB column `next_step` and RPC param `p_next_step` stay).
- **Analytics**: GA4 page_view path changes to `/conectar`; historical data for `/siguientes-pasos` remains under the old path.
- **Dependencies**: no new npm packages.
- **Bundle**: negligible — file renames only; TanStack Router auto code-splitting unchanged.
