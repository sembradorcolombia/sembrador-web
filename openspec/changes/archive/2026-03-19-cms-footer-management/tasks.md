## 1. Sanity Schema

- [x] 1.1 Add `footerTagline` (string, optional) field to the `siteSettings` schema in the Sanity Studio project
- [x] 1.2 Add `address` (string, optional) field to the `siteSettings` schema
- [x] 1.3 Add `contactPhone` (string, optional) field to the `siteSettings` schema
- [x] 1.4 Add `contactEmail` (string, optional) field to the `siteSettings` schema
- [x] 1.5 Deploy updated schema to Sanity and verify fields appear in Studio

## 2. TypeScript Types

- [x] 2.1 Add `footerTagline?: string`, `address?: string`, `contactPhone?: string`, `contactEmail?: string` fields to `CmsSiteSettings` in `src/lib/types/cms.ts`

## 3. CMS Service Layer

- [x] 3.1 Update the GROQ projection in `fetchSiteSettings()` in `src/lib/services/cms.ts` to include the four new footer fields

## 4. Footer Component Refactor

- [x] 4.1 Import and call `useSiteSettings()` in `src/components/layout/Footer.tsx`
- [x] 4.2 Replace hardcoded church description with `siteSettings?.footerTagline` (fallback: `"Iglesia El Sembrador Colombia"`)
- [x] 4.3 Add platform-to-icon mapping object (`instagram` → `Instagram`, `youtube` → `Youtube`, `facebook` → `Facebook`, `tiktok` → `Music2` or equivalent Lucide icon)
- [x] 4.4 Replace hardcoded `SOCIAL_LINKS` constant with dynamic rendering from `siteSettings?.socialLinks`, filtering to known platforms and mapping to icons
- [x] 4.5 Remove unused `SOCIAL_LINKS` constant and unused static imports after refactor
- [x] 4.6 Verify footer renders correctly when `useSiteSettings` data is `undefined` (loading/error state)

## 5. Quality & Verification

- [x] 5.1 Run `pnpm check` (Biome lint + format) and fix any issues
- [x] 5.2 Run `pnpm build` to verify TypeScript type-check passes with no errors
- [x] 5.3 Populate footer fields in Sanity Studio and verify they render correctly in the browser
- [x] 5.4 Verify social links open in a new tab with correct URLs from CMS
- [x] 5.5 Verify footer renders correctly when CMS fields are empty (fallback behavior)
