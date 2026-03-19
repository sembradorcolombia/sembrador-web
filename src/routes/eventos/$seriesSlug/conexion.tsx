import { createFileRoute } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import { ConnectionForm } from "@/components/events/ConnectionForm";

export const Route = createFileRoute("/eventos/$seriesSlug/conexion")({
	component: RouteComponent,
});

function RouteComponent() {
	const { seriesSlug } = Route.useParams();

	return (
		<main
			className={`bg-secondary w-full min-h-screen flex items-center justify-center px-4${seriesSlug === "equilibrio" ? " background-texture" : ""}`}
		>
			<Helmet>
				<title>Conexión — El Sembrador</title>
			</Helmet>
			<ConnectionForm seriesSlug={seriesSlug} />
		</main>
	);
}
