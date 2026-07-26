import { createFileRoute, Link } from "@tanstack/react-router";
import { SeoHead } from "@/components/SeoHead";
import { Hero } from "@/components/ui/Hero";
import { useCmsEventSeries } from "@/lib/hooks/useCmsEvents";
import { sanityImageUrl } from "@/lib/sanity";

export const Route = createFileRoute("/eventos/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: eventSeries, isLoading, isError } = useCmsEventSeries();

	const activeSeries = eventSeries?.filter((s) => s.isActive) ?? [];

	return (
		<main className="bg-secondary w-full min-h-screen">
			<SeoHead title="Eventos" />

			<Hero
				heroKey="eventos"
				fallbackHeading="Eventos"
				fallbackLeadText="Encuentros para toda la comunidad"
			/>

			<div className="max-w-4xl mx-auto px-4 py-16">
				{isLoading && (
					<p className="text-white text-xl text-center py-24">
						Cargando eventos...
					</p>
				)}

				{isError && (
					<p className="text-red-400 text-xl text-center py-24">
						Error al cargar eventos
					</p>
				)}

				{!isLoading && !isError && activeSeries.length === 0 && (
					<p className="text-white text-lg text-center py-24">
						No hay eventos programados en este momento.
					</p>
				)}

				{activeSeries.length > 0 && (
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
										<p className="text-white/80 text-sm">
											{series.description}
										</p>
									)}
								</Link>
							);
						})}
					</div>
				)}
			</div>
		</main>
	);
}
