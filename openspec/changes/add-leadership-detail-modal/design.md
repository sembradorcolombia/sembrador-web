## Context

`LeadershipSection` renders a `sm:grid-cols-2` list of leaders, each entry a centered column of portrait, name, and leadership title. It owns its own loading and error states so a failure there cannot take down the rest of `/acerca`, and it is the only consumer of `useLeadership` / `fetchLeadership`.

Two facts shape this change:

- **The bio was deliberately removed, not overlooked.** `fetchLeadership` stopped selecting `bio` and `CmsLeader` stopped declaring it, because a centered multi-paragraph bio inside a two-column grid reads badly. The modal is what makes the bio viable again — it gets a container wide enough and left-aligned enough to hold prose.
- **`leadership-section` is not yet a main spec.** It is introduced by `decouple-hero-about-and-add-leadership`, which is still active. Both changes touch the same component, and this one assumes the other's code is in place.

The project already has a Radix-based `Dialog` wrapper at `src/components/ui/dialog.tsx`, used by `SubscriptionModal`. It supplies the overlay, the centered panel, a close button labelled "Cerrar", focus trapping, and Escape-to-close.

## Goals / Non-Goals

**Goals:**

- Let a visitor open any leader and read their bio, without the grid losing its scannability.
- Reuse the existing dialog primitive rather than introducing a second modal pattern.
- Keep every entry openable, including leaders with no bio — an entry that looks clickable must behave clickably.
- Keep the section's existing loading, error, and empty behavior untouched.

**Non-Goals:**

- No deep-linking to a specific leader. No route, no search param, no browser-history entry.
- No CMS schema change. `author.bio` already exists.
- No expansion of what a leader carries — no social links, no email, no sermon list.
- No change to the grid's visual design beyond the affordance that an entry is interactive.
- No modal anywhere else. This is the leadership section only.

## Decisions

### One modal instance driven by state, not one per entry

`LeadershipSection` holds `const [selected, setSelected] = useState<CmsLeader | null>(null)` and renders a single `<LeadershipModal leader={selected} onClose={...} />` outside the list.

*Why not a `Dialog` per entry with `DialogTrigger`:* that is the more idiomatic Radix shape, and for a handful of leaders it would work. It also mounts one dialog root, one portal, and one overlay per leader, all to guarantee that only one is ever open. Holding the open leader in state makes "only one open at a time" structural rather than incidental, and keeps the trigger markup to a plain button.

*Consequence:* the modal receives a nullable leader and renders `open={leader !== null}`. It must tolerate `null` on the closing animation frame, so it reads from the last non-null leader or simply renders nothing when null — the latter is simpler and the close animation losing its content for ~150ms is not worth extra state to avoid.

### The whole entry is the button, and it is a real `<button>`

The `<li>` contains one `<button type="button">` wrapping portrait, name, and title.

*Why not `onClick` on the `<li>`:* a click handler on a non-interactive element is invisible to keyboards and screen readers. A real button is focusable, Enter/Space-activatable, and announced as a button, with no `tabIndex`/`role`/`onKeyDown` scaffolding.

*Why the whole entry rather than just the name:* the portrait is the largest and most obvious target, and a 24×24 name-only hit area is a poor mobile target. The button needs a visible focus ring and a hover affordance so it does not read as static text.

*Accessible name:* the button's text content is the name plus the title, which reads as "Larry Ossa, Pastor Principal" — sufficient without an explicit `aria-label`. The portrait inside keeps its existing alt text, which would otherwise be announced twice; mark it `aria-hidden` and let the visible text carry the name.

### `bio` comes back to the leadership projection only

Re-add `bio` to `fetchLeadership`'s projection and to `CmsLeader`.

*Why not a second query for the open leader:* fetching one author on open would add a loading state inside the modal for a field that is a couple of hundred characters. The leadership list is small — every leader of a single church — so carrying the bio in the list query costs almost nothing and makes opening a leader instant.

*Note:* `CmsLeader` currently carries a comment stating the projection deliberately omits `bio`. That comment becomes wrong and must be updated, not left to mislead the next reader.

### The modal's own layout is centered header, left-aligned bio

Portrait, name, and title centered — matching the card, so opening a leader feels like the same object enlarging. The bio below, left-aligned, because centered prose is hard to read past a couple of lines.

*Trade-off:* mixing alignments inside one panel is a small inconsistency accepted in exchange for readable prose.

### Nothing is deep-linkable

Open state lives in component state only.

*Why:* a modal reachable by URL implies it survives refresh and back-navigation, which means a route or a search param, which means `/acerca` gains a URL surface for what is a reading convenience. If leaders ever need shareable pages, that is a route per leader, not a modal — a different change.

*Consequence:* the browser Back button will not close the modal. Escape, the close button, and clicking the overlay all will, which is what the existing `SubscriptionModal` does too, so the behavior is at least consistent within the site.

## Risks / Trade-offs

- **The bio is plain text, and long bios will overflow the panel** → the panel gets `max-h-[90vh] overflow-y-auto`, the same treatment `SubscriptionModal` uses. Worth checking against the longest real bio rather than a short fixture.
- **Entries look clickable but a bio-less leader shows little new** → the modal still adds the larger portrait and the title; the alternative — making only some entries clickable — is worse, because an inconsistent grid is more confusing than a modest payoff.
- **`bio` is optional and may contain stale content** an editor never expected to be public → it was authored as an author bio and has always been visible on blog posts, so this is exposure of existing content in a new place, not new content. Worth telling whoever maintains the author documents.
- **Two active changes touch `LeadershipSection`** → this one assumes `decouple-hero-about-and-add-leadership` has landed. Implementing them out of order means editing a component that does not exist yet. Sequence, do not parallelize.
- **Radix renders the dialog in a portal at the document root** → it escapes `/acerca`'s stacking context, which is what makes the overlay work, but means the modal is unaffected by any ancestor `overflow` or `transform`. No action needed; noted because portal-rendered content is a common surprise in tests, where queries must target the whole document rather than the section's container.

## Migration Plan

Not applicable. No data migration, no schema change, no deploy ordering between repositories — this is frontend-only and ships in one deploy. Rollback is reverting the commit; the re-added `bio` in the projection is inert without the modal.

## Open Questions

- **Should the section heading gain a hint that entries are clickable?** The hover and focus affordances may be enough. Worth a look on a touch device, where hover does not exist.
- **Is there a real bio long enough to need a scroll inside the panel?** Only two authors currently have bios, both short. Confirm against the content the church actually intends to publish.
