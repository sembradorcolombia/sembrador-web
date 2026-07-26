## ADDED Requirements

### Requirement: Hero document type
The Sanity Studio SHALL define a `hero` document type representing a page banner, independent of `siteSettings`. The schema SHALL require `heading` (string) and `backgroundImage` (image with hotspot and alt text), and SHALL accept optional `leadText` (text) and `cta` (object with `text` and `link`).

#### Scenario: Hero document fields
- **WHEN** a content editor creates a hero in Sanity Studio
- **THEN** the schema SHALL require `heading` and `backgroundImage`
- **AND** SHALL accept optional `leadText` and `cta`

#### Scenario: Required fields are enforced
- **WHEN** an editor attempts to publish a hero without a heading or without a background image
- **THEN** the Studio SHALL block publication and display a validation message

#### Scenario: Partial CTA is rejected
- **WHEN** an editor fills in the CTA text but leaves the link empty, or the reverse
- **THEN** the Studio SHALL block publication with a validation message
- **AND** a hero with both CTA fields empty SHALL publish successfully

### Requirement: Heroes are keyed per page
Each `hero` document SHALL carry a `key` identifying the page it belongs to, chosen from a defined list of options covering every top-level page: `home`, `acerca`, `blog`, `eventos`, `conectar`, and `dar`. At most one hero SHALL exist per key.

#### Scenario: Editor selects the target page
- **WHEN** an editor creates a hero
- **THEN** the schema SHALL require a `key` selected from the defined page options

#### Scenario: Duplicate keys are prevented
- **WHEN** an editor attempts to publish a second hero with a key already in use
- **THEN** the Studio SHALL block publication and indicate that a hero already exists for that page

#### Scenario: Hero list is identifiable
- **WHEN** an editor views the list of hero documents in the Studio
- **THEN** each entry SHALL display its heading and the page it belongs to

### Requirement: Shared hero component
The web app SHALL provide a single reusable hero component that renders any hero by its key, used by every top-level page: `/`, `/acerca`, `/blog`, `/eventos`, `/conectar`, and `/dar`. No page SHALL define its own banner markup.

#### Scenario: Every top-level page renders a banner
- **WHEN** a visitor opens any of `/`, `/acerca`, `/blog`, `/eventos`, `/conectar`, or `/dar`
- **THEN** the page SHALL render its banner through the shared hero component keyed to that page
- **AND** the previous hardcoded header markup SHALL NOT be present

#### Scenario: Banner height matches the page
- **WHEN** the homepage renders its banner
- **THEN** it SHALL use the tall banner treatment
- **AND** the other pages SHALL use the shorter page-header treatment

#### Scenario: Pages without a published hero keep their current copy
- **WHEN** no hero document exists for a page's key
- **THEN** that page SHALL render its existing heading and subtitle as the fallback

#### Scenario: Hero renders CMS content
- **WHEN** a page renders the hero component for a key that has a published hero
- **THEN** the heading SHALL be displayed over the background image
- **AND** the lead text SHALL be displayed when present

#### Scenario: Optional fields are omitted cleanly
- **WHEN** a hero has no `leadText` and no `cta`
- **THEN** the hero SHALL render with the heading alone, without empty spacing or placeholder elements

#### Scenario: CTA renders when present
- **WHEN** a hero defines a CTA with text and link
- **THEN** a call-to-action SHALL be rendered with that text, navigating to that link
- **AND** an internal link SHALL use client-side routing while an external URL SHALL open in a new tab with `rel="noopener noreferrer"`

#### Scenario: Loading state
- **WHEN** the hero content is being fetched
- **THEN** the component SHALL render a skeleton placeholder matching the hero's layout rather than collapsing the page

#### Scenario: Missing hero falls back
- **WHEN** no hero document exists for the requested key, or the fetch fails
- **THEN** the component SHALL render fallback heading text and a fallback background image
- **AND** the page SHALL NOT display an error or an empty banner area

### Requirement: Hero accessibility and responsiveness
The hero SHALL present its heading as the page's main heading where it is the top-level banner, maintain readable contrast over the background image, and adapt to mobile viewports.

#### Scenario: Heading semantics
- **WHEN** the hero is rendered as a page's top-level banner
- **THEN** the heading SHALL be rendered as the page's `h1`

#### Scenario: Text remains readable over imagery
- **WHEN** a hero renders over a light or busy background image
- **THEN** an overlay or equivalent treatment SHALL keep the heading and lead text legible

#### Scenario: Mobile layout
- **WHEN** the hero is viewed on a viewport narrower than 640px
- **THEN** the heading, lead text, and CTA SHALL remain readable and reachable without horizontal scrolling
