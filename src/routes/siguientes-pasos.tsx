import { createFileRoute } from "@tanstack/react-router";
import { StepCard } from "@/components/next-steps/StepCard";
import { SeoHead } from "@/components/SeoHead";
import { useNextSteps } from "@/lib/hooks/useNextSteps";

export const Route = createFileRoute("/siguientes-pasos")({
	component: SiguientesPasosPage,
});

// ── Component ────────────────────────────────────────────────────────────────

function SiguientesPasosPage() {
	const { data: steps, isLoading, isError } = useNextSteps();

	return (
		<main className="bg-white min-h-screen">
			<SeoHead
				title="Siguientes Pasos"
				description="Descubre los siguientes pasos en tu camino de fe con la iglesia El Sembrador Colombia."
			/>

			{/* Header */}
			<div className="bg-secondary py-16 px-4">
				<div className="max-w-4xl mx-auto text-center">
					<h1 className="font-grotesk-compact-black text-4xl md:text-5xl text-white mb-4 uppercase">
						Siguientes Pasos
					</h1>
					<p className="text-white/80 text-lg">
						Caminos para crecer en tu fe y conectarte con nuestra comunidad
					</p>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-6xl mx-auto px-4 py-16">
				{/* Loading state */}
				{isLoading && (
					<div className="flex items-center justify-center py-24">
						<p className="text-gray-500 text-lg">Cargando...</p>
					</div>
				)}

				{/* Error state */}
				{isError && (
					<div className="flex items-center justify-center py-24">
						<p className="text-red-500 text-lg">
							No pudimos cargar los pasos en este momento.
						</p>
					</div>
				)}

				{/* Empty state */}
				{!isLoading && !isError && (!steps || steps.length === 0) && (
					<div className="flex flex-col items-center justify-center py-24 text-center">
						<p className="text-gray-500 text-xl">
							Próximamente tendremos más información
						</p>
					</div>
				)}

				{/* Step cards grid — responsive: 1 col mobile, 2-3 cols desktop */}
				{steps && steps.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{steps.map((step) => (
							<StepCard key={step._id} step={step} />
						))}
					</div>
				)}
			</div>
		</main>
	);
}
