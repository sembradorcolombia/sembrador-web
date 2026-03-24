import {
	createRootRouteWithContext,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Toaster } from "sonner";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import type { AuthState } from "@/lib/hooks/useAuth";

const TanStackDevtools = import.meta.env.DEV
	? lazy(() =>
			import("@tanstack/react-devtools").then((m) => ({
				default: m.TanStackDevtools,
			})),
		)
	: () => null;

const TanStackRouterDevtoolsPanel = import.meta.env.DEV
	? lazy(() =>
			import("@tanstack/react-router-devtools").then((m) => ({
				default: m.TanStackRouterDevtoolsPanel,
			})),
		)
	: () => null;

interface RouterContext {
	auth: AuthState;
}

/**
 * Routes that should NOT render the shared Navbar/Footer layout.
 * These routes have their own custom layouts (dashboard, login, event showcases).
 */
const LAYOUT_OPT_OUT_PREFIXES = ["/dashboard", "/login", "/equilibrio"];

function RootComponent() {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	const showLayout = !LAYOUT_OPT_OUT_PREFIXES.some(
		(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
	);

	return (
		<>
			{showLayout && <Navbar />}
			<Outlet />
			{showLayout && <Footer />}
			<Toaster richColors />
			{import.meta.env.DEV && (
				<Suspense>
					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							{
								name: "El Sembrador Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
						]}
					/>
				</Suspense>
			)}
		</>
	);
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
});
