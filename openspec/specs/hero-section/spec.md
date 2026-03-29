## ADDED Requirements

### Requirement: Hero displays service schedule and location
The HeroSection SHALL show service schedule and location information sourced from CMS `siteSettings`, displayed as an icon + text info block below the tagline.

#### Scenario: Schedule and location render from CMS
- **WHEN** `siteSettings.aboutServiceTimes` and `siteSettings.aboutLocation` are defined in the CMS
- **THEN** the hero SHALL display them with `Clock` and `MapPin` icons respectively

#### Scenario: Fallback when CMS fields are absent
- **WHEN** `aboutServiceTimes` or `aboutLocation` / `address` are not set in the CMS
- **THEN** the hero SHALL display static fallback text (`"Domingos 10:00 AM"` and `"Medellín, Colombia"`)

#### Scenario: Loading skeleton for info block
- **WHEN** `useSiteSettings` is in loading state
- **THEN** the info block SHALL render skeleton placeholder shapes consistent with the existing heading skeleton

### Requirement: Hero includes a secondary CTA linking to /acerca
The HeroSection SHALL include a secondary call-to-action button below the service info block that links to `/acerca`.

#### Scenario: Secondary CTA renders and navigates
- **WHEN** a user views the home page hero
- **THEN** a "Conocer más" link SHALL be visible and SHALL navigate to `/acerca` when clicked
