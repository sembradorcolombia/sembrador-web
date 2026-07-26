## 1. Data layer

- [ ] 1.1 Re-add `bio` to the `fetchLeadership` projection in `src/lib/services/cms.ts`
- [ ] 1.2 Re-add `bio?: string` to `CmsLeader` in `src/lib/types/cms.ts`, and correct the type's comment, which currently states the projection deliberately omits it

## 2. Modal component

- [ ] 2.1 Create `src/components/about/LeadershipModal.tsx` taking a nullable leader and an `onClose` callback, built on the existing `ui/dialog` wrapper as `SubscriptionModal` does
- [ ] 2.2 Render nothing when the leader is `null`, and set `open` from whether a leader is present
- [ ] 2.3 Lay out the panel: portrait, name as the `DialogTitle`, and leadership title centered; bio below, left-aligned; omit the title and bio cleanly when absent
- [ ] 2.4 Render the portrait at a larger size than the card's 96px via a named `sanityImageUrl` helper, keeping the chained-`.fit()` call out of the JSX to avoid the Biome lint issue
- [ ] 2.5 Give the panel `max-h-[90vh] overflow-y-auto` so a long bio scrolls inside the panel rather than overflowing the viewport

## 3. Section wiring

- [ ] 3.1 Hold the open leader in `LeadershipSection` state (`CmsLeader | null`) and render one `LeadershipModal` outside the list
- [ ] 3.2 Wrap each entry's contents in a `<button type="button">` that sets the selected leader, keeping the existing centered column layout intact
- [ ] 3.3 Mark the entry portrait decorative (empty alt) so the button announces the leader's name once rather than twice
- [ ] 3.4 Add hover and focus-visible affordances so an entry reads as interactive, and confirm the focus ring is visible against the white background
- [ ] 3.5 Leave the section's loading, error, and empty-state behavior untouched

## 4. Testing

- [ ] 4.1 Test that activating an entry opens the modal with that leader's photo, name, leadership title, and bio
- [ ] 4.2 Test that a leader with no bio still opens, showing photo, name, and title with no empty text area
- [ ] 4.3 Test that a leader with no leadership title opens without an empty subtitle
- [ ] 4.4 Test that entries are rendered as buttons carrying the leader's name as their accessible name, and that the portrait does not duplicate it
- [ ] 4.5 Test closing via the close control and via Escape, and that opening a different leader afterwards shows the new leader with no leftover content
- [ ] 4.6 Test that the bio still does not appear in the entry itself, only in the modal
- [ ] 4.7 Restore `bio` to the `MOCK_LEADERS` e2e fixture and extend the About page e2e spec to open a leader and assert the bio is visible

## 5. Verification

- [ ] 5.1 Run `pnpm check` and fix any findings
- [ ] 5.2 Run `pnpm build` and confirm the type-check passes
- [ ] 5.3 Run `pnpm test` and `pnpm test:e2e`
- [ ] 5.4 Manually verify on mobile and desktop: opening, closing by all three routes, keyboard-only operation, and a long bio scrolling within the panel
- [ ] 5.5 Answer the open questions in design.md — whether entries need a clickability hint on touch devices, and whether any real bio is long enough to scroll
