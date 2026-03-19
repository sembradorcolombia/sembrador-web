import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/equilibrio/asistencia-confirmada")({
	beforeLoad: ({ location }) => {
		throw redirect({
			to: "/eventos/$seriesSlug/asistencia-confirmada",
			params: { seriesSlug: "equilibrio" },
			search: location.search as Record<string, string>,
		});
	},
	component: () => null,
});
