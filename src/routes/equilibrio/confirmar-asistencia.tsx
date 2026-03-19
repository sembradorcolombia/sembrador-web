import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/equilibrio/confirmar-asistencia")({
	beforeLoad: ({ location }) => {
		throw redirect({
			to: "/eventos/$seriesSlug/confirmar-asistencia",
			params: { seriesSlug: "equilibrio" },
			search: location.search as Record<string, string>,
		});
	},
	component: () => null,
});
