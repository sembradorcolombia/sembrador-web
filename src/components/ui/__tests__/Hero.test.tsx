import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", async (importOriginal) => {
	const actual =
		await importOriginal<typeof import("@tanstack/react-router")>();
	return {
		...actual,
		Link: ({
			children,
			to,
			...rest
		}: {
			children?: React.ReactNode;
			to: string;
		} & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
			<a href={to} {...rest}>
				{children}
			</a>
		),
	};
});

vi.mock("@/lib/sanity", () => {
	const chain = {
		width: () => chain,
		height: () => chain,
		fit: () => chain,
		quality: () => chain,
		auto: () => chain,
		url: () => "mock-hero-url",
	};
	return { sanityImageUrl: () => chain };
});

const useHero = vi.fn();
vi.mock("@/lib/hooks/useHero", () => ({
	useHero: (key: string) => useHero(key),
}));

import type { CmsHero } from "@/lib/types/cms";
import { Hero } from "../Hero";

const mockHero: CmsHero = {
	_id: "hero-home",
	key: "home",
	heading: "Bienvenidos",
	backgroundImage: {
		_type: "image",
		asset: { _ref: "image-1", _type: "reference" },
	},
	leadText: "Una comunidad de fe",
	cta: { text: "Ver eventos", link: "/eventos" },
};

function renderHero(props: Partial<React.ComponentProps<typeof Hero>> = {}) {
	return render(
		<Hero heroKey="home" fallbackHeading="El Sembrador" {...props} />,
	);
}

describe("Hero", () => {
	it("renders heading, lead text and CTA from the CMS", () => {
		useHero.mockReturnValue({ data: mockHero, isLoading: false });
		renderHero();

		expect(
			screen.getByRole("heading", { level: 1, name: "Bienvenidos" }),
		).toBeInTheDocument();
		expect(screen.getByText("Una comunidad de fe")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Ver eventos" })).toHaveAttribute(
			"href",
			"/eventos",
		);
	});

	it("omits lead text and CTA when the hero defines neither", () => {
		useHero.mockReturnValue({
			data: { ...mockHero, leadText: undefined, cta: undefined },
			isLoading: false,
		});
		renderHero();

		expect(screen.queryByText("Una comunidad de fe")).not.toBeInTheDocument();
		expect(screen.queryByRole("link")).not.toBeInTheDocument();
	});

	it("opens an external CTA in a new tab", () => {
		useHero.mockReturnValue({
			data: {
				...mockHero,
				cta: { text: "Donar", link: "https://example.com/donar" },
			},
			isLoading: false,
		});
		renderHero();

		const link = screen.getByRole("link", { name: "Donar" });
		expect(link).toHaveAttribute("target", "_blank");
		expect(link).toHaveAttribute("rel", "noopener noreferrer");
	});

	it("renders a skeleton while loading", () => {
		useHero.mockReturnValue({ data: undefined, isLoading: true });
		renderHero();

		expect(screen.getByTestId("hero-skeleton")).toBeInTheDocument();
		expect(screen.queryByRole("heading")).not.toBeInTheDocument();
	});

	it("falls back to the provided heading, lead text and CTA when no hero exists", () => {
		useHero.mockReturnValue({ data: null, isLoading: false });
		renderHero({
			fallbackLeadText: "Texto por defecto",
			fallbackCta: { text: "Conocer más", link: "/acerca" },
		});

		expect(
			screen.getByRole("heading", { level: 1, name: "El Sembrador" }),
		).toBeInTheDocument();
		expect(screen.getByText("Texto por defecto")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Conocer más" })).toHaveAttribute(
			"href",
			"/acerca",
		);
	});

	it("renders the compact banner by default and the full one on request", () => {
		useHero.mockReturnValue({ data: mockHero, isLoading: false });

		const { container, rerender } = renderHero();
		expect(container.querySelector("section")).toHaveClass("min-h-[40vh]");

		rerender(
			<Hero heroKey="home" variant="full" fallbackHeading="El Sembrador" />,
		);
		expect(container.querySelector("section")).toHaveClass("min-h-[70vh]");
	});

	it("renders children over the banner", () => {
		useHero.mockReturnValue({ data: mockHero, isLoading: false });
		renderHero({ children: <p>Domingos 10:00 AM</p> });

		expect(screen.getByText("Domingos 10:00 AM")).toBeInTheDocument();
	});
});
