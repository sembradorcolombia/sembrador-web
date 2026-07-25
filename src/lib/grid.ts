// ── Content-adaptive grid columns for homepage preview sections ──────────────
//
// Class strings are written out in full (never built dynamically) so Tailwind's
// scanner can see them. Sparse rows are avoided by matching the column count to
// the number of items: a lone item is clamped and left-aligned under the section
// heading, and 2 items stay clamped and centered, rather than being stretched
// across the full container width.

const GRID_BY_COUNT: Record<number, string> = {
	1: "grid-cols-1 max-w-sm",
	2: "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto",
	3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
	4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

/**
 * Grid column classes for `count` items, never exceeding `maxColumns`.
 * Counts above `maxColumns` wrap onto additional rows.
 */
export function previewGridClass(count: number, maxColumns: 3 | 4 = 4): string {
	const columns = Math.min(Math.max(count, 1), maxColumns);
	return GRID_BY_COUNT[columns];
}
