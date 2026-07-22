## MODIFIED Requirements

### Requirement: Next step schema
The Sanity Studio SHALL define a `connectStep` document type for action cards displayed on the `/conectar` page.

#### Scenario: Connect step document fields
- **WHEN** a content editor creates a connect step in Sanity Studio
- **THEN** the schema SHALL require: `title` (string), `description` (text), `ctaText` (string), `ctaLink` (string/URL), `order` (number)
- **AND** the schema SHALL accept optional fields: `icon` (string, Lucide icon name identifier), `consolidationStep` (string, one of the consolidation options)

#### Scenario: Existing next step documents migrated
- **GIVEN** documents of the legacy `nextStep` type exist in the dataset
- **WHEN** the schema rename is deployed
- **THEN** all existing documents SHALL be migrated to the `connectStep` type preserving all field values
