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

const useSiteSettings = vi.fn();
vi.mock("@/lib/hooks/useSiteSettings", () => ({
	useSiteSettings: () => useSiteSettings(),
}));

import { HeroSection } from "../HeroSection";

const settings = {
	_id: "site-settings",
	churchName: "El Sembrador",
	tagline: "Comunidad de fe",
	aboutServiceTimes: "Domingos 9:00 AM",
	address: "Calle 10, Medellín",
	googleMapsUrl: "https://maps.example.com",
};

describe("HeroSection", () => {
	it("renders the service pills from site settings over the hero", () => {
		useSiteSettings.mockReturnValue({ data: settings });
		useHero.mockReturnValue({
			data: {
				_id: "hero-home",
				key: "home",
				heading: "Bienvenidos",
				backgroundImage: { _type: "image", asset: { _ref: "image-1" } },
			},
			isLoading: false,
		});

		render(<HeroSection />);

		expect(
			screen.getByRole("heading", { level: 1, name: "Bienvenidos" }),
		).toBeInTheDocument();
		expect(screen.getByText("Domingos 9:00 AM")).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /Calle 10, Medellín/ }),
		).toHaveAttribute("href", "https://maps.example.com");
	});

	it('falls back to "Conocer más" when the hero defines no CTA', () => {
		useSiteSettings.mockReturnValue({ data: settings });
		useHero.mockReturnValue({
			data: {
				_id: "hero-home",
				key: "home",
				heading: "Bienvenidos",
				backgroundImage: { _type: "image", asset: { _ref: "image-1" } },
			},
			isLoading: false,
		});

		render(<HeroSection />);

		expect(screen.getByRole("link", { name: "Conocer más" })).toHaveAttribute(
			"href",
			"/acerca",
		);
	});

	it("renders the CMS CTA instead of the fallback", () => {
		useSiteSettings.mockReturnValue({ data: settings });
		useHero.mockReturnValue({
			data: {
				_id: "hero-home",
				key: "home",
				heading: "Bienvenidos",
				backgroundImage: { _type: "image", asset: { _ref: "image-1" } },
				cta: { text: "Ver eventos", link: "/eventos" },
			},
			isLoading: false,
		});

		render(<HeroSection />);

		expect(
			screen.queryByRole("link", { name: "Conocer más" }),
		).not.toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "Ver eventos" }),
		).toBeInTheDocument();
	});
});
