import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

export const Route = createFileRoute("/equilibrio/registro-exitoso")({
	component: RouteComponent,
});

function RouteComponent() {
	useEffect(() => {
		if (typeof window.fbq === "function") {
			window.fbq("trackCustom", "SubscribeSuccess");
		}
	}, []);

	return (
		<main className="bg-secondary w-full min-h-screen flex items-center justify-center px-4">
			<Helmet>
				<title>Registro exitoso — El Sembrador</title>
			</Helmet>
			<div className="text-center max-w-md">
				<h1 className="font-grotesk-wide-medium text-3xl text-white mb-4">
					¡Inscripción exitosa!
				</h1>
				<p className="text-white/80 text-lg mb-8">
					Te esperamos en el evento. Revisa tu correo para más detalles.
				</p>
				<Link
					to="/equilibrio"
					className="inline-block font-grotesk-wide-medium text-lg px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
				>
					Volver a eventos
				</Link>
			</div>
		</main>
	);
}
