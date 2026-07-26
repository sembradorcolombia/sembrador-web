import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/sanity", () => {
	const chain = {
		width: () => chain,
		height: () => chain,
		fit: () => chain,
		url: () => "mock-leader-url",
	};
	return { sanityImageUrl: () => chain };
});

const useLeadership = vi.fn();
vi.mock("@/lib/hooks/useLeadership", () => ({
	useLeadership: () => useLeadership(),
}));

import type { CmsLeader } from "@/lib/types/cms";
import { LeadershipSection } from "../LeadershipSection";

const image = {
	_type: "image" as const,
	asset: { _ref: "image-1", _type: "reference" },
};

const leaders: CmsLeader[] = [
	{
		_id: "leader-1",
		name: "Juan Pérez",
		image: { ...image, alt: "Retrato de Juan" },
		bio: "Sirve desde 2010",
		leadershipTitle: "Pastor principal",
		leadershipOrder: 1,
	},
	{
		_id: "leader-2",
		name: "Ana Gómez",
		image,
		leadershipTitle: "Líder de alabanza",
	},
];

describe("LeadershipSection", () => {
	it("renders each leader in the order provided", () => {
		useLeadership.mockReturnValue({
			data: leaders,
			isLoading: false,
			isError: false,
		});
		render(<LeadershipSection />);

		expect(
			screen.getByRole("heading", { name: "Nuestro liderazgo" }),
		).toBeInTheDocument();

		const names = screen
			.getAllByRole("heading", { level: 3 })
			.map((heading) => heading.textContent);
		expect(names).toEqual(["Juan Pérez", "Ana Gómez"]);
		expect(screen.getByText("Pastor principal")).toBeInTheDocument();
		expect(screen.getByText("Sirve desde 2010")).toBeInTheDocument();
	});

	it("renders a leader without a bio cleanly", () => {
		useLeadership.mockReturnValue({
			data: [leaders[1]],
			isLoading: false,
			isError: false,
		});
		render(<LeadershipSection />);

		expect(screen.getByText("Ana Gómez")).toBeInTheDocument();
		expect(screen.queryByText("Sirve desde 2010")).not.toBeInTheDocument();
	});

	it("falls back to the leader's name for image alt text", () => {
		useLeadership.mockReturnValue({
			data: leaders,
			isLoading: false,
			isError: false,
		});
		render(<LeadershipSection />);

		expect(screen.getByAltText("Retrato de Juan")).toBeInTheDocument();
		expect(screen.getByAltText("Ana Gómez")).toBeInTheDocument();
	});

	it("is omitted when there are no leaders", () => {
		useLeadership.mockReturnValue({
			data: [],
			isLoading: false,
			isError: false,
		});
		const { container } = render(<LeadershipSection />);

		expect(container).toBeEmptyDOMElement();
	});

	it("shows a loading indicator while fetching", () => {
		useLeadership.mockReturnValue({
			data: undefined,
			isLoading: true,
			isError: false,
		});
		render(<LeadershipSection />);

		expect(screen.getByText("Cargando liderazgo...")).toBeInTheDocument();
	});

	it("contains a fetch failure with a Spanish message", () => {
		useLeadership.mockReturnValue({
			data: undefined,
			isLoading: false,
			isError: true,
		});
		render(<LeadershipSection />);

		expect(
			screen.getByText("No pudimos cargar el liderazgo en este momento."),
		).toBeInTheDocument();
	});
});
