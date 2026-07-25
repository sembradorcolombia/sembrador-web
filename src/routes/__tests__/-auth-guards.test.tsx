/**
 * Tests for the `beforeLoad` guards on /dashboard and /login, plus the expiry
 * notice on the login page.
 *
 * The guards are exercised through the options object `createFileRoute` is
 * called with, the same way the dashboard shell test reaches its component.
 */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const redirect = vi.fn((opts: unknown) => {
	// The real redirect() throws a router-handled object; throwing a tagged
	// marker lets the tests assert on the target without a router.
	const marker = new Error("REDIRECT") as Error & { opts: unknown };
	marker.opts = opts;
	return marker;
});

const search: { expired?: boolean } = {};

vi.mock("@tanstack/react-router", async (importOriginal) => {
	const actual =
		await importOriginal<typeof import("@tanstack/react-router")>();
	const makeRoute = () => ({
		useRouteContext: () => ({ auth: { user: { email: "a@example.com" } } }),
		useSearch: () => search,
		options: {} as Record<string, unknown>,
	});
	const routes = new Map<string, ReturnType<typeof makeRoute>>();
	return {
		...actual,
		createFileRoute: (path: string) => (opts: Record<string, unknown>) => {
			const route = routes.get(path) ?? makeRoute();
			route.options = opts;
			routes.set(path, route);
			return route;
		},
		useNavigate: () => vi.fn(),
		redirect: (opts: unknown) => redirect(opts),
	};
});

const verifyAdminSession = vi.fn();

vi.mock("@/lib/services/auth", () => ({
	verifyAdminSession: () => verifyAdminSession(),
	signIn: vi.fn(),
	signOut: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
	supabase: { auth: {} },
}));

import { Route as DashboardRoute } from "../dashboard";
import { Route as LoginRoute } from "../login";

type Guard = () => Promise<void>;

const dashboardGuard = () =>
	(DashboardRoute.options as { beforeLoad: Guard }).beforeLoad();
const loginGuard = () =>
	(LoginRoute.options as { beforeLoad: Guard }).beforeLoad();

/** Runs a guard and returns the redirect options, or null if it allowed. */
async function runGuard(guard: Guard) {
	try {
		await guard();
		return null;
	} catch (thrown) {
		return (thrown as { opts: { to: string; search?: unknown } }).opts;
	}
}

beforeEach(() => {
	vi.clearAllMocks();
	delete search.expired;
});

describe("/dashboard guard", () => {
	it("admits a server-validated admin", async () => {
		verifyAdminSession.mockResolvedValue("admin");

		expect(await runGuard(dashboardGuard)).toBeNull();
	});

	it("redirects a rejected session with the expiry flag", async () => {
		// Covers the tampered-storage and expired-session cases alike: whatever
		// the browser stored, the server said no.
		verifyAdminSession.mockResolvedValue("rejected");

		expect(await runGuard(dashboardGuard)).toEqual({
			to: "/login",
			search: { expired: true },
		});
	});

	it("redirects an anonymous visitor without claiming anything expired", async () => {
		verifyAdminSession.mockResolvedValue("anonymous");

		expect(await runGuard(dashboardGuard)).toEqual({
			to: "/login",
			search: {},
		});
	});

	it("fails closed when verification rejects", async () => {
		// verifyAdminSession() absorbs its own errors, but if it ever throws the
		// guard must still deny rather than let the route load.
		verifyAdminSession.mockRejectedValue(new Error("boom"));

		await expect(dashboardGuard()).rejects.toThrow();
	});
});

describe("/login guard", () => {
	it("sends a validated admin to the dashboard", async () => {
		verifyAdminSession.mockResolvedValue("admin");

		expect(await runGuard(loginGuard)).toEqual({ to: "/dashboard" });
	});

	it("shows the form for a rejected session instead of looping", async () => {
		verifyAdminSession.mockResolvedValue("rejected");

		expect(await runGuard(loginGuard)).toBeNull();
	});

	it("shows the form for an anonymous visitor", async () => {
		verifyAdminSession.mockResolvedValue("anonymous");

		expect(await runGuard(loginGuard)).toBeNull();
	});
});

describe("login expiry notice", () => {
	const LoginPage = () => {
		// biome-ignore lint/suspicious/noExplicitAny: the mocked route exposes options loosely
		const Component = (LoginRoute.options as any).component;
		return <Component />;
	};

	it("renders the notice when the session expired", () => {
		search.expired = true;
		render(<LoginPage />);

		expect(
			screen.getByText("Tu sesión expiró, vuelve a iniciar sesión"),
		).toBeInTheDocument();
	});

	it("shows no notice on a plain visit", () => {
		render(<LoginPage />);

		expect(screen.queryByText(/expiró/)).not.toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Ingresar" })).toBeVisible();
	});
});
