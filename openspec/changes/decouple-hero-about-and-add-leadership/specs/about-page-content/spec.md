## ADDED Requirements

### Requirement: About page document type
The Sanity Studio SHALL define an `aboutPage` singleton document holding the About page content, separate from `siteSettings`. The schema SHALL accept `description` (rich text), `vision` (text), `mission` (text), `coreValues` (array of `{ title, description }`), and `coreBeliefs` (array of `{ title, description }`).

#### Scenario: About page document fields
- **WHEN** a content editor edits the About page content in Sanity Studio
- **THEN** the schema SHALL offer description, vision, mission, core values, and core beliefs fields

#### Scenario: About page is a singleton
- **WHEN** the About page document type is used
- **THEN** only one instance SHALL exist in the dataset
- **AND** it SHALL be reachable from a dedicated Studio navigation entry rather than a document list

#### Scenario: Value and belief entries require a title
- **WHEN** an editor adds a core value or core belief without a title
- **THEN** the Studio SHALL block publication with a validation message

#### Scenario: Entries are orderable
- **WHEN** an editor reorders the core values or core beliefs in the Studio
- **THEN** the web app SHALL render them in the editor's chosen order

### Requirement: About page renders CMS content
The `/acerca` page SHALL render its description, vision, mission, core values, and core beliefs from the `aboutPage` document.

#### Scenario: Full content renders
- **WHEN** the `aboutPage` document has all fields populated
- **THEN** `/acerca` SHALL display the description, a vision section, a mission section, the list of core values, and the list of core beliefs

#### Scenario: Rich text formatting is preserved
- **WHEN** the description contains formatted rich text such as paragraphs, emphasis, or links
- **THEN** the rendered output SHALL preserve that formatting

#### Scenario: Empty sections are omitted
- **WHEN** vision, mission, core values, or core beliefs are not populated
- **THEN** the corresponding section SHALL NOT be rendered
- **AND** no empty heading or placeholder SHALL appear in its place

#### Scenario: Section headings are in Spanish
- **WHEN** the sections render
- **THEN** their headings SHALL be in Spanish, for example "Quiénes somos", "Visión", "Misión", "Nuestros valores", and "En qué creemos"

#### Scenario: No About content at all
- **WHEN** the `aboutPage` document does not exist or has no populated fields
- **THEN** `/acerca` SHALL display fallback introductory text rather than an empty page

#### Scenario: Fetch failure
- **WHEN** fetching the About page content fails
- **THEN** `/acerca` SHALL display a Spanish error message in the content area
- **AND** the page hero SHALL still render

#### Scenario: Loading state
- **WHEN** the About page content is being fetched
- **THEN** a loading indicator SHALL be displayed in the content area

### Requirement: About page responsiveness
The About page content SHALL be readable and well-structured on mobile and desktop viewports.

#### Scenario: Mobile layout
- **WHEN** `/acerca` is viewed on a viewport narrower than 640px
- **THEN** the content SHALL render in a single-column layout with readable line lengths and no horizontal page scrolling

#### Scenario: Value and belief lists on wider viewports
- **WHEN** `/acerca` is viewed on a desktop viewport
- **THEN** the core values and core beliefs SHALL be laid out to use the available width rather than as a single narrow column
