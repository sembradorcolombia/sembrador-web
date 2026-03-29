## Why

The current hero banner CTA sends visitors directly to events, but first-time visitors need to know *when* and *where* services happen before they're ready to engage further. Replacing the single events button with service location and schedule info makes the banner more welcoming and actionable for newcomers.

## What Changes

- **HeroSection CTA replaced**: Remove the "Nuestros eventos" button and add an inline info block showing service schedule and location, sourced from `siteSettings.aboutServiceTimes` and `siteSettings.aboutLocation` / `siteSettings.address`.
- **Icon indicators**: Use `Clock` and `MapPin` icons (lucide-react, already a dependency) to visually distinguish schedule vs. location.
- **Fallbacks**: Show static fallback text if CMS data is not yet loaded or unavailable.
- **Secondary CTA preserved**: Keep a "Conocer más" link pointing to `/acerca` below the info block so visitors have a clear next action.

## Capabilities

### New Capabilities

- `hero-section`: Home page hero banner displays service schedule and location alongside a secondary CTA.

### Modified Capabilities

_(none)_

## Impact

- `src/components/home/HeroSection.tsx` — CTA replaced with service info block + secondary link.
- No new npm dependencies (`Clock`, `MapPin` already available from `lucide-react`).
- No new CMS fields — `aboutServiceTimes`, `aboutLocation`, and `address` are already in `CmsSiteSettings` and fetched by `useSiteSettings`.
- No route changes.
