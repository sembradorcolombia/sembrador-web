## Context

The site already has standalone lead-capture flows (e.g. `/consolidacion`) that use TanStack Form + Zod, a service RPC into Supabase, a success route, and Spanish UI. Desayuno needs the same pattern with a simpler field set: name, last name, email, phone, and data policy — no event selector and no next-step options.

Event subscriptions (`event_subscriptions`) are tied to capacity-limited events and are the wrong model for this one-off breakfast signup.

## Goals / Non-Goals

**Goals:**

- Public `/desayuno` page with a validated registration form.
- Persist submissions in a dedicated Supabase table via SECURITY DEFINER RPC.
- Success page at `/desayuno/registro-exitoso` with confirmation copy and home link.
- Match existing form UX, validation messages, and RLS/RPC security patterns.

**Non-Goals:**

- Admin dashboard listing/export for desayuno leads (can follow later).
- Sanity CMS content for page copy/images.
- Navbar/footer nav link (page is reachable by direct URL/campaigns).
- Capacity limits, duplicate email blocking, or attendance confirmation.
- Coupling to `events` / `event_subscriptions`.

## Decisions

### 1. Dedicated table + RPC (mirror consolidation)

- **Choice:** `desayuno_registrations` table + `create_desayuno_registration` SECURITY DEFINER RPC; RLS enabled with no public policies (insert only via RPC). Optional admin SELECT policy can be added later when dashboard support lands.
- **Rationale:** Same proven pattern as `consolidation_registrations`; avoids polluting event capacity logic.
- **Alternatives considered:**
  - Reuse `event_subscriptions` with a synthetic event — rejected (capacity/attendance semantics, wrong product model).
  - Direct client insert with anon INSERT policy — rejected (weaker control than RPC; inconsistent with codebase).

**Schema (proposed):**

| Column | Type | Notes |
|--------|------|--------|
| `id` | UUID PK | `gen_random_uuid()` |
| `name` | TEXT NOT NULL | |
| `lastname` | TEXT NOT NULL | |
| `email` | TEXT NOT NULL | |
| `phone` | TEXT NOT NULL | 10-digit mobile, client-validated |
| `accepts_data_policy` | BOOLEAN NOT NULL DEFAULT FALSE | Must be true on insert path |
| `created_at` | TIMESTAMPTZ NOT NULL | `now()` |

RPC params: `p_name`, `p_lastname`, `p_email`, `p_phone`, `p_accepts_data_policy`.

### 2. Frontend layering

- **Choice:** Follow services → hooks → components:
  - `src/lib/validations/desayuno.ts` — Zod schema
  - `src/lib/services/desayuno.ts` — `createDesayunoRegistration`
  - `src/lib/hooks/useCreateDesayunoRegistration.ts` — TanStack Query mutation
  - `src/components/forms/DesayunoForm.tsx` — TanStack Form UI
  - Routes: `src/routes/desayuno/index.tsx`, `src/routes/desayuno/registro-exitoso.tsx`
- **Rationale:** Matches consolidation and subscription layers; keeps routes thin.
- **Alternatives considered:** Inline form logic in the route — rejected (harder to test/reuse).

### 3. Field naming

- **Choice:** Form/API fields `name`, `lastname`, `email`, `phone`, `acceptsDataPolicy` (DB: `phone`, not `mobile`).
- **Rationale:** User asked for phone; consolidation uses `mobile` for historical reasons — prefer clearer `phone` for the new table while keeping Spanish labels (`Nombre`, `Apellido`, `Correo electrónico`, `Teléfono` / `Celular`).
- **Validation:** Reuse `emailSchema`; name/lastname min 2 / max 100; phone `/^[0-9]{10}$/`; `acceptsDataPolicy` literal `true`.

### 4. Success UX and analytics

- **Choice:** Navigate to `/desayuno/registro-exitoso` on success; fire Meta Pixel `trackCustom("DesayunoSuccess")` if `fbq` is available; "Volver" → `/`.
- **Rationale:** Parity with consolidation success flow.

### 5. Page presentation

- **Choice:** Same layout shell as consolidación: secondary header band with title/subtitle, white form section, `SeoHead` with Spanish title/description. Form uses existing UI primitives (`Input`, `Label`, `Button`) and link to `/politica-de-datos`.
- **Rationale:** Visual consistency without new design system work.

### 6. Types regeneration

- **Choice:** After migration is applied, regenerate `src/lib/database.types.ts` via project Supabase tooling (do not hand-edit).
- **Rationale:** Generated file is the source of truth for table/RPC types.

## Risks / Trade-offs

- **[Risk] No admin visibility at launch** → Mitigation: table is queryable in Supabase Studio; follow-up change can add dashboard tab + SELECT policy like consolidation.
- **[Risk] Duplicate registrations allowed** → Mitigation: Accept for v1 (campaigns often resubmit); unique email constraint can be added later if product requires it.
- **[Risk] Migration not applied in remote env before deploy** → Mitigation: Ship migration with the PR; document apply order; frontend error toast if RPC missing.
- **[Risk] Phone stored as free text** → Mitigation: Client Zod enforces 10 digits; RPC trusts client like consolidation (no server-side format check required for v1).

## Migration Plan

1. Add SQL migration under `supabase/migrations/` creating table, RLS, and RPC.
2. Apply migration to target Supabase project(s).
3. Regenerate `database.types.ts`.
4. Ship frontend routes/form/service/hook.
5. Smoke-test submit → success page → row in table.

**Rollback:** Remove routes/frontend code; drop RPC + table via reverse migration if needed. No data backfill required.

## Open Questions

- Exact marketing title/subtitle copy for the header (default: "Desayuno" / short Spanish invite line) — finalize at implement time if stakeholders provide copy.
- Whether phone label is "Teléfono" or "Celular" — default "Celular" for Colombian consistency with consolidation.
