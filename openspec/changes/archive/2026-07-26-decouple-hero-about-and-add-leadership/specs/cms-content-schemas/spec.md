## MODIFIED Requirements

### Requirement: Author schema
The Sanity Studio SHALL define an `author` document type for blog post authors, event speakers, and church leaders.

#### Scenario: Author document fields
- **WHEN** a content editor creates an author in Sanity Studio
- **THEN** the schema SHALL require: `name` (string), `image` (image with alt text)
- **AND** the schema SHALL accept optional fields: `bio` (text), `roles` (array of predefined role options), `leadershipTitle` (string, shown only when `roles` includes `leader`), `leadershipOrder` (number, shown only when `roles` includes `leader`)
- **AND** the schema SHALL NOT define a single-valued `role` string field

### Requirement: Site settings schema
The Sanity Studio SHALL define a `siteSettings` singleton document type for global site configuration and contact information, including footer-specific fields. Page banner imagery and About page copy SHALL NOT live in this document.

#### Scenario: Site settings document fields
- **WHEN** a content editor edits the site settings in Sanity Studio
- **THEN** the schema SHALL require: `churchName` (string), `tagline` (string)
- **AND** the schema SHALL accept optional fields: `aboutLocation` (string), `aboutServiceTimes` (string), `socialLinks` (array of objects with `platform` string and `url` URL), `footerTagline` (string — short description shown below the logo in the footer), `address` (string — physical address of the church), `contactPhone` (string — contact phone number), `contactEmail` (string — contact email address)
- **AND** the schema SHALL NOT define `heroImage` or `aboutDescription`

#### Scenario: Site settings is a singleton
- **WHEN** the site settings document type is used
- **THEN** only one instance of this document SHALL exist in the dataset

#### Scenario: Footer fields are optional
- **GIVEN** a content editor has not filled in footer-specific fields (`footerTagline`, `address`, `contactPhone`, `contactEmail`)
- **WHEN** the site settings document is saved
- **THEN** the save SHALL succeed and the web app SHALL render fallback values in the footer

#### Scenario: Banner and About copy live elsewhere
- **WHEN** an editor looks for the homepage banner image or the About page description
- **THEN** those SHALL be found in the `hero` and `aboutPage` documents respectively, not in site settings

## ADDED Requirements

### Requirement: Hero schema registration
The Sanity Studio SHALL register the `hero` document type and expose it in the Studio navigation as a manageable list of page banners.

#### Scenario: Hero type is available
- **WHEN** an editor opens the Studio content navigation
- **THEN** a navigation entry for page heroes SHALL be present
- **AND** creating a new hero SHALL be possible from it

### Requirement: About page schema registration
The Sanity Studio SHALL register the `aboutPage` document type as a singleton and expose it as a dedicated navigation entry alongside the existing site settings singleton.

#### Scenario: About page singleton is reachable
- **WHEN** an editor opens the Studio content navigation
- **THEN** a single "About page" entry SHALL open the one `aboutPage` document directly
- **AND** it SHALL NOT appear as a document list allowing multiple instances

## REMOVED Requirements

### Requirement: Site settings hero and about description fields
**Reason**: `heroImage` and `aboutDescription` coupled the homepage banner and the About page copy into the global settings singleton. They are replaced by the dedicated `hero` and `aboutPage` document types, which is the decoupling this change exists to deliver.

**Migration**: Copy `siteSettings.heroImage` into the `backgroundImage` of the `hero` document keyed `home`, and `siteSettings.aboutDescription` into `aboutPage.description`. Remove the fields from the `siteSettings` schema only after the migrated content is verified in production. Removing the fields from the schema does not delete the stored values from the dataset, but it does make them unreachable through the Studio UI.
