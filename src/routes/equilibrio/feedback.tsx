import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/equilibrio/feedback")({
	beforeLoad: ({ location }) => {
		throw redirect({
			to: "/eventos/$seriesSlug/feedback",
			params: { seriesSlug: "equilibrio" },
			search: location.search as Record<string, string>,
		});
	},
	component: () => null,
});
