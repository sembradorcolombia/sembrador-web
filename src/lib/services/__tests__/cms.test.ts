import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchMock = vi.fn();
vi.mock("@/lib/sanity", () => ({
	sanityClient: { fetch: (...args: unknown[]) => fetchMock(...args) },
}));

import { fetchAboutPage, fetchHeroByKey, fetchLeadership } from "../cms";

describe("cms service", () => {
	beforeEach(() => {
		fetchMock.mockReset();
		fetchMock.mockResolvedValue(null);
	});

	it("fetches a hero by key, taking the first match", async () => {
		await fetchHeroByKey("acerca");

		const [query, params] = fetchMock.mock.calls[0];
		expect(query).toContain('_type == "hero"');
		expect(query).toContain("key == $key");
		expect(query).toContain("[0]");
		expect(params).toEqual({ key: "acerca" });
	});

	it("resolves document file URLs on the About page", async () => {
		await fetchAboutPage();

		const [query] = fetchMock.mock.calls[0];
		expect(query).toContain('_type == "aboutPage"');
		expect(query).toContain('"fileUrl": file.asset->url');
	});

	it("filters leaders on the role, not on the leadership title", async () => {
		fetchMock.mockResolvedValue([]);
		await fetchLeadership();

		const [query] = fetchMock.mock.calls[0];
		expect(query).toContain('"leader" in roles');
		expect(query).not.toContain("defined(leadershipTitle)");
	});

	it("orders leaders by leadership order, then name, with unordered last", async () => {
		fetchMock.mockResolvedValue([]);
		await fetchLeadership();

		const [query] = fetchMock.mock.calls[0];
		expect(query).toContain(
			"order(coalesce(leadershipOrder, 9999) asc, name asc)",
		);
	});
});
