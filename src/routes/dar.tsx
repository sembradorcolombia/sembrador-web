import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { GivingOptionCard } from "@/components/give/GivingOptionCard";
import { SeoHead } from "@/components/SeoHead";
import { useGivingOptions } from "@/lib/hooks/useGiving";

export const Route = createFileRoute("/dar")({
	component: DarPage,
});

// ── Component ────────────────────────────────────────────────────────────────

function DarPage() {
	const { data: options, isLoading, isError } = useGivingOptions();

	// GA4 custom event: giving page view
	useEffect(() => {
		if (typeof window.gtag === "function") {
			window.gtag("event", "giving_page_view", {});
		}
	}, []);

	return (
		<main className="bg-white min-h-screen">
			<SeoHead
				title="Dar"
				description="Apoya la misión de El Sembrador Colombia con tu ofrenda. Conoce las distintas formas de dar."
			/>

			{/* Header */}
			<div className="bg-secondary py-16 px-4 background-texture">
				<div className="max-w-4xl mx-auto text-center">
					<h1 className="font-grotesk-compact-black text-4xl md:text-5xl text-white mb-4 uppercase">
						Dar
					</h1>
					<p className="text-white/80 text-lg">
						Tu generosidad hace posible la misión de nuestra iglesia
					</p>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-5xl mx-auto px-4 py-16">
				{/* Loading state */}
				{isLoading && (
					<div className="flex items-center justify-center py-24">
						<p className="text-gray-500 text-lg">
							Cargando opciones de donación...
						</p>
					</div>
				)}

				{/* Error state */}
				{isError && (
					<div className="flex items-center justify-center py-24">
						<p className="text-red-500 text-lg">
							No pudimos cargar las opciones de donación. Intenta más tarde.
						</p>
					</div>
				)}

				{/* Empty state */}
				{!isLoading && !isError && (!options || options.length === 0) && (
					<div className="flex flex-col items-center justify-center py-24 text-center gap-4">
						<p className="text-gray-500 text-xl">
							Próximamente compartiremos cómo puedes dar.
						</p>
						<p className="text-gray-400 text-sm">
							Para más información contáctanos a través de nuestras redes
							sociales.
						</p>
					</div>
				)}

				{/* Giving option cards — responsive: 1 col mobile, 2 cols desktop */}
				{options && options.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{options.map((option) => (
							<GivingOptionCard key={option._id} option={option} />
						))}
					</div>
				)}
			</div>
		</main>
	);
}
