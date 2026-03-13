import { createFileRoute } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import { ConnectionForm } from "@/components/equilibrio/ConnectionForm";

export const Route = createFileRoute("/equilibrio/conexion")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="bg-secondary w-full min-h-screen flex items-center justify-center px-4 background-texture">
			<Helmet>
				<title>Conexión — El Sembrador</title>
			</Helmet>
			<ConnectionForm />
		</main>
	);
}
