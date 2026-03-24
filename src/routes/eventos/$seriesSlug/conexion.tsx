import { createFileRoute } from "@tanstack/react-router";
import { ConnectionForm } from "@/components/events/ConnectionForm";
import { SeoHead } from "@/components/SeoHead";

export const Route = createFileRoute("/eventos/$seriesSlug/conexion")({
	component: RouteComponent,
});

function RouteComponent() {
	const { seriesSlug } = Route.useParams();

	return (
		<main
			className={`bg-secondary w-full min-h-screen flex items-center justify-center px-4${seriesSlug === "equilibrio" ? " background-texture" : ""}`}
		>
			<SeoHead title="Conexión" />
			<ConnectionForm seriesSlug={seriesSlug} />
		</main>
	);
}
