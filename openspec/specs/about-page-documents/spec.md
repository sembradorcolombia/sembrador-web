## Purpose

The church publishes reference materials such as its confession of faith. The `aboutPage` document carries these as attached PDFs so visitors can download them from `/acerca` without the files being hardcoded into the app.
## Requirements
### Requirement: Downloadable documents on the About page
The `aboutPage` document SHALL accept a `documents` array of downloadable files, each with a required `title` and a required file asset, plus an optional short `description`. These cover materials such as the confession of faith.

#### Scenario: Document entry fields
- **WHEN** a content editor adds a document to the About page in Sanity Studio
- **THEN** the schema SHALL require a title and a file asset
- **AND** SHALL accept an optional description

#### Scenario: Missing title or file is rejected
- **WHEN** an editor adds a document entry without a title or without a file
- **THEN** the Studio SHALL block publication with a validation message

#### Scenario: Only PDF files are accepted
- **WHEN** an editor uploads a file that is not a PDF
- **THEN** the Studio SHALL reject the upload or display a validation message indicating that PDF is required

#### Scenario: Documents are orderable
- **WHEN** an editor reorders the documents in the Studio
- **THEN** the web app SHALL list them in the editor's chosen order

### Requirement: Documents are listed and downloadable
The `/acerca` page SHALL display the attached documents as a list of download links, each labeled with its title.

#### Scenario: Documents render as downloads
- **WHEN** the `aboutPage` document has one or more documents attached
- **THEN** `/acerca` SHALL display a documents section listing each one by title
- **AND** each entry SHALL link to the file asset

#### Scenario: Description is shown when present
- **WHEN** a document entry has a description
- **THEN** that description SHALL be displayed alongside the title

#### Scenario: Download opens without leaving the page
- **WHEN** a visitor activates a document link
- **THEN** the PDF SHALL open in a new tab with `rel="noopener noreferrer"`
- **AND** the visitor SHALL remain on `/acerca`

#### Scenario: Section is omitted when empty
- **WHEN** no documents are attached
- **THEN** the documents section SHALL NOT be rendered

#### Scenario: Documents section is identifiable
- **WHEN** the documents section renders
- **THEN** it SHALL carry a Spanish heading such as "Documentos"
- **AND** each link SHALL be distinguishable as a downloadable file rather than an ordinary page link

#### Scenario: Mobile layout
- **WHEN** the documents section is viewed on a viewport narrower than 640px
- **THEN** each entry SHALL remain fully readable and tappable without horizontal scrolling
