/**
 * Smoke tests for the new CMS-driven static pages.
 * Mocks CMS hooks to return empty states and verifies pages render
 * without throwing errors.
 */
import { render, screen } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { describe, expect, it, vi } from "vitest";

// ── Mock TanStack Router — createFileRoute stores opts on the returned object ─

vi.mock("@tanstack/react-router", async (importOriginal) => {
	const actual =
		await importOriginal<typeof import("@tanstack/react-router")>();
	return {
		...actual,
		createFileRoute: (_path: string) => {
			const RouteInstance = {
				useSearch: () => ({}),
				useParams: () => ({}),
				options: {},
			};
			return (opts: Record<string, unknown>) => {
				RouteInstance.options = opts;
				return RouteInstance;
			};
		},
		useNavigate: () => vi.fn(),
		useParams: () => ({}),
		useSearch: () => ({}),
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

// ── Mock Lucide icons ─────────────────────────────────────────────────────────

vi.mock("lucide-react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("lucide-react")>();
	const Stub = () => <svg data-testid="icon" />;
	return { ...actual, Clock: Stub, MapPin: Stub };
});

// ── Mock CMS hooks ────────────────────────────────────────────────────────────

vi.mock("@/lib/hooks/useSiteSettings", () => ({
	useSiteSettings: () => ({ data: null, isLoading: false, isError: false }),
}));

vi.mock("@/lib/hooks/useNextSteps", () => ({
	useNextSteps: () => ({ data: [], isLoading: false, isError: false }),
}));

vi.mock("@/lib/hooks/useGiving", () => ({
	useGivingOptions: () => ({ data: [], isLoading: false, isError: false }),
}));

vi.mock("@/lib/hooks/useBlog", () => ({
	useBlogPosts: () => ({ data: [], isLoading: false, isError: false }),
	useBlogPostsByCategory: () => ({
		data: [],
		isLoading: false,
		isError: false,
	}),
	useBlogPost: () => ({ data: null, isLoading: false, isError: false }),
}));

vi.mock("@/lib/hooks/useCmsEvents", () => ({
	useCmsEventSeries: () => ({ data: [], isLoading: false, isError: false }),
}));

vi.mock("@/components/blog/BlogCard", () => ({
	BlogCard: ({ post }: { post: { _id: string; title: string } }) => (
		<div data-testid="blog-card">{post.title}</div>
	),
}));

vi.mock("@/lib/sanity", () => {
	const chain = {
		width: () => chain,
		height: () => chain,
		fit: () => chain,
		auto: () => chain,
		url: () => "mock-image-url",
	};
	return { sanityImageUrl: () => chain };
});

// ── Helper ────────────────────────────────────────────────────────────────────

function renderPage(ui: React.ReactElement) {
	return render(<HelmetProvider>{ui}</HelmetProvider>);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("AcercaPage", () => {
	it("renders main element without errors", async () => {
		const mod = await import("../acerca");
		const Component = mod.Route.options.component as React.ComponentType;
		renderPage(<Component />);
		expect(screen.getByRole("main")).toBeInTheDocument();
	});

	it("shows fallback content when CMS data is absent", async () => {
		const mod = await import("../acerca");
		const Component = mod.Route.options.component as React.ComponentType;
		renderPage(<Component />);
		expect(screen.getByText(/Quiénes somos/i)).toBeInTheDocument();
	});
});

describe("SiguientesPasosPage", () => {
	it("renders main element without errors", async () => {
		const mod = await import("../siguientes-pasos");
		const Component = mod.Route.options.component as React.ComponentType;
		renderPage(<Component />);
		expect(screen.getByRole("main")).toBeInTheDocument();
	});

	it("shows empty state when no steps are available", async () => {
		const mod = await import("../siguientes-pasos");
		const Component = mod.Route.options.component as React.ComponentType;
		renderPage(<Component />);
		expect(
			screen.getByText(/Próximamente tendremos más información/i),
		).toBeInTheDocument();
	});
});

describe("DarPage", () => {
	it("renders main element without errors", async () => {
		const mod = await import("../dar");
		const Component = mod.Route.options.component as React.ComponentType;
		renderPage(<Component />);
		expect(screen.getByRole("main")).toBeInTheDocument();
	});

	it("shows empty state when no giving options are available", async () => {
		const mod = await import("../dar");
		const Component = mod.Route.options.component as React.ComponentType;
		renderPage(<Component />);
		expect(
			screen.getByText(/Próximamente compartiremos cómo puedes dar/i),
		).toBeInTheDocument();
	});
});

describe("BlogListingPage", () => {
	it("renders main element without errors", async () => {
		const mod = await import("../blog/index");
		const Component = mod.Route.options.component as React.ComponentType;
		renderPage(<Component />);
		expect(screen.getByRole("main")).toBeInTheDocument();
	});

	it("shows empty state when no posts are available", async () => {
		const mod = await import("../blog/index");
		const Component = mod.Route.options.component as React.ComponentType;
		renderPage(<Component />);
		expect(
			screen.getByText("No hay publicaciones disponibles"),
		).toBeInTheDocument();
	});
});

describe("BlogPostDetailPage", () => {
	it("renders main element without errors", async () => {
		const mod = await import("../blog/$slug");
		const Component = mod.Route.options.component as React.ComponentType;
		renderPage(<Component />);
		expect(screen.getByRole("main")).toBeInTheDocument();
	});

	it("shows not found state when post is not available", async () => {
		const mod = await import("../blog/$slug");
		const Component = mod.Route.options.component as React.ComponentType;
		renderPage(<Component />);
		expect(screen.getByText("Publicación no encontrada")).toBeInTheDocument();
	});
});

describe("EventsDirectoryPage", () => {
	it("renders main element without errors", async () => {
		const mod = await import("../eventos/index");
		const Component = mod.Route.options.component as React.ComponentType;
		renderPage(<Component />);
		expect(screen.getByRole("main")).toBeInTheDocument();
	});

	it("shows empty state when no events are available", async () => {
		const mod = await import("../eventos/index");
		const Component = mod.Route.options.component as React.ComponentType;
		renderPage(<Component />);
		expect(
			screen.getByText("No hay eventos programados en este momento."),
		).toBeInTheDocument();
	});
});
