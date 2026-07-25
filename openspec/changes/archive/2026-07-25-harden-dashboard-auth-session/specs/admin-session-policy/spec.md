## ADDED Requirements

### Requirement: Absolute session lifetime
An admin session SHALL expire no later than 7 days after sign-in, regardless of activity. On reaching the limit the application SHALL revoke the session's refresh token at the authentication provider, so the session ends server-side and not merely in the current browser, and the admin SHALL be required to authenticate again with credentials.

The limit is evaluated in the browser, because provider-enforced session time-boxing is a paid Supabase feature this project does not have. See "Limits of browser-evaluated expiry" below for what that does and does not guarantee.

#### Scenario: Session expires after one week
- **WHEN** more than 7 days have passed since an admin signed in
- **THEN** the stored session SHALL no longer grant access to `/dashboard`
- **AND** the admin SHALL be required to enter their credentials again

#### Scenario: Active use does not extend past the cap
- **WHEN** an admin has used the dashboard continuously and reaches 7 days since sign-in
- **THEN** the session SHALL still expire
- **AND** continued activity SHALL NOT postpone the expiry

#### Scenario: Expiry revokes the session at the provider
- **WHEN** the absolute limit is reached
- **THEN** the application SHALL perform a global sign-out that revokes the refresh token
- **AND** the revoked token SHALL NOT yield a new access token on any device

#### Scenario: Session of unestablished age is not honoured
- **WHEN** a stored session exists but its sign-in time cannot be determined
- **THEN** the session SHALL be treated as expired rather than granted the benefit of the doubt

#### Scenario: Session within the window still works
- **WHEN** an admin returns to `/dashboard` two days after signing in
- **THEN** the session SHALL be refreshed silently and the dashboard SHALL load without a new sign-in

### Requirement: Idle timeout
An admin session SHALL also expire after 8 hours of inactivity, so an unused session does not remain valid for the full week. Inactivity means the absence of user input; automatic token refreshes SHALL NOT count as activity, since they occur on a timer whenever a tab is open.

#### Scenario: Unused session expires early
- **WHEN** an admin session has gone unused for longer than the inactivity period
- **THEN** the session SHALL be expired even though fewer than 7 days have passed since sign-in
- **AND** the admin SHALL be required to authenticate again

#### Scenario: Activity resets the idle window
- **WHEN** an admin uses the dashboard before the inactivity period elapses
- **THEN** the idle window SHALL restart
- **AND** the 7-day absolute cap SHALL remain unchanged

#### Scenario: Abandoned open tab still expires
- **WHEN** the dashboard is left open and untouched past the inactivity period
- **THEN** the session SHALL expire without waiting for the next navigation
- **AND** dashboard content SHALL NOT remain visible

### Requirement: Limits of browser-evaluated expiry
The session limits SHALL be documented as browser-evaluated, so that no reader mistakes them for provider-enforced guarantees.

#### Scenario: Tampering can postpone the limit
- **WHEN** someone with access to the device alters the stored timestamps before a limit fires
- **THEN** the expiry MAY be postponed
- **AND** this SHALL be recorded as an accepted limitation rather than treated as a defect

#### Scenario: An exfiltrated token is not bounded
- **WHEN** a token is copied off the device, for example through XSS
- **THEN** the copied token SHALL NOT be subject to these limits, because the evaluating code never runs against it
- **AND** the data it can reach SHALL remain bounded by database access policies

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
