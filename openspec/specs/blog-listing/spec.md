## ADDED Requirements

### Requirement: Blog listing displays published posts
The system SHALL display a listing of all published blog posts at `/blog` in a responsive card grid.

#### Scenario: Blog listing with posts
- **GIVEN** there are published blog posts in the CMS
- **WHEN** a user visits `/blog`
- **THEN** the page SHALL display all published posts as cards in a grid, ordered by `publishedAt` descending
- **AND** each card SHALL show: featured image, title, excerpt (truncated), published date, and a category badge ("Sermón" or "Noticia")

#### Scenario: Blog listing empty state
- **GIVEN** there are no published blog posts in the CMS
- **WHEN** a user visits `/blog`
- **THEN** the page SHALL display a message: "No hay publicaciones disponibles"

#### Scenario: Blog listing responsive layout
- **GIVEN** a user visits `/blog`
- **WHEN** the viewport is narrower than `md` (768px)
- **THEN** blog cards SHALL display in a single column
- **WHEN** the viewport is wider than `lg` (1024px)
- **THEN** blog cards SHALL display in a 3-column grid

### Requirement: Blog category filtering
The system SHALL allow filtering blog posts by category using a filter control.

#### Scenario: Filter by category via UI
- **GIVEN** a user is on `/blog`
- **WHEN** the user selects the "Sermones" filter
- **THEN** only posts with category "sermon" SHALL be displayed
- **AND** the URL SHALL update to `/blog?categoria=sermon`

#### Scenario: Filter via URL search param
- **GIVEN** a user visits `/blog?categoria=news`
- **WHEN** the page loads
- **THEN** only posts with category "news" SHALL be displayed
- **AND** the "Noticias" filter SHALL be visually active

#### Scenario: Show all posts
- **GIVEN** a user selects "Todos" or visits `/blog` without a category param
- **WHEN** the page renders
- **THEN** all published posts SHALL be displayed regardless of category

### Requirement: Blog card links to detail page
Each blog card SHALL link to the full blog post detail page.

#### Scenario: Navigate to blog post
- **GIVEN** a blog listing with post cards
- **WHEN** a user clicks on a blog card
- **THEN** the user SHALL navigate to `/blog/$slug` where `$slug` is the post's slug

### Requirement: Blog listing page metadata
The blog listing page SHALL include appropriate page title.

#### Scenario: Page title
- **WHEN** a user visits `/blog`
- **THEN** the page title SHALL be "Blog — El Sembrador"
