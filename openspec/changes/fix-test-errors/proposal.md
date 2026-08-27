## Why

The unit test suite is red: 25 tests across `auth.test.ts` and `sessionPolicy.test.ts` crash in `beforeEach` with `TypeError: Cannot read properties of undefined (reading 'clear')`. Under jsdom 27, `window.localStorage` is `undefined` even with a valid document URL, so every suite that touches session storage fails before its assertions run. This blocks the pre-commit hook and CI, which both run `pnpm test`.

## What Changes

- Provide a Web Storage (`localStorage` + `sessionStorage`) implementation in the shared Vitest setup so jsdom-based tests have a working, per-test-isolated storage backend.
- Restore all 25 failing tests to green without altering any application code or the behavior under test.
- No production code changes; the fix is confined to the test environment.

## Capabilities

### New Capabilities
- `test-environment`: Guarantees the jsdom-based unit test environment exposes a functional, isolated Web Storage API so tests exercising `localStorage`/`sessionStorage` run correctly.

### Modified Capabilities
<!-- None — no application requirements or behavior change. -->

## Impact

- **Affected code:** `src/test/setup.ts` (test setup only). No changes to `src/lib/services/auth.ts` or `src/lib/services/sessionPolicy.ts`.
- **Affected suites:** `src/lib/services/__tests__/auth.test.ts`, `src/lib/services/__tests__/sessionPolicy.test.ts`.
- **Tooling:** Unblocks `pnpm test`, the Husky pre-commit hook, and CI.
- **Dependencies:** None added.
- **Bundle size / routes:** No impact — test-only change.
