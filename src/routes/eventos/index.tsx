import { createFileRoute, Link } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import { useCmsEventSeries } from "@/lib/hooks/useCmsEvents";
import { sanityImageUrl } from "@/lib/sanity";

export const Route = createFileRoute("/eventos/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: eventSeries, isLoading, isError } = useCmsEventSeries();

	if (isLoading) {
		return (
			<main className="bg-secondary w-full min-h-screen flex items-center justify-center">
				<p className="text-white text-xl">Cargando eventos...</p>
			</main>
		);
	}

	if (isError) {
		return (
			<main className="bg-secondary w-full min-h-screen flex items-center justify-center">
				<p className="text-red-400 text-xl">Error al cargar eventos</p>
			</main>
		);
	}

	const activeSeries = eventSeries?.filter((s) => s.isActive) ?? [];

	if (activeSeries.length === 0) {
		return (
			<main className="bg-secondary w-full min-h-screen flex items-center justify-center px-4 background-texture">
				<Helmet>
					<title>Eventos — El Sembrador</title>
				</Helmet>
				<div className="text-center max-w-md">
					<h1 className="font-grotesk-wide-medium text-3xl text-white mb-4">
						Eventos
					</h1>
					<p className="text-white text-lg">
						No hay eventos programados en este momento.
					</p>
				</div>
			</main>
		);
	}

	return (
		<main className="bg-secondary w-full min-h-screen px-4 py-16 background-texture">
			<Helmet>
				<title>Eventos — El Sembrador</title>
			</Helmet>
			<div className="max-w-4xl mx-auto">
				<h1 className="font-grotesk-wide-medium text-4xl text-white mb-12 text-center">
					Eventos
				</h1>
				<div className="grid gap-8 md:grid-cols-2">
					{activeSeries.map((series) => {
						const logoUrl = series.logo
							? sanityImageUrl(series.logo).width(400).url()
							: null;

						return (
							<Link
								key={series._id}
								to="/eventos/$seriesSlug"
								params={{ seriesSlug: series.slug.current }}
								className="block bg-white/10 rounded-xl p-6 hover:bg-white/20 transition-colors"
							>
								{logoUrl ? (
									<img
										src={logoUrl}
										alt={series.name}
										className="h-16 w-auto mb-4"
									/>
								) : (
									<h2 className="font-grotesk-compact-black text-2xl text-white uppercase mb-4">
										{series.name}
									</h2>
								)}
								{series.description && (
									<p className="text-white/80 text-sm">{series.description}</p>
								)}
							</Link>
						);
					})}
				</div>
			</div>
		</main>
	);
}
