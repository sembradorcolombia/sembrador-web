/**
 * Tests for the dashboard shell: tab switching, per-section data loading,
 * and section-scoped error handling.
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// ── Mock TanStack Router — createFileRoute stores opts on the returned object ─

vi.mock("@tanstack/react-router", async (importOriginal) => {
	const actual =
		await importOriginal<typeof import("@tanstack/react-router")>();
	const RouteInstance = {
		useRouteContext: () => ({ auth: { user: { email: "admin@example.com" } } }),
		options: {} as Record<string, unknown>,
	};
	return {
		...actual,
		createFileRoute: (_path: string) => (opts: Record<string, unknown>) => {
			RouteInstance.options = opts;
			return RouteInstance;
		},
		useNavigate: () => vi.fn(),
		redirect: vi.fn(),
	};
});

vi.mock("@/lib/supabase", () => ({
	supabase: { auth: { getSession: vi.fn() } },
}));

vi.mock("@/lib/services/auth", () => ({
	signOut: vi.fn(),
}));

// ── Mock the two section data hooks ──────────────────────────────────────────

const useDashboardData = vi.fn();
const useConsolidationRegistrations = vi.fn();

vi.mock("@/lib/hooks/useDashboardData", () => ({
	useDashboardData: () => useDashboardData(),
}));

vi.mock("@/lib/hooks/useConsolidationRegistrations", () => ({
	useConsolidationRegistrations: () => useConsolidationRegistrations(),
}));

vi.mock("@/lib/hooks/useUpdateAttendance", () => ({
	useUpdateAttendance: () => ({ isPending: false, mutate: vi.fn() }),
}));

import { Route } from "../dashboard";

const DashboardPage = () => {
	// biome-ignore lint/suspicious/noExplicitAny: the mocked route exposes options loosely
	const Component = (Route.options as any).component;
	return <Component />;
};

beforeEach(() => {
	vi.clearAllMocks();
	useDashboardData.mockReturnValue({
		data: [],
		isLoading: false,
		isError: false,
	});
	useConsolidationRegistrations.mockReturnValue({
		data: [],
		isLoading: false,
		isError: false,
	});
});

describe("Dashboard shell", () => {
	it("shows the Eventos tab as active on first load", () => {
		render(<DashboardPage />);

		expect(screen.getByRole("tab", { name: "Eventos" })).toHaveAttribute(
			"aria-selected",
			"true",
		);
		expect(screen.getByRole("tab", { name: "Consolidación" })).toHaveAttribute(
			"aria-selected",
			"false",
		);
	});

	it("does not fetch consolidation data while Eventos is active", () => {
		render(<DashboardPage />);

		expect(useDashboardData).toHaveBeenCalled();
		expect(useConsolidationRegistrations).not.toHaveBeenCalled();
	});

	it("renders the consolidation section when its tab is activated", async () => {
		const user = userEvent.setup();
		render(<DashboardPage />);

		await user.click(screen.getByRole("tab", { name: "Consolidación" }));

		expect(
			screen.getByRole("heading", { name: "Consolidación" }),
		).toBeVisible();
		expect(useConsolidationRegistrations).toHaveBeenCalled();
		expect(screen.getByRole("tab", { name: "Consolidación" })).toHaveAttribute(
			"aria-selected",
			"true",
		);
	});

	it("returns to the events section when Eventos is activated again", async () => {
		const user = userEvent.setup();
		render(<DashboardPage />);

		await user.click(screen.getByRole("tab", { name: "Consolidación" }));
		await user.click(screen.getByRole("tab", { name: "Eventos" }));

		expect(
			screen.queryByRole("heading", { name: "Consolidación" }),
		).not.toBeInTheDocument();
		expect(screen.getByRole("tab", { name: "Eventos" })).toHaveAttribute(
			"aria-selected",
			"true",
		);
	});

	it("keeps the header, logout button and tabs when a section fails", () => {
		useDashboardData.mockReturnValue({
			data: undefined,
			isLoading: false,
			isError: true,
		});

		render(<DashboardPage />);

		expect(screen.getByText("Error al cargar los datos.")).toBeInTheDocument();
		expect(screen.getByText("El Sembrador — Dashboard")).toBeInTheDocument();
		expect(screen.getByText("admin@example.com")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Salir/i })).toBeInTheDocument();
		expect(screen.getByRole("tab", { name: "Eventos" })).toBeInTheDocument();
		expect(
			screen.getByRole("tab", { name: "Consolidación" }),
		).toBeInTheDocument();
	});

	it("keeps the shell when the consolidation section fails", async () => {
		const user = userEvent.setup();
		useConsolidationRegistrations.mockReturnValue({
			data: undefined,
			isLoading: false,
			isError: true,
		});

		render(<DashboardPage />);
		await user.click(screen.getByRole("tab", { name: "Consolidación" }));

		expect(
			screen.getByText("Error al cargar los registros."),
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Salir/i })).toBeInTheDocument();
		expect(screen.getByRole("tab", { name: "Eventos" })).toBeInTheDocument();
	});
});
