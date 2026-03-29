import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/equilibrio/registro-exitoso")({
	beforeLoad: ({ location }) => {
		throw redirect({
			to: "/eventos/$seriesSlug/registro-exitoso",
			params: { seriesSlug: "equilibrio" },
			search: location.search as Record<string, string>,
		});
	},
	component: () => null,
});
