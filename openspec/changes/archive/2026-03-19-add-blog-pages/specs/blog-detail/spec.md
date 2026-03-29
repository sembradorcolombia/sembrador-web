## ADDED Requirements

### Requirement: Blog post detail renders full content
The system SHALL render a full blog post at `/blog/$slug` with Portable Text body content, author information, and metadata.

#### Scenario: Blog post with full content
- **GIVEN** a valid blog post slug exists in the CMS
- **WHEN** a user visits `/blog/$slug`
- **THEN** the page SHALL display: title, published date, author name and image, category badge, and the full Portable Text body content

#### Scenario: Blog post not found
- **GIVEN** the slug does not match any published blog post in the CMS
- **WHEN** a user visits `/blog/nonexistent`
- **THEN** the page SHALL display a "Publicación no encontrada" not-found message

### Requirement: Portable Text custom rendering
The system SHALL render Sanity Portable Text blocks with custom serializers for church-specific content.

#### Scenario: Render rich text blocks
- **GIVEN** a blog post body contains standard Portable Text blocks (headings, paragraphs, lists, bold, italic, links)
- **WHEN** the post detail page renders
- **THEN** all standard blocks SHALL render with appropriate Tailwind-styled HTML elements

#### Scenario: Render embedded images
- **GIVEN** a blog post body contains image blocks
- **WHEN** the post detail page renders
- **THEN** images SHALL render using the Sanity image URL builder with responsive sizing and alt text

### Requirement: Scripture references display
The system SHALL display scripture references associated with a sermon blog post.

#### Scenario: Post with scripture references
- **GIVEN** a blog post of category "sermon" has `scriptureReferences` populated
- **WHEN** the post detail page renders
- **THEN** scripture references SHALL be displayed in a visible section (e.g., sidebar or callout)

### Requirement: Audio and video embeds
The system SHALL render audio and video embeds when URLs are provided on a blog post.

#### Scenario: Post with audio URL
- **GIVEN** a blog post has an `audioUrl` value
- **WHEN** the post detail page renders
- **THEN** an audio player element SHALL be rendered allowing playback

#### Scenario: Post with video URL
- **GIVEN** a blog post has a `videoUrl` value
- **WHEN** the post detail page renders
- **THEN** a video embed (iframe for YouTube/Vimeo or native `<video>`) SHALL be rendered

### Requirement: Blog post SEO meta tags
Each blog post SHALL include SEO meta tags for search engines and social sharing.

#### Scenario: Blog post meta tags
- **GIVEN** a valid blog post
- **WHEN** the page renders
- **THEN** the `<head>` SHALL include: `<title>` as "{Post Title} — El Sembrador", `<meta name="description">` as the post excerpt, Open Graph `og:title`, `og:description`, `og:image` (featured image), and `og:type` as "article"

### Requirement: Blog post responsive layout
The blog post detail page SHALL be readable on all screen sizes.

#### Scenario: Mobile reading experience
- **GIVEN** a user reads a blog post on a mobile viewport
- **WHEN** the page renders
- **THEN** the content SHALL be constrained to a comfortable reading width with appropriate font size, line height, and margins
