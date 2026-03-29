import { createFileRoute, Link } from "@tanstack/react-router";
import { SeoHead } from "@/components/SeoHead";

export const Route = createFileRoute(
	"/eventos/$seriesSlug/asistencia-confirmada",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { seriesSlug } = Route.useParams();

	return (
		<main
			className={`bg-secondary w-full min-h-screen flex items-center justify-center px-4${seriesSlug === "equilibrio" ? " background-texture" : ""}`}
		>
			<SeoHead title="Asistencia confirmada" />
			<div className="text-center max-w-md">
				<h1 className="font-grotesk-wide-medium text-3xl text-white mb-4">
					¡Asistencia confirmada!
				</h1>
				<p className="text-white text-lg mb-8">
					Te esperamos en el evento. ¡Nos vemos pronto!
				</p>
				<Link
					to="/eventos/$seriesSlug"
					params={{ seriesSlug }}
					className="inline-block font-grotesk-wide-medium text-lg px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
				>
					Volver
				</Link>
			</div>
		</main>
	);
}
