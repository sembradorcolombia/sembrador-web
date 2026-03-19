## ADDED Requirements

### Requirement: Blog post schema
The Sanity Studio SHALL define a `blogPost` document type for sermon summaries and church news articles.

#### Scenario: Blog post document fields
- **WHEN** a content editor creates a blog post in Sanity Studio
- **THEN** the schema SHALL require: `title` (string), `slug` (slug, sourced from title), `publishedAt` (datetime), `category` (string, one of "sermon" or "news"), `excerpt` (text), `body` (Portable Text with rich text blocks), `featuredImage` (image with alt text)
- **AND** the schema SHALL accept optional fields: `author` (reference to author), `scriptureReferences` (array of strings), `audioUrl` (URL), `videoUrl` (URL)

#### Scenario: Blog post slug uniqueness
- **GIVEN** a blog post with a title
- **WHEN** the slug is auto-generated from the title
- **THEN** the slug SHALL be unique across all blog post documents

### Requirement: Author schema
The Sanity Studio SHALL define an `author` document type for blog post authors and event speakers.

#### Scenario: Author document fields
- **WHEN** a content editor creates an author in Sanity Studio
- **THEN** the schema SHALL require: `name` (string), `image` (image with alt text)
- **AND** the schema SHALL accept optional fields: `bio` (text), `role` (string)

### Requirement: Event series schema
The Sanity Studio SHALL define an `eventSeries` document type for grouping related events (e.g., "Equilibrio").

#### Scenario: Event series document fields
- **WHEN** a content editor creates an event series in Sanity Studio
- **THEN** the schema SHALL require: `name` (string), `slug` (slug, sourced from name), `isActive` (boolean, default true)
- **AND** the schema SHALL accept optional fields: `description` (text), `logo` (image), `themeColor` (string)

### Requirement: Event schema
The Sanity Studio SHALL define an `event` document type for individual events within a series, including a `supabaseEventId` field to link CMS content with Supabase registration data.

#### Scenario: Event document fields
- **WHEN** a content editor creates an event in Sanity Studio
- **THEN** the schema SHALL require: `name` (string), `slug` (slug, sourced from name), `eventSeries` (reference to eventSeries), `date` (date), `time` (string), `location` (string), `supabaseEventId` (string, must match a Supabase events table UUID)
- **AND** the schema SHALL accept optional fields: `speaker` (reference to author), `speakerImage` (image), `description` (text), `themeColor` (string), `status` (string, one of "upcoming" or "past", default "upcoming")

#### Scenario: Event linked to Supabase
- **GIVEN** an event document with a `supabaseEventId` value
- **WHEN** the web app fetches this event from Sanity
- **THEN** the `supabaseEventId` SHALL be used to query the corresponding registration data (capacity, current count) from Supabase

### Requirement: Next step schema
The Sanity Studio SHALL define a `nextStep` document type for action cards displayed on the next steps page.

#### Scenario: Next step document fields
- **WHEN** a content editor creates a next step in Sanity Studio
- **THEN** the schema SHALL require: `title` (string), `description` (text), `ctaText` (string), `ctaLink` (string/URL), `order` (number)
- **AND** the schema SHALL accept optional fields: `icon` (string, Lucide icon name identifier)

### Requirement: Giving option schema
The Sanity Studio SHALL define a `givingOption` document type for donation methods displayed on the giving page.

#### Scenario: Giving option document fields
- **WHEN** a content editor creates a giving option in Sanity Studio
- **THEN** the schema SHALL require: `title` (string), `description` (text), `type` (string, one of "bank", "nequi", "daviplata", or "other"), `order` (number)
- **AND** the schema SHALL accept optional fields: `details` (text, for account numbers or instructions), `qrCodeImage` (image)

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
