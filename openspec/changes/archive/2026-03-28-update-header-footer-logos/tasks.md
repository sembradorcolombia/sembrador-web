## 1. Update Navbar Logo

- [x] 1.1 In `src/components/layout/Navbar.tsx`, change the logo `<img src>` from `/header-logo.svg` to `/brand/logo-el-sembrador-h.svg`

## 2. Update Footer Logo

- [x] 2.1 In `src/components/layout/Footer.tsx`, change the logo `<img src>` from `/header-logo.svg` to `/brand/logo-el-sembrador-hw.svg`
- [x] 2.2 Remove the `brightness-0 invert` classes from the footer logo `<img>` (no longer needed with the white SVG variant)

## 3. Verification

- [x] 3.1 Run `pnpm build` to confirm no TypeScript errors
- [x] 3.2 Run `pnpm check` (Biome lint + format) and fix any issues
- [x] 3.3 Start `pnpm dev` and visually verify the colored logo appears in the Navbar on a white background
- [x] 3.4 Visually verify the white logo appears correctly in the Footer on the dark background
