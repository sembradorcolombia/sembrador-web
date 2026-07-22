import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { SeoHead } from "@/components/SeoHead";

export const Route = createFileRoute("/consolidacion/registro-exitoso")({
	component: RouteComponent,
});

function RouteComponent() {
	useEffect(() => {
		if (typeof window.fbq === "function") {
			window.fbq("trackCustom", "ConsolidationSuccess");
		}
	}, []);

	return (
		<main className="bg-secondary w-full min-h-screen flex items-center justify-center px-4">
			<SeoHead title="Registro exitoso" />
			<div className="text-center max-w-md">
				<h1 className="font-grotesk-wide-medium text-3xl text-white mb-4">
					¡Registro exitoso!
				</h1>
				<p className="text-white text-lg mb-8">
					Gracias por registrarte. Nuestro equipo se pondrá en contacto contigo
					pronto.
				</p>
				<Link
					to="/"
					className="inline-block font-grotesk-wide-medium text-lg px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
				>
					Volver
				</Link>
			</div>
		</main>
	);
}
