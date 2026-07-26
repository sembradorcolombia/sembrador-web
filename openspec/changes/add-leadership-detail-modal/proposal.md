## Why

The leadership section on `/acerca` shows a portrait, a name, and a leadership title, and stops there. The bio each author already carries in the CMS has nowhere to appear — it was deliberately kept off the section to stop a wall of centered paragraphs from swamping the grid. Visitors get no way to learn anything about the people leading the church, and editors are writing bios that never reach the site.

A detail modal resolves the tension: the grid stays scannable, and anyone who wants to read about a leader can open one.

## What Changes

- **Leadership entries become interactive.** Each entry becomes a button that opens a modal for that leader. The grid layout, centering, and content stay exactly as they are.
- **New leadership detail modal**, built on the existing Radix `Dialog` primitive, showing the leader's photo, name, leadership title, and bio.
- **`bio` returns to the leadership projection.** `fetchLeadership` and `CmsLeader` dropped it when the section stopped rendering it; the modal needs it back.
- **Leaders without a bio remain openable** — the modal shows photo, name, and title, with no empty text area and no dead-looking entry.

## Capabilities

### New Capabilities

- `leadership-detail-modal`: The modal itself — what opens it, what it displays, how it closes, and how it behaves for keyboard and screen-reader users.

### Modified Capabilities

- `leadership-section`: Entries currently specify a static display of image, name, and leadership title, with the bio explicitly not shown. That changes to entries being activatable, and the bio becoming visible through the modal rather than never rendering.

**Dependency:** `leadership-section` is defined by the in-flight change `decouple-hero-about-and-add-leadership`, which is not yet archived, so no `openspec/specs/leadership-section/` exists yet. This change's delta stacks on that one and cannot be archived before it.

## Impact

- **Routes:** `/acerca` only. No new routes, no URL changes, no CMS schema changes — `author.bio` already exists and is already populated for some authors.
- **New code:** `src/components/about/LeadershipModal.tsx`.
- **Modified code:** `LeadershipSection.tsx` (entries become buttons, owns which leader is open), `fetchLeadership` in `src/lib/services/cms.ts` and `CmsLeader` in `src/lib/types/cms.ts` (re-add `bio`), and the leadership tests and e2e fixtures.
- **Dependencies:** none new — `@radix-ui/react-dialog` and the `ui/dialog` wrapper are already used by `SubscriptionModal`.
- **Bundle size:** negligible; the dialog primitive already ships on other chunks.
- **Analytics:** none. Opening a leader is not tracked, consistent with the rest of `/acerca`.
