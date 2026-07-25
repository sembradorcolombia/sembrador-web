## ADDED Requirements

### Requirement: Admin claim is verified against the authentication server
The `/dashboard` route guard SHALL determine admin status from a session validated by the authentication server, not from a token decoded out of client-controlled local storage. A locally modified or forged stored session SHALL NOT satisfy the guard.

#### Scenario: Valid admin is admitted
- **WHEN** a visitor with a server-validated session carrying `app_metadata.is_admin` opens `/dashboard`
- **THEN** the dashboard SHALL render

#### Scenario: Tampered local session is rejected
- **WHEN** a visitor edits the stored session so that it appears to carry the admin claim
- **THEN** the authentication server SHALL NOT validate the claim
- **AND** the visitor SHALL be redirected to `/login`

#### Scenario: Authenticated non-admin is rejected
- **WHEN** a visitor with a valid session that lacks `app_metadata.is_admin` opens `/dashboard`
- **THEN** the visitor SHALL be redirected to `/login`

#### Scenario: Anonymous visitor is rejected
- **WHEN** a visitor with no session opens `/dashboard`
- **THEN** the visitor SHALL be redirected to `/login`
- **AND** no dashboard content SHALL be rendered before the redirect

### Requirement: Guard failures fail closed
When the guard cannot confirm admin status — because the validation request errors, times out, or returns an indeterminate result — access SHALL be denied rather than granted.

#### Scenario: Validation request fails
- **WHEN** the request to validate the session fails or times out
- **THEN** the visitor SHALL be redirected to `/login`
- **AND** the dashboard SHALL NOT render

### Requirement: Login route redirect uses the same verification
The `/login` route guard SHALL use the same server-validated check when deciding whether to redirect an already-authenticated admin to `/dashboard`, so that a stale or invalid stored session does not cause a redirect loop between the two routes.

#### Scenario: Signed-in admin is redirected away from login
- **WHEN** an admin with a server-validated session opens `/login`
- **THEN** the admin SHALL be redirected to `/dashboard`

#### Scenario: Expired session does not cause a redirect loop
- **WHEN** a visitor holding an expired stored session opens `/login`
- **THEN** the login form SHALL be displayed
- **AND** the visitor SHALL NOT be redirected to `/dashboard`

### Requirement: Data access does not depend on the route guard
Admin-only data SHALL remain protected by database access policies independently of the route guard, so that bypassing the client-side guard does not expose subscriber or registration data.

#### Scenario: Guard bypass does not expose data
- **WHEN** a non-admin client bypasses the client-side route guard and issues data requests directly
- **THEN** the database access policies SHALL return no admin-only rows
