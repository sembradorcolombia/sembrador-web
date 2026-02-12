import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";

export const Route = createRootRoute({
	component: () => (
		<HelmetProvider>
			<Outlet />
			<Toaster richColors />
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
		</HelmetProvider>
	),
});
