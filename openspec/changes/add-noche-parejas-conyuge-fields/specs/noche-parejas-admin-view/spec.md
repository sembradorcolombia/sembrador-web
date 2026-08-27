## ADDED Requirements

### Requirement: Noche de Parejas dashboard tab
The admin dashboard SHALL provide a "Noche de Parejas" section, selectable from the dashboard tab list alongside the existing sections. The section SHALL be rendered only when its tab is active so its data is not fetched until first opened.

#### Scenario: Tab is available
- **WHEN** an admin loads `/dashboard`
- **THEN** the tab list SHALL include a tab labeled "Noche de Parejas"

#### Scenario: Selecting the tab
- **WHEN** the admin clicks the "Noche de Parejas" tab
- **THEN** the Noche de Parejas section SHALL be displayed
- **AND** the couple registrations SHALL be fetched at that point

### Requirement: Couple registrations listing
The "Noche de Parejas" section SHALL list every row of the `noche_parejas_couples` table in a table with the columns: `#`, "Nombre", "Apellido", "Email", "Celular", "Cónyuge", "Email cónyuge", "Celular cónyuge", "Relación", "Política de datos", and "Fecha". The "Cónyuge" column SHALL show the cónyuge nombre and apellido. Rows SHALL be ordered by registration date, newest first, until the admin changes the sort. All column labels and messages SHALL be in Spanish.

#### Scenario: Registrations are listed
- **WHEN** the section finishes loading and at least one couple registration exists
- **THEN** the table SHALL display one row per couple with the registrant's nombre, apellido, email, and celular; the cónyuge's nombre, apellido, email, and celular; the relationship status; the política de datos value; and the formatted creation date
- **AND** the most recent registration SHALL appear first

#### Scenario: Total count is shown
- **WHEN** the section has loaded
- **THEN** the section SHALL display the total number of couple registrations

#### Scenario: Data policy acceptance is shown
- **WHEN** a registration's `accepts_data_policy` is true
- **THEN** the "Política de datos" cell SHALL display "Sí"
- **AND** when it is false the cell SHALL display "No"

#### Scenario: Empty state
- **WHEN** there are no couple registrations
- **THEN** the section SHALL display the Spanish message "No hay registros aun." instead of an empty table

#### Scenario: Load failure
- **WHEN** fetching the couple registrations fails
- **THEN** the section SHALL display a Spanish error message and SHALL NOT display a partial table

### Requirement: Complete result set retrieval
The system SHALL retrieve all couple registrations rather than only the first page returned by Supabase, paging through results until the table is exhausted.

#### Scenario: More rows than one Supabase page
- **WHEN** the table contains more rows than a single Supabase response returns
- **THEN** the system SHALL issue additional paged requests until all rows have been retrieved
- **AND** the reported total SHALL equal the true number of rows

### Requirement: Column sorting
The admin SHALL be able to sort the couple registrations by clicking the "Nombre", "Apellido", "Email", "Celular", "Cónyuge", "Relación", and "Fecha" column headers. Clicking a sortable header SHALL toggle between ascending and descending order for that column.

#### Scenario: Sorting ascending by a column
- **WHEN** the admin clicks the "Nombre" header
- **THEN** the rows SHALL be reordered by registrant nombre in ascending order

#### Scenario: Toggling sort direction
- **WHEN** the admin clicks the same header a second time
- **THEN** the rows SHALL be reordered by that column in descending order

#### Scenario: Sorting affects all rows, not just the visible page
- **WHEN** the registrations span multiple pages and the admin sorts by a column
- **THEN** the sort SHALL be applied across the entire result set before pagination

### Requirement: Multi-field search
The section SHALL provide a single search box that filters the couple registrations by matching the query, case-insensitively, against the registrant's nombre, apellido, email, or celular, or the cónyuge's nombre, apellido, email, or celular. A registration SHALL be included when the query matches any one of those fields.

#### Scenario: Matching by registrant field
- **WHEN** the admin types a fragment of the registrant's nombre, apellido, email, or celular
- **THEN** only couples whose corresponding registrant field contains that fragment (ignoring case) SHALL be listed

#### Scenario: Matching by cónyuge field
- **WHEN** the admin types a fragment of the cónyuge's nombre, apellido, email, or celular
- **THEN** couples whose corresponding cónyuge field contains that fragment SHALL be listed

#### Scenario: No matches
- **WHEN** the query matches no registration
- **THEN** the section SHALL display the Spanish message "No se encontraron resultados"

#### Scenario: Clearing the search
- **WHEN** the admin clears the search box
- **THEN** the full set of couple registrations SHALL be listed again

#### Scenario: Search combines with sorting
- **WHEN** a search query is active and the admin sorts by a column
- **THEN** only the matching registrations SHALL be listed, ordered by the chosen column

### Requirement: Pagination
The registrations table SHALL paginate results, showing the current range, the total number of matching rows, and controls to move between pages. Pagination controls SHALL be hidden when everything fits on a single page.

#### Scenario: Navigating pages
- **WHEN** the matching registrations exceed one page
- **THEN** the section SHALL display the current range, the total, and previous/next controls
- **AND** activating "next" SHALL display the following page of rows

#### Scenario: Single page of results
- **WHEN** all matching registrations fit on one page
- **THEN** no pagination controls SHALL be displayed

### Requirement: CSV export
The section SHALL provide a "Descargar CSV" button that downloads the currently listed couple registrations as a CSV file, respecting the active search filter and sort order and including every matching row rather than only the visible page.

#### Scenario: Exporting the registrations
- **WHEN** the admin clicks "Descargar CSV"
- **THEN** a CSV file SHALL be downloaded containing a header row with the Spanish column labels and one row per matching couple registration, including both spouses' fields and the relationship

#### Scenario: Export respects filter and sort
- **WHEN** a search query is active and a sort column is selected
- **THEN** the exported CSV SHALL contain only the matching registrations, in the displayed order, across all pages

#### Scenario: Export filename
- **WHEN** the CSV is downloaded
- **THEN** the filename SHALL identify the dataset and include the export date, e.g. `noche-parejas-registros-YYYY-MM-DD.csv`

#### Scenario: CSV values are safely encoded
- **WHEN** a field contains a comma, quote, newline, or a leading formula character
- **THEN** the exported value SHALL be escaped so it is read as text by spreadsheet software

### Requirement: Admin read access to couple registrations
Couple registrations SHALL be readable from the dashboard only by authenticated admin users; the underlying data access policy SHALL NOT expose registration rows to anonymous or non-admin users.

#### Scenario: Admin reads registrations
- **WHEN** an authenticated admin loads the "Noche de Parejas" section
- **THEN** the couple registration rows SHALL be returned

#### Scenario: Non-admin cannot read registrations
- **WHEN** an anonymous or non-admin client queries `noche_parejas_couples`
- **THEN** no registration rows SHALL be returned

### Requirement: Responsive registrations table
The registrations table SHALL remain usable on mobile viewports.

#### Scenario: Table on a narrow viewport
- **WHEN** the section is viewed on a viewport narrower than 640px
- **THEN** the table SHALL scroll horizontally within its own container without causing the page body to scroll horizontally
- **AND** the search box and "Descargar CSV" button SHALL remain reachable
