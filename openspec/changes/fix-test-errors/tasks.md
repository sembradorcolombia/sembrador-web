## 1. Polyfill Web Storage in the test setup

- [ ] 1.1 In `src/test/setup.ts`, add a minimal in-memory `Storage` implementation (`getItem`, `setItem`, `removeItem`, `clear`, `key`, `length`) backed by a `Map`, coercing keys and values to strings.
- [ ] 1.2 Install the implementation onto `window.localStorage` and `window.sessionStorage` via `Object.defineProperty(..., { configurable: true })`, only assigning when the native property is missing/undefined.
- [ ] 1.3 In the existing `afterEach`, clear both `localStorage` and `sessionStorage` so state is isolated between tests.

## 2. Verify

- [ ] 2.1 Run `pnpm test` and confirm 0 failing tests (previously 25 failing across `auth.test.ts` and `sessionPolicy.test.ts`).
- [ ] 2.2 Run `pnpm check` (Biome lint + format) and confirm `src/test/setup.ts` passes.
- [ ] 2.3 Confirm no production source files were modified (`git diff --name-only` shows only `src/test/setup.ts`).
