import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/equilibrio/feedback-exitoso")({
	beforeLoad: ({ location }) => {
		throw redirect({
			to: "/eventos/$seriesSlug/feedback-exitoso",
			params: { seriesSlug: "equilibrio" },
			search: location.search as Record<string, string>,
		});
	},
	component: () => null,
});
