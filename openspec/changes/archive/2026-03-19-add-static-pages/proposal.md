## Why

The church website needs three content-driven pages — About, Next Steps, and Give — that provide visitors with essential church information, discipleship pathways, and donation options. The CMS schemas and hooks for the underlying content types (`siteSettings`, `nextStep`, `givingOption`) were established in the `setup-sanity-cms` change. This change builds the UI pages.

## What Changes

- Create `/acerca` page displaying church description, location, and service times from CMS `siteSettings`
- Create `/siguientes-pasos` page displaying a grid of action cards from CMS `nextStep` documents
- Create `/dar` page displaying giving options with bank account details, Nequi/Daviplata info, and QR code images from CMS `givingOption` documents
- Create `StepCard` component for next step action cards
- Create `GivingOptionCard` component for payment methods with QR codes

## Capabilities

### New Capabilities
- `about-page`: About page displaying church description, location, and service times from CMS
- `next-steps-page`: Next steps page displaying ordered action cards with icons and CTAs from CMS
- `giving-page`: Giving page displaying payment method cards with bank details, QR codes, and instructions from CMS

### Modified Capabilities

## Impact

- **New files**: `src/routes/acerca.tsx`, `src/routes/siguientes-pasos.tsx`, `src/routes/dar.tsx`, `src/components/next-steps/StepCard.tsx`, `src/components/give/GivingOptionCard.tsx`
- **No existing files modified** — entirely additive
- **No new dependencies** — uses existing CMS hooks, Tailwind CSS, lucide-react icons
- **Depends on**: `setup-sanity-cms` (CMS hooks), `add-site-layout` (Navbar/Footer)
- **Bundle size**: Minimal — each page is a small route that fetches CMS data. Auto-code-split by TanStack Router.
