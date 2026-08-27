## ADDED Requirements

### Requirement: Unit tests have a working Web Storage API
The jsdom-based Vitest environment SHALL expose functional `window.localStorage` and `window.sessionStorage` objects implementing the standard Web Storage API (`getItem`, `setItem`, `removeItem`, `clear`, `key`, and `length`), so that code and tests relying on browser storage run correctly.

#### Scenario: Storage is defined in the test environment
- **WHEN** a test accesses `window.localStorage` or `window.sessionStorage`
- **THEN** the object is defined and its `getItem`/`setItem`/`removeItem`/`clear` methods are callable without throwing

#### Scenario: Values persist within a test and read back
- **WHEN** a test writes a value with `localStorage.setItem(key, value)` and later reads it with `localStorage.getItem(key)`
- **THEN** the stored value is returned unchanged

### Requirement: Storage is isolated between tests
Each test SHALL start with empty storage so that state written by one test cannot leak into another.

#### Scenario: Storage cleared between tests
- **WHEN** one test writes to `localStorage` and a subsequent test reads the same key
- **THEN** the subsequent test observes no value from the earlier test
