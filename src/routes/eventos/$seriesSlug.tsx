import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";

function SeriesLayout() {
	const { seriesSlug } = useParams({ from: "/eventos/$seriesSlug" });
	return (
		<div data-theme={seriesSlug}>
			<Outlet />
		</div>
	);
}

export const Route = createFileRoute("/eventos/$seriesSlug")({
	component: SeriesLayout,
});
