## MODIFIED Requirements

### Requirement: Site settings schema
The Sanity Studio SHALL define a `siteSettings` singleton document type for global site configuration, including footer-specific fields.

#### Scenario: Site settings document fields
- **WHEN** a content editor edits the site settings in Sanity Studio
- **THEN** the schema SHALL require: `churchName` (string), `tagline` (string)
- **AND** the schema SHALL accept optional fields: `heroImage` (image), `aboutDescription` (text), `aboutLocation` (string), `aboutServiceTimes` (string), `socialLinks` (array of objects with `platform` string and `url` URL), `footerTagline` (string — short description shown below the logo in the footer), `address` (string — physical address of the church), `contactPhone` (string — contact phone number), `contactEmail` (string — contact email address)

#### Scenario: Site settings is a singleton
- **WHEN** the site settings document type is used
- **THEN** only one instance of this document SHALL exist in the dataset

#### Scenario: Footer fields are optional
- **GIVEN** a content editor has not filled in footer-specific fields (`footerTagline`, `address`, `contactPhone`, `contactEmail`)
- **WHEN** the site settings document is saved
- **THEN** the save SHALL succeed and the web app SHALL render fallback values in the footer
