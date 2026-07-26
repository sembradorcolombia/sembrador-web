import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin } from "lucide-react";
import { AboutDescription } from "@/components/about/AboutDescription";
import { CoreItemsSection } from "@/components/about/CoreItemsSection";
import { DocumentsSection } from "@/components/about/DocumentsSection";
import { LeadershipSection } from "@/components/about/LeadershipSection";
import { VisionMission } from "@/components/about/VisionMission";
import { SeoHead } from "@/components/SeoHead";
import { Hero } from "@/components/ui/Hero";
import { useAboutPage } from "@/lib/hooks/useAboutPage";
import { useSiteSettings } from "@/lib/hooks/useSiteSettings";

export const Route = createFileRoute("/acerca")({
	component: AcercaPage,
});

// ── Component ────────────────────────────────────────────────────────────────

function AcercaPage() {
	const { data: about, isLoading, isError } = useAboutPage();
	const { data: settings } = useSiteSettings();

	return (
		<main className="bg-white min-h-screen">
			<SeoHead
				title="Acerca"
				description="Conoce más sobre la iglesia El Sembrador Colombia — quiénes somos, dónde estamos y cuándo nos reunimos."
			/>

			<Hero
				heroKey="acerca"
				fallbackHeading="Acerca"
				fallbackLeadText={settings?.tagline ?? "Comunidad de fe en Colombia"}
			/>

			{/* Content */}
			<div className="max-w-3xl mx-auto px-4 py-16">
				<div className="space-y-12">
					{/* aboutPage content — only this block depends on that query */}
					{isLoading && (
						<div className="flex items-center justify-center py-24">
							<p className="text-gray-500">Cargando información...</p>
						</div>
					)}

					{isError && (
						<div className="flex items-center justify-center py-24">
							<p className="text-red-500">
								No pudimos cargar la información en este momento.
							</p>
						</div>
					)}

					{!isLoading && !isError && (
						<>
							<AboutDescription description={about?.description} />

							<VisionMission vision={about?.vision} mission={about?.mission} />

							<CoreItemsSection
								title="Nuestros valores"
								items={about?.coreValues}
							/>

							<CoreItemsSection
								title="En qué creemos"
								items={about?.coreBeliefs}
							/>

							<DocumentsSection documents={about?.documents} />
						</>
					)}

					{/* Sourced independently — an aboutPage failure must not hide these */}
					<LeadershipSection />

					{/* Location */}
					<section className="border-t border-gray-100 pt-12">
						<div className="flex items-center gap-3 mb-4">
							<div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700">
								<MapPin size={20} />
							</div>
							<h2 className="font-grotesk-compact-black text-2xl text-gray-900">
								Dónde estamos
							</h2>
						</div>
						{settings?.aboutLocation ? (
							<p className="text-gray-700 text-lg whitespace-pre-line pl-[52px]">
								{settings.aboutLocation}
							</p>
						) : (
							<p className="text-gray-500 italic pl-[52px]">
								Ubicación disponible próximamente.
							</p>
						)}
					</section>

					{/* Service times */}
					<section className="border-t border-gray-100 pt-12">
						<div className="flex items-center gap-3 mb-4">
							<div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700">
								<Clock size={20} />
							</div>
							<h2 className="font-grotesk-compact-black text-2xl text-gray-900">
								Horarios
							</h2>
						</div>
						{settings?.aboutServiceTimes ? (
							<p className="text-gray-700 text-lg whitespace-pre-line pl-[52px]">
								{settings.aboutServiceTimes}
							</p>
						) : (
							<p className="text-gray-500 italic pl-[52px]">
								Consulta nuestras redes sociales para los horarios actualizados.
							</p>
						)}
					</section>
				</div>
			</div>
		</main>
	);
}
