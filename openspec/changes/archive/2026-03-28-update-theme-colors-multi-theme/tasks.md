## 1. CSS Theme Tokens

- [x] 1.1 Replace the `@theme` block in `src/styles.css` with the El Sembrador brand palette (`--color-primary: #26466d`, `--color-primary-dark: #1b4974`, `--color-secondary: #3479bc`, `--color-secondary-dark: #239650`, plus accent/green/gray/dark tokens)
- [x] 1.2 Add a `[data-theme="equilibrio"]` override block in `src/styles.css` that restores the old pink/purple values (`--color-primary: #FF2D77`, `--color-primary-dark: #CC245F`, `--color-secondary: #1D13BD`, `--color-secondary-dark: #100A66`)

## 2. Equilibrio Route Theme Boundary

- [x] 2.1 In the `$seriesSlug` layout route (find the correct file in `src/routes/eventos/`), wrap the `<Outlet />` with a `<div data-theme={params.seriesSlug === "equilibrio" ? "equilibrio" : undefined}>` container

## 3. Verification

- [x] 3.1 Run `pnpm build` to confirm no TypeScript errors
- [x] 3.2 Run `pnpm check` (Biome lint + format) and fix any issues
- [x] 3.3 Start `pnpm dev` and visually verify the home page, blog, and dashboard use the dark-blue brand palette
- [x] 3.4 Visually verify `/eventos/equilibrio` renders with pink/purple palette
- [x] 3.5 Visually verify navigating away from `/eventos/equilibrio` (e.g., to home) restores the brand palette
- [x] 3.6 Run `pnpm test` to confirm unit tests pass
