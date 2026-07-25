/**
 * Tests for the consolidation read path — specifically that the fetch pages
 * through Supabase instead of stopping at the first response.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ConsolidationRegistration } from "../consolidation";

const range = vi.fn();

vi.mock("@/lib/supabase", () => ({
	supabase: {
		from: () => ({
			select: () => ({
				order: () => ({
					range: (from: number, to: number) => range(from, to),
				}),
			}),
		}),
	},
}));

import { fetchConsolidationRegistrations } from "../consolidation";

const PAGE_SIZE = 1000;

function makeRows(count: number, offset = 0): ConsolidationRegistration[] {
	return Array.from({ length: count }, (_, i) => ({
		id: `reg-${offset + i + 1}`,
		name: `Nombre${offset + i + 1}`,
		lastname: "Apellido",
		email: `persona${offset + i + 1}@example.com`,
		mobile: "3001111111",
		next_step: "Discipulado 1:1",
		comment: null,
		accepts_data_policy: true,
		created_at: "2026-06-15T10:00:00Z",
	}));
}

beforeEach(() => {
	range.mockReset();
});

describe("fetchConsolidationRegistrations", () => {
	it("returns a single short page without asking for another", async () => {
		range.mockResolvedValueOnce({ data: makeRows(3), error: null });

		const result = await fetchConsolidationRegistrations();

		expect(result).toHaveLength(3);
		expect(range).toHaveBeenCalledTimes(1);
		expect(range).toHaveBeenCalledWith(0, PAGE_SIZE - 1);
	});

	it("pages until a short page is returned", async () => {
		range
			.mockResolvedValueOnce({ data: makeRows(PAGE_SIZE), error: null })
			.mockResolvedValueOnce({
				data: makeRows(42, PAGE_SIZE),
				error: null,
			});

		const result = await fetchConsolidationRegistrations();

		expect(result).toHaveLength(PAGE_SIZE + 42);
		expect(range).toHaveBeenCalledTimes(2);
		expect(range).toHaveBeenNthCalledWith(1, 0, PAGE_SIZE - 1);
		expect(range).toHaveBeenNthCalledWith(2, PAGE_SIZE, PAGE_SIZE * 2 - 1);
		// Rows accumulate across pages in order, with no duplicates or gaps.
		expect(result[0].id).toBe("reg-1");
		expect(result[PAGE_SIZE].id).toBe(`reg-${PAGE_SIZE + 1}`);
		expect(new Set(result.map((r) => r.id)).size).toBe(result.length);
	});

	it("stops when an exactly-full last page is followed by an empty one", async () => {
		range
			.mockResolvedValueOnce({ data: makeRows(PAGE_SIZE), error: null })
			.mockResolvedValueOnce({ data: [], error: null });

		const result = await fetchConsolidationRegistrations();

		expect(result).toHaveLength(PAGE_SIZE);
		expect(range).toHaveBeenCalledTimes(2);
	});

	it("returns an empty array when there are no registrations", async () => {
		range.mockResolvedValueOnce({ data: [], error: null });

		await expect(fetchConsolidationRegistrations()).resolves.toEqual([]);
		expect(range).toHaveBeenCalledTimes(1);
	});

	it("throws when Supabase returns an error", async () => {
		range.mockResolvedValueOnce({
			data: null,
			error: { message: "permission denied" },
		});

		await expect(fetchConsolidationRegistrations()).rejects.toEqual({
			message: "permission denied",
		});
	});
});
