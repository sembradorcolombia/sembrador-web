## Context

The test config (`vitest.config.ts`) uses `environment: "jsdom"` with `setupFiles: ["src/test/setup.ts"]`. jsdom exposes a document URL of `http://localhost:3000/` (a non-opaque origin), yet under jsdom 27.4.0 `window.localStorage` resolves to `undefined`. Any suite that touches storage in `beforeEach` — `auth.test.ts` and `sessionPolicy.test.ts`, which call `window.localStorage.clear()` — throws `TypeError: Cannot read properties of undefined (reading 'clear')` before a single assertion runs. This was verified with a probe test that logged `URL: http://localhost:3000/` and `localStorage typeof: undefined`.

The application code (`sessionPolicy.ts`) reads and writes `window.localStorage` directly and is correct; the gap is purely in the test environment.

## Goals / Non-Goals

**Goals:**
- Make `window.localStorage` and `window.sessionStorage` available and functional in the jsdom test environment.
- Isolate storage between tests so state never leaks.
- Fix all 25 failing tests with a change confined to test setup — zero production code changes.

**Non-Goals:**
- Changing session/auth behavior or the source files under test.
- Upgrading, downgrading, or swapping the jsdom/vitest versions.
- Adding new runtime dependencies.

## Decisions

- **Polyfill storage in `src/test/setup.ts`** with a small in-memory `Storage` implementation assigned to `window.localStorage` and `window.sessionStorage`. This is version-independent — it does not rely on jsdom eventually providing storage — and keeps the fix in the single shared setup file already loaded by every suite.
- **Implement the full Web Storage surface** (`getItem`, `setItem`, `removeItem`, `clear`, `key`, `length`) backed by a `Map`, matching what `sessionPolicy.ts` uses (`getItem`/`setItem`/`removeItem`) plus `clear`/`key`/`length` for completeness.
- **Reset storage in the existing `afterEach`** (which already calls `cleanup()`), clearing both stores so each test starts empty — satisfying the isolation requirement without touching individual suites.
- Define storage with `Object.defineProperty(window, ...)` using `configurable: true` so it is robust if jsdom does define a (read-only) property in some environments.

## Risks / Trade-offs

- **Divergence from real browser Storage semantics:** the in-memory shim coerces values to strings on `setItem` (as the spec requires) but is otherwise minimal. Acceptable — tests only need get/set/remove/clear.
- **Masking a future real fix:** if a later jsdom version restores native storage, the polyfill still wins. Low risk and harmless; can be revisited during a dependency upgrade.
- **Scope creep:** none — the change is one file and adds no dependencies.
