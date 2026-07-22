# How to Add a New Consolidation Option — El Sembrador

This guide walks through adding a new option (e.g., "Voluntariado") to the consolidation flow: the `/consolidacion` registration form and the `/conectar` cards that route to it.

A consolidation option touches **three places**, in this order:

1. Studio schema (`sembrador-studio`) — makes the option selectable in the CMS
2. Web code (`sembrador-web`) — makes the option valid in the form
3. CMS content (Studio UI) — flags the card that should route to the form

No database changes are needed: the `next_step` column in `consolidation_registrations` is free `TEXT`.

---

## 1. Studio schema (`sembrador-studio`)

Add the option to the `consolidationStep` field in `schemaTypes/connectStep.ts`:

```ts
options: {
  list: [
    {title: 'Comunidades misionales', value: 'Comunidades misionales'},
    {title: 'Discipulado 1:1', value: 'Discipulado 1:1'},
    {title: 'Consejería', value: 'Consejería'},
    {title: 'Voluntariado', value: 'Voluntariado'}, // ← new option
  ],
  layout: 'radio',
},
```

Deploy the Studio:

```bash
cd sembrador-studio
pnpm deploy
```

## 2. Web code (`sembrador-web`)

Add the **exact same value** to `CONNECT_OPTIONS` in `src/lib/validations/consolidation.ts`:

```ts
export const CONNECT_OPTIONS = [
	"Comunidades misionales",
	"Discipulado 1:1",
	"Consejería",
	"Voluntariado", // ← must match the Studio value exactly
] as const;
```

Nothing else needs to change — everything derives from this constant:

- The form's "¿Cómo quieres conectar?" select options
- The Zod `nextStep` enum validation
- The `?paso=` search-param validation on `/consolidacion`
- The `ConnectCard` matching that routes cards to the form

Verify and deploy:

```bash
cd sembrador-web
pnpm check && pnpm build && pnpm test
```

## 3. CMS content (Studio UI)

1. Open the **Conectar** document for the new initiative (or create it)
2. Set **"Paso de consolidación"** to the new option
3. Publish the document

The card's CTA now routes to `/consolidacion?paso=<option>` and its **"Enlace del botón"** (`ctaLink`) is ignored. Cards without the field keep using `ctaLink` as before.

## 4. Verify

1. Go to `/conectar` → the card's CTA links to `/consolidacion?paso=<option>`
2. The form opens with the new step pre-selected
3. Submit a test registration → a row appears in the `consolidation_registrations` Supabase table with `next_step` = the new option

---

## Important notes

- **Values must match exactly** between the Studio schema and `CONNECT_OPTIONS` — including capitalization and accents ("Consejería" ≠ "Consejeria"). Matching is exact and case-sensitive. Whatever the form submits is stored verbatim in the database, so consistent values matter for follow-up and reporting.
- **Ordering matters if you deploy gradually.** If a CMS document has `consolidationStep` set to a value the deployed web app doesn't know yet, the card silently falls back to `ctaLink`. Deploy the web change before (or at the same time as) publishing the document.
- **Renaming an option** is the same operation in reverse: update both the Studio schema and `CONNECT_OPTIONS`, then update the documents. Existing registrations in the database keep the old `next_step` value.
