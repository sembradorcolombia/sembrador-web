import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
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

export const Route = createRootRouteWithContext<RouterContext>()({
	component: () => (
		<HelmetProvider>
			<Outlet />
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
		</HelmetProvider>
	),
});
