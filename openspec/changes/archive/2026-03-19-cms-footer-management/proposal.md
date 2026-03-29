## Why

The website footer currently contains hardcoded data (church name, address, service times, social links, contact info), making it impossible for content editors to update this information without a code deployment. Since the site already uses Sanity CMS for global site settings, extending it to cover footer content is a natural, consistent solution.

## What Changes

- Extend the `siteSettings` Sanity schema to include footer-specific fields: address, service times, contact information, and social links (if not already covered)
- Create a `useSiteSettings` hook extension (or update the existing one) to include footer fields in the GROQ query
- Update the `Footer` component to render data from Sanity instead of hardcoded values
- Ensure the CMS service layer fetches and types the new footer fields correctly

## Capabilities

### New Capabilities

- `cms-footer-content`: Allows content editors to manage footer information (address, service times, phone/email, social links) via the Sanity CMS `siteSettings` singleton document

### Modified Capabilities

- `site-navigation`: The Footer requirement currently renders static church info; it will now render CMS-managed content from Sanity. Requirement language needs to reflect that footer data is dynamic.
- `cms-content-schemas`: The `siteSettings` schema will gain additional footer fields (address, serviceSchedule, contactPhone, contactEmail) beyond `socialLinks` which already exists.

## Impact

- **Sanity schema**: `siteSettings` document type gains new fields — no breaking changes, fields are optional with existing content unaffected
- **`src/lib/types/cms.ts`**: `CmsSiteSettings` type gains footer-related fields
- **`src/lib/services/cms.ts`**: GROQ query for `siteSettings` expands to fetch footer fields
- **`src/lib/hooks/useSiteSettings.ts`**: No interface change; data returned will include new fields
- **`src/components/Footer.tsx`** (or equivalent): Refactored to consume CMS data instead of hardcoded strings
- **No new npm dependencies** required
- **No new routes** required
- **Bundle size**: Negligible impact — existing Sanity client already in use
