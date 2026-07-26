/**
 * `/acerca` section composition — in particular that sections sourced
 * independently of the `aboutPage` query survive its loading and error states.
 */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", async (importOriginal) => {
	const actual =
		await importOriginal<typeof import("@tanstack/react-router")>();
	return {
		...actual,
		createFileRoute: (_path: string) => {
			const RouteInstance = { options: {} };
			return (opts: Record<string, unknown>) => {
				RouteInstance.options = opts;
				return RouteInstance;
			};
		},
		Link: ({
			children,
			...rest
		}: {
			children?: React.ReactNode;
		} & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
			<a {...rest}>{children}</a>
		),
	};
});

vi.mock("lucide-react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("lucide-react")>();
	const Stub = () => <svg data-testid="icon" />;
	return { ...actual, Clock: Stub, MapPin: Stub, FileText: Stub };
});

vi.mock("@/lib/sanity", () => {
	const chain = {
		width: () => chain,
		height: () => chain,
		fit: () => chain,
		quality: () => chain,
		auto: () => chain,
		url: () => "mock-image-url",
	};
	return { sanityImageUrl: () => chain };
});

vi.mock("@/lib/hooks/useHero", () => ({
	useHero: () => ({ data: null, isLoading: false, isError: false }),
}));

const useAboutPage = vi.fn();
vi.mock("@/lib/hooks/useAboutPage", () => ({
	useAboutPage: () => useAboutPage(),
}));

const useLeadership = vi.fn();
vi.mock("@/lib/hooks/useLeadership", () => ({
	useLeadership: () => useLeadership(),
}));

vi.mock("@/lib/hooks/useSiteSettings", () => ({
	useSiteSettings: () => ({
		data: {
			_id: "site-settings",
			churchName: "El Sembrador",
			tagline: "Comunidad de fe",
			aboutLocation: "Medellín, Antioquia",
			aboutServiceTimes: "Domingos 10:00 AM",
		},
		isLoading: false,
		isError: false,
	}),
}));

import { Route } from "../acerca";

const leaders = [
	{
		_id: "leader-1",
		name: "Juan Pérez",
		image: { _type: "image" as const, asset: { _ref: "image-1" } },
		leadershipTitle: "Pastor principal",
	},
];

function renderAcerca() {
	const Component = Route.options.component as React.ComponentType;
	return render(<Component />);
}

describe("AcercaPage", () => {
	beforeEach(() => {
		useLeadership.mockReturnValue({
			data: leaders,
			isLoading: false,
			isError: false,
		});
	});

	it("shows a loading indicator while the About content is fetched", () => {
		useAboutPage.mockReturnValue({
			data: undefined,
			isLoading: true,
			isError: false,
		});
		renderAcerca();

		expect(screen.getByText("Cargando información...")).toBeInTheDocument();
	});

	it("shows a Spanish error message when the About content fails", () => {
		useAboutPage.mockReturnValue({
			data: undefined,
			isLoading: false,
			isError: true,
		});
		renderAcerca();

		expect(
			screen.getByText("No pudimos cargar la información en este momento."),
		).toBeInTheDocument();
	});

	it("keeps the hero, leadership and service info when the About content fails", () => {
		useAboutPage.mockReturnValue({
			data: undefined,
			isLoading: false,
			isError: true,
		});
		renderAcerca();

		// Hero still renders its fallback heading
		expect(
			screen.getByRole("heading", { level: 1, name: "Acerca" }),
		).toBeInTheDocument();

		// Leadership comes from its own query
		expect(
			screen.getByRole("heading", { name: "Nuestro liderazgo" }),
		).toBeInTheDocument();
		expect(screen.getByText("Juan Pérez")).toBeInTheDocument();

		// Location and service times come from site settings
		expect(screen.getByText("Medellín, Antioquia")).toBeInTheDocument();
		expect(screen.getByText("Domingos 10:00 AM")).toBeInTheDocument();
	});

	it("keeps leadership and service info while the About content loads", () => {
		useAboutPage.mockReturnValue({
			data: undefined,
			isLoading: true,
			isError: false,
		});
		renderAcerca();

		expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
		expect(screen.getByText("Medellín, Antioquia")).toBeInTheDocument();
	});
});
