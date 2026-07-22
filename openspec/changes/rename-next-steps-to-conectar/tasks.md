# Tasks: Rename "Siguientes Pasos" to "Conectar"

## 1. Sanity Studio (separate project — coordinate deploy)

- [x] 1.1 In the Studio repo, rename `schemaTypes/nextStep.ts` → `schemaTypes/connectStep.ts` with `name: "connectStep"` and title "Conectar"; update the schema index registration
- [x] 1.2 Migrate existing documents' `_type` from `nextStep` to `connectStep` (Sanity CLI migration or export/transform/import), preserving all field values
- [x] 1.3 Publish/deploy the Studio change and verify documents appear under "Conectar" in the Studio

## 2. Route rename and redirect

- [x] 2.1 Rename `src/routes/siguientes-pasos.tsx` → `src/routes/conectar.tsx`; update `createFileRoute("/conectar")`, rename component to `ConectarPage`, update imports to `ConnectCard` / `useConnectSteps`
- [x] 2.2 Update `/conectar` page copy: H1 "Conectar", `SeoHead` title "Conectar" and description "Descubre cómo conectarte y crecer en tu fe con la iglesia El Sembrador Colombia.", error state "No pudimos cargar la información en este momento."
- [x] 2.3 Recreate `src/routes/siguientes-pasos.tsx` as a legacy redirect route (`beforeLoad` throwing `redirect({ to: "/conectar" })`, `component: () => null`), following the `src/routes/equilibrio/index.tsx` pattern
- [x] 2.4 Verify `src/routeTree.gen.ts` regenerates with both `/conectar` and `/siguientes-pasos` routes (run `pnpm dev` or `pnpm build`)

## 3. Code renames (lib + components)

- [x] 3.1 `src/lib/validations/consolidation.ts`: rename `NEXT_STEP_OPTIONS` → `CONNECT_OPTIONS`, `NextStepOption` → `ConnectOption`; update `nextStep` enum error message to "Debes seleccionar una opción" (field name `nextStep` stays — DB contract)
- [x] 3.2 `src/lib/types/cms.ts`: rename `CmsNextStep` → `CmsConnectStep`
- [x] 3.3 `src/lib/services/cms.ts`: rename `fetchNextSteps` → `fetchConnectSteps`; change GROQ `*[_type == "nextStep"]` → `*[_type == "connectStep"]`
- [x] 3.4 Rename `src/lib/hooks/useNextSteps.ts` → `src/lib/hooks/useConnectSteps.ts` (`useConnectSteps`, query key `["cms", "connectSteps"]`)
- [x] 3.5 Rename `src/components/next-steps/StepCard.tsx` → `src/components/connect/ConnectCard.tsx` (`ConnectCard`, updated imports); remove the old `src/components/next-steps/` directory
- [x] 3.6 Rename `src/components/home/NextStepsPreview.tsx` → `src/components/home/ConnectPreview.tsx`; heading "Conectar"; both "Ver más" links point to `/conectar`
- [x] 3.7 Update `src/routes/index.tsx` to import/use `ConnectPreview`

## 4. Navigation and form copy

- [x] 4.1 `src/components/layout/Navbar.tsx`: link label "Siguientes Pasos" → "Conectar", `to: "/conectar"`
- [x] 4.2 `src/components/layout/Footer.tsx`: link label "Siguientes Pasos" → "Conectar", `to: "/conectar"`
- [x] 4.3 `src/components/forms/ConsolidationForm.tsx`: selector label "Paso a seguir" → "¿Cómo quieres conectar?", placeholder "-- Selecciona una opción --", validation fallback "Debes seleccionar una opción"; update `NEXT_STEP_OPTIONS` import to `CONNECT_OPTIONS`

## 5. Tests and docs

- [x] 5.1 `src/routes/__tests__/-static-pages.test.tsx`: update imports to `../conectar`, mock `@/lib/hooks/useConnectSteps`, update descriptions
- [x] 5.2 `e2e/cms-content.spec.ts`: `page.goto("/conectar")`; add assertion that `/siguientes-pasos` redirects to `/conectar`
- [x] 5.3 Update `docs/add-consolidation-option.md` (`/siguientes-pasos` → `/conectar`, `nextStep.ts` → `connectStep.ts`, `consolidationStep` references)
- [x] 5.4 Update `CLAUDE.md`: route table row (`/conectar` | `conectar.tsx`), project structure (components/connect, useConnectSteps, CmsConnectStep)

## 6. Verification

- [x] 6.1 `pnpm check` (Biome lint + format) passes
- [x] 6.2 `pnpm test` (Vitest) passes
- [x] 6.3 `pnpm build` passes (includes `tsc` type-check — catches stale imports)
- [x] 6.4 `pnpm test:e2e` passes (after Studio migration is live)
- [x] 6.5 Manual smoke test: `/conectar` renders cards; `/siguientes-pasos` redirects; Navbar/Footer/homepage links work; card CTA with `consolidationStep` navigates to `/consolidacion?paso=...` with the selector pre-selected
