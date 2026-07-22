## Context

The `/siguientes-pasos` page displays next-step cards sourced from Sanity CMS (`CmsNextStep`). Each card has a CTA link, but there is currently no way for visitors to register their interest in steps like "Comunidades misionales", "Discipulado 1:1", or "Consejería". The church needs a consolidation flow to capture visitor contact data and route them to the right ministry for pastoral follow-up.

The app already has well-established patterns for this kind of flow:
- **Forms**: TanStack Form + Zod 4 with `form.Field` and `validators.onChange` (see `SubscriptionForm`)
- **Persistence**: Supabase RPC functions called from service layer functions in `src/lib/services/`
- **Mutations**: TanStack Query `useMutation` hooks wrapping service calls
- **Success pages**: Centered message on `bg-secondary` with a "Volver" link (see `registro-exitoso.tsx`)

## Goals / Non-Goals

**Goals:**
- Capture visitor registration data (name, lastname, mobile, email, next step, comment, data policy acceptance) in a new Supabase table
- Pre-select the next step in the form based on which card CTA was clicked on `/siguientes-pasos`
- Follow existing code patterns exactly (services → hooks → components)
- Keep all user-facing text in Spanish

**Non-Goals:**
- Admin dashboard view for consolidation records (can be added later)
- Email notifications to staff on new registrations (can be added later)
- CMS-driven step options (options are hardcoded; CMS steps only determine which CTA routes here)
- Authentication — the form is public/anonymous

## Decisions

### 1. New Supabase table `consolidation_registrations` (not reusing `event_subscriptions`)

The consolidation data model is fundamentally different from event subscriptions: no event FK, no capacity, no attendance tracking, no confirmation token. A separate table keeps concerns isolated and avoids polluting the event subscription schema with nullable columns that don't apply.

| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `name` | `text` | NOT NULL |
| `lastname` | `text` | NOT NULL |
| `mobile` | `text` | NOT NULL |
| `email` | `text` | NOT NULL |
| `next_step` | `text` | NOT NULL |
| `comment` | `text` | nullable |
| `accepts_data_policy` | `boolean` | NOT NULL, default `false` |
| `created_at` | `timestamptz` | NOT NULL, default `now()` |

RLS enabled; anonymous INSERT allowed only through the `create_consolidation_registration` RPC function (`SECURITY DEFINER`). No public read access.

### 2. RPC function over direct table insert

Following the existing pattern (`create_subscription_with_increment`, `save_connection_response`, etc.), inserts go through an RPC function rather than direct `.from().insert()`. This keeps RLS simple (no direct table grants to `anon`) and centralizes write logic in the database.

```sql
CREATE FUNCTION create_consolidation_registration(
  p_name TEXT,
  p_lastname TEXT,
  p_mobile TEXT,
  p_email TEXT,
  p_next_step TEXT,
  p_comment TEXT DEFAULT NULL,
  p_accepts_data_policy BOOLEAN
) RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO consolidation_registrations
    (name, lastname, mobile, email, next_step, comment, accepts_data_policy)
  VALUES
    (p_name, p_lastname, p_mobile, p_email, p_next_step, p_comment, p_accepts_data_policy);
END;
$$;
```

### 3. Hardcoded step options (not CMS-driven)

The three consolidation options ("Comunidades misionales", "Discipulado 1:1", "Consejería") are defined as a constant in the validation schema:

```ts
export const NEXT_STEP_OPTIONS = [
  "Comunidades misionales",
  "Discipulado 1:1",
  "Consejería",
] as const;
```

The `nextStep` field uses `z.enum(NEXT_STEP_OPTIONS)`. Hardcoding keeps the form self-contained and type-safe; the CMS `nextStep` documents only control which cards route to `/consolidacion` (matched by title).

### 4. Step pre-selection via `?paso=` search param

`/siguientes-pasos` cards whose title matches a consolidation step link to `/consolidacion?paso=<step-title>`. The form page reads the search param via TanStack Router's `validateSearch` and passes it as `defaultNextStep` to the form. If the param is missing or invalid, the selector shows the empty placeholder.

### 5. Extract shared email validation to `src/lib/validations/email.ts`

The email validation logic (disposable domain blocklist, test local-part blocklist, repeated-char pattern check) currently lives inline in `subscription.ts`. It will be extracted into a shared `emailSchema` in `src/lib/validations/email.ts` and imported by both `subscription.ts` and the new `consolidation.ts`. This avoids duplication without changing existing subscription behavior.

### 6. StepCard detects consolidation steps by title

`StepCard` checks if `step.title` matches one of the consolidation options. If so, it renders a TanStack Router `<Link to="/consolidacion" search={{ paso: step.title }}>` instead of an `<a href={step.ctaLink}>`. This keeps CMS content flexible (no schema change needed in Sanity) while routing the right cards to the new flow.

**Alternative considered:** updating the CMS `ctaLink` values to point to `/consolidacion?paso=...` directly. Rejected because it couples CMS content to frontend URL structure and loses type-safe search param handling.

### 7. Route structure: flat files under `src/routes/consolidacion/`

```
src/routes/consolidacion/
  index.tsx              → form page (reads ?paso= search param)
  registro-exitoso.tsx   → success page
```

No layout route file needed — the default root layout (Navbar/Footer) applies, consistent with `/siguientes-pasos`. TanStack Router auto-generates the route tree.

### 8. Success page fires Meta Pixel event

Following the `registro-exitoso.tsx` pattern, the consolidation success page fires `window.fbq("trackCustom", "ConsolidationSuccess")` on mount.

## Risks / Trade-offs

- [Step title mismatch between CMS and hardcoded options] → If a CMS step title changes (e.g., "Discipulado 1:1" → "Discipulado uno a uno"), the CTA will silently fall back to the CMS `ctaLink`. Mitigation: document the expected titles; the fallback behavior is safe (just uses the old link).
- [Spam submissions on a public unauthenticated form] → Mitigation: email validation blocks disposable/test addresses client-side; server-side rate limiting or Turnstile can be added later if abuse occurs.
- [Regenerating `database.types.ts` requires Supabase CLI access] → Mitigation: the table must be created in the Supabase project first (via SQL migration or dashboard), then types regenerated with `supabase gen types`. If CLI is unavailable, the new table types can be added manually as a stopgap (file is auto-generated but additive edits are survivable until next regen).

## Migration Plan

1. Create `consolidation_registrations` table + RPC function in Supabase (SQL migration)
2. Regenerate `src/lib/database.types.ts`
3. Deploy frontend changes (new routes, form, StepCard update)
4. Verify: navigate `/siguientes-pasos` → click "Conectar" CTA → form pre-selected → submit → success page → record visible in Supabase table

Rollback: remove routes and revert StepCard; table can remain in place harmlessly.
