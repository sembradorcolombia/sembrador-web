# Design: Rename "Siguientes Pasos" to "Conectar"

## Context

The `/siguientes-pasos` page displays action cards sourced from the Sanity `nextStep` document type (`fetchNextSteps` → `useNextSteps` → `StepCard`). Cards whose `consolidationStep` field matches a consolidation option link to `/consolidacion?paso=<value>`, where the registration form pre-selects a "Paso a seguir" (`NEXT_STEP_OPTIONS` Zod enum). The section is linked from the Navbar, Footer, and the homepage `NextStepsPreview` section. The church is rebranding this section as "Conectar".

The Sanity Studio is a **separate project**; its schema change and content migration are tracked here as coordinated work but executed in the Studio repo.

## Goals / Non-Goals

**Goals:**
- Route moves to `/conectar`; old `/siguientes-pasos` URL keeps working via redirect.
- All user-facing copy uses "Conectar" branding (page, nav, footer, homepage preview, consolidation form selector).
- Code identifiers consistently use "connect" terminology (route file, components, hook, service function, CMS type, query key, Zod constant/type).
- Sanity document type renamed `nextStep` → `connectStep` with existing content migrated.

**Non-Goals:**
- Changing the Supabase schema: `consolidation_registrations.next_step` column and `p_next_step` RPC param keep their names (no DB migration).
- Renaming the consolidation form's internal Zod field `nextStep` (it maps 1:1 to the DB column; renaming adds mapping indirection for no user benefit).
- Changing consolidation option values ("Comunidades misionales", "Discipulado 1:1", "Consejería") or the `?paso=` search param name.
- Redesigning the page UI/layout — pure rename, same components and styles.

## Decisions

### 1. New route file `src/routes/conectar.tsx`; old file becomes a redirect

Rename `siguientes-pasos.tsx` → `conectar.tsx` (component `ConectarPage`, `createFileRoute("/conectar")`). Replace the old `siguientes-pasos.tsx` content with a `beforeLoad` redirect, following the existing `src/routes/equilibrio/index.tsx` legacy-redirect pattern:

```tsx
export const Route = createFileRoute("/siguientes-pasos")({
  beforeLoad: () => {
    throw redirect({ to: "/conectar" });
  },
  component: () => null,
});
```

`routeTree.gen.ts` regenerates automatically on `pnpm dev`/`pnpm build`. No hosting-level redirect config exists in the repo, so a client-side route redirect is the established mechanism (spec: `legacy-event-redirects`).

**Alternative considered:** deleting the old route without a redirect. Rejected — breaks shared links and any indexed SEO URLs.

### 2. User-facing copy

| Location | Before | After |
|---|---|---|
| Page H1 / SEO title | "Siguientes Pasos" | "Conectar" |
| Page header subtitle | "Caminos para crecer en tu fe y conectarte..." | "Caminos para crecer en tu fe y conectarte con nuestra comunidad" (keep, already on-brand) |
| SEO description | "...los siguientes pasos en tu camino de fe..." | "Descubre cómo conectarte y crecer en tu fe con la iglesia El Sembrador Colombia." |
| Navbar / Footer label | "Siguientes Pasos" | "Conectar" |
| Homepage preview H2 | "Siguientes Pasos" | "Conectar" |
| Consolidation selector label | "Paso a seguir" | "¿Cómo quieres conectar?" |
| Selector placeholder | "-- Selecciona un paso --" | "-- Selecciona una opción --" |
| Selector validation message | "Debes seleccionar un paso" | "Debes seleccionar una opción" |
| Error state on page | "No pudimos cargar los pasos..." | "No pudimos cargar la información en este momento." |

### 3. Code identifier renames (English identifiers, Spanish UI text — existing convention)

