import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/eventos/$seriesSlug")({
	component: () => <Outlet />,
});
