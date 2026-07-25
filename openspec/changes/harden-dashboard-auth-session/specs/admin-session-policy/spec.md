## ADDED Requirements

### Requirement: Absolute session lifetime
An admin session SHALL expire no later than 7 days after sign-in, regardless of activity. After that point the session's refresh token SHALL NOT be renewable, and the admin SHALL be required to authenticate again with credentials. This limit SHALL be enforced by the authentication provider, not only by the browser.

#### Scenario: Session expires after one week
- **WHEN** more than 7 days have passed since an admin signed in
- **THEN** the stored session SHALL no longer grant access to `/dashboard`
- **AND** the admin SHALL be required to enter their credentials again

#### Scenario: Active use does not extend past the cap
- **WHEN** an admin has used the dashboard continuously and reaches 7 days since sign-in
- **THEN** the session SHALL still expire
- **AND** continued activity SHALL NOT postpone the expiry

#### Scenario: Expiry is not bypassable from the client
- **WHEN** a client presents a refresh token issued more than 7 days earlier
- **THEN** the authentication provider SHALL reject the refresh
- **AND** no new access token SHALL be issued

#### Scenario: Session within the window still works
- **WHEN** an admin returns to `/dashboard` two days after signing in
- **THEN** the session SHALL be refreshed silently and the dashboard SHALL load without a new sign-in

### Requirement: Idle timeout
An admin session SHALL also expire after a defined period of inactivity that is shorter than the 7-day absolute cap, so an unused session does not remain valid for the full week.

#### Scenario: Unused session expires early
- **WHEN** an admin session has gone unused for longer than the configured inactivity period
- **THEN** the session SHALL be expired even though fewer than 7 days have passed since sign-in
- **AND** the admin SHALL be required to authenticate again

#### Scenario: Activity resets the idle window
- **WHEN** an admin uses the dashboard before the inactivity period elapses
- **THEN** the idle window SHALL restart
- **AND** the 7-day absolute cap SHALL remain unchanged

### Requirement: Expiry redirects with a user-visible explanation
When a session is found to be expired or is rejected by the authentication provider, the application SHALL redirect to `/login` and display a Spanish message explaining that the session expired, rather than redirecting silently or rendering a blank or generic error.

#### Scenario: Expired session redirects with a message
- **WHEN** an admin with an expired session opens `/dashboard`
- **THEN** the browser SHALL be redirected to `/login`
- **AND** the login page SHALL display a message such as "Tu sesión expiró, vuelve a iniciar sesión"

#### Scenario: Expiry during an open session
- **WHEN** a session expires while the dashboard is open and the token refresh is rejected
- **THEN** the admin SHALL be redirected to `/login` with the same expiry message
- **AND** dashboard content SHALL NOT remain visible

#### Scenario: Ordinary sign-out shows no expiry message
- **WHEN** an admin signs out deliberately using the "Salir" button
- **THEN** the login page SHALL NOT display the expiry message

#### Scenario: Direct visit shows no expiry message
- **WHEN** a visitor opens `/login` directly without a prior expired session
- **THEN** no expiry message SHALL be displayed

### Requirement: Explicit session persistence configuration
The Supabase client SHALL declare its authentication persistence options explicitly — session persistence, storage target, token auto-refresh, and URL session detection — rather than relying on library defaults, so that the storage and refresh behavior of admin credentials is a recorded decision.

#### Scenario: Client options are explicit
- **WHEN** the Supabase client is constructed
- **THEN** the persistence, storage, auto-refresh, and URL-detection options SHALL be set explicitly in the client configuration

#### Scenario: Chosen persistence behaves as configured
- **WHEN** an admin signs in and reloads the page within the session lifetime
- **THEN** the session SHALL be restored or discarded according to the configured persistence option, consistently across reloads

### Requirement: Stale sessions are cleared locally
When the authentication provider rejects a stored session, the application SHALL clear that session from local storage so the app does not continue to present a dead token or render as if authenticated.

#### Scenario: Rejected session is discarded
- **WHEN** the authentication provider rejects the stored session as expired or invalid
- **THEN** the local session SHALL be cleared
- **AND** the application SHALL treat the visitor as signed out

#### Scenario: No authenticated UI after rejection
- **WHEN** the local session has been cleared following a rejection
- **THEN** subsequent navigation to `/dashboard` SHALL redirect to `/login` without briefly rendering dashboard content