- `src/components/next-steps/StepCard.tsx` → `src/components/connect/ConnectCard.tsx` (`StepCard` → `ConnectCard`, props `step` → keep field access via renamed type)
- `src/components/home/NextStepsPreview.tsx` → `src/components/home/ConnectPreview.tsx`
- `src/lib/hooks/useNextSteps.ts` → `src/lib/hooks/useConnectSteps.ts` (`useConnectSteps`, query key `["cms", "connectSteps"]`)
- `src/lib/services/cms.ts`: `fetchNextSteps` → `fetchConnectSteps`; GROQ `*[_type == "nextStep"]` → `*[_type == "connectStep"]`
- `src/lib/types/cms.ts`: `CmsNextStep` → `CmsConnectStep`
- `src/lib/validations/consolidation.ts`: `NEXT_STEP_OPTIONS` → `CONNECT_OPTIONS`, `NextStepOption` → `ConnectOption`
- Internal form field name `nextStep` and RPC param `p_next_step` stay (DB contract).

**Alternative considered:** renaming the Zod field and DB column too. Rejected — requires a Supabase migration and RPC redeploy with zero user-facing benefit; the data still represents the selected option regardless of its column name.

### 4. Sanity Studio: rename type `nextStep` → `connectStep` + content migration

In the Studio project: rename `schemaTypes/nextStep.ts` → `connectStep.ts` with `name: "connectStep"` and title "Conectar". Migrate existing documents by changing their `_type` (Sanity CLI migration or dataset export/transform/import), then update the web GROQ query in the same deploy window.

Field names inside the document (`title`, `description`, `icon`, `ctaText`, `ctaLink`, `consolidationStep`, `order`) are unchanged — only `_type` changes — so the migration is mechanical and the frontend projection needs no field-level edits.

**Alternative considered:** keeping `nextStep` as the type name and only rebranding the UI. Rejected — the user explicitly asked for the Sanity schema rename; leaving it would perpetuate the old terminology for editors.

### 5. Tests and docs

- Unit: `src/routes/__tests__/-static-pages.test.tsx` — update imports `../siguientes-pasos` → `../conectar`, mock `@/lib/hooks/useConnectSteps`.
- E2E: `e2e/cms-content.spec.ts` — `page.goto("/conectar")`; optionally assert `/siguientes-pasos` redirects.
- Docs: update `docs/add-consolidation-option.md` (`/siguientes-pasos` → `/conectar`, `nextStep.ts` → `connectStep.ts`) and the `CLAUDE.md` route table and project structure (components dir, hook names).

## Risks / Trade-offs

- [Studio deploy skew: web app querying `connectStep` before the Studio migration runs → page renders empty state] → Coordinate deploys: publish Studio schema + migration first, then deploy web. The empty state ("Próximamente tendremos más información") is a graceful degradation, and the legacy redirect keeps old links functional.
- [External sites/Google still link to `/siguientes-pasos`] → Client-side redirect route preserves them; GA4 will show traffic shifting from old path to `/conectar` over time.
- [Rename churn breaks an import somewhere] → TypeScript strict mode + `pnpm build` (tsc) catches all stale references; unit tests and Biome run pre-commit.
- [`consolidationStep` field name retains "step" terminology] → Accepted trade-off: renaming it would require a second field-level CMS migration and GROQ/type updates; its meaning is tied to the consolidation form, not the page branding.

## Migration Plan

1. **Studio (separate repo)**: rename schema type, migrate documents' `_type` to `connectStep`, publish.
2. **Web (this change)**: single PR with route rename + redirect, code renames, GROQ query update, copy updates, tests, docs. Deploy after step 1.
3. **Verify**: `/conectar` renders cards; `/siguientes-pasos` redirects; navbar/footer/homepage links work; `/consolidacion?paso=...` pre-selection still works from card CTAs; E2E suite green.
4. **Rollback**: revert web PR (GROQ query back to `nextStep` requires Studio type to exist — if Studio migration already ran, rollback must also restore the old type or keep both types temporarily).
