import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/equilibrio")({
	beforeLoad: ({ location }) => {
		// Redirect /equilibrio to /eventos/equilibrio preserving search params
		throw redirect({
			to: "/eventos/$seriesSlug",
			params: { seriesSlug: "equilibrio" },
			search: location.search as Record<string, string>,
		});
	},
	component: () => <Outlet />,
});
