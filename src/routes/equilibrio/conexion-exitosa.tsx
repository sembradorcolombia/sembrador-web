import { createFileRoute, Link } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";

export const Route = createFileRoute("/equilibrio/conexion-exitosa")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="bg-secondary w-full min-h-screen flex items-center justify-center px-4 background-texture">
			<Helmet>
				<title>¡Gracias! — El Sembrador</title>
			</Helmet>
			<div className="text-center max-w-md">
				<h1 className="font-grotesk-wide-medium text-3xl text-white mb-4">
					¡Gracias por tu respuesta!
				</h1>
				<p className="text-white text-lg mb-8">
					¡Qué emoción que quieras conectar con nuestra comunidad! Muy pronto
					nos pondremos en contacto contigo.
				</p>
				<Link
					to="/equilibrio"
					className="inline-block font-grotesk-wide-medium text-lg px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
				>
					Volver
				</Link>
			</div>
		</main>
	);
}
