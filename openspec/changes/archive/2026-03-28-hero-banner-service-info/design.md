## Context

`HeroSection.tsx` currently uses `useSiteSettings()` and already receives `settings.tagline`. The same hook exposes `settings.aboutServiceTimes`, `settings.aboutLocation`, and `settings.address` — no additional data fetching or hook changes are needed.

Lucide icons `Clock` and `MapPin` are already used elsewhere in the codebase (e.g., Footer uses `MapPin`).

## Goals / Non-Goals

**Goals:**
- Surface service time and location info to first-time visitors directly on the hero.
- Use existing CMS fields — no schema changes.
- Degrade gracefully with static fallbacks when CMS data is absent.

**Non-Goals:**
- Adding multiple service times or multi-location support.
- Building a new CMS schema for services/schedules.
- Redesigning the full hero layout (background, overlay, heading remain unchanged).

## Decisions

### Info block layout: two inline pills below the tagline

Display schedule and location as two horizontally-arranged info items (icon + text) in a row, centered under the tagline, with a subtle semi-transparent background pill to keep them readable over the hero image. Below that, a ghost/outline secondary CTA button links to `/acerca`.

```
[Church Name]
[Tagline]

🕐 Domingos 10:00 AM    📍 Medellín, Colombia

            [Conocer más →]
```

**Why pills over a full card:** Keeps the hero lightweight. A full card would compete visually with the heading. Pills are scannable in under 2 seconds.

**Why `/acerca` as secondary CTA instead of `/eventos`:** Events are transactional; `/acerca` sets context for new visitors who don't yet know the church. The schedule/location info already handles the "what/when/where" — `/acerca` answers "who are you?".

### Data sourcing

| Field | CMS key | Fallback |
|---|---|---|
| Schedule | `settings.aboutServiceTimes` | `"Domingos 10:00 AM"` |
| Location | `settings.aboutLocation` \|\| `settings.address` | `"Medellín, Colombia"` |

Use `aboutLocation` first (descriptive text), fall back to `address` (raw string), then static fallback.

### Loading state

Reuse the existing `isLoading` branch — add two skeleton pill shapes alongside the existing heading skeletons. No new loading logic.

## Risks / Trade-offs

- **CMS data not filled**: If `aboutServiceTimes` and `aboutLocation` are not set in Sanity, fallback text shows. Acceptable — editor can fill them at any time.
- **Long strings**: `aboutServiceTimes` or `aboutLocation` could be long. Clamp with `truncate` or `line-clamp-1` to prevent pill overflow.
