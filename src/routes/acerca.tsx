import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";
import { useSiteSettings } from "@/lib/hooks/useSiteSettings";

export const Route = createFileRoute("/acerca")({
	component: AcercaPage,
});

// ── Component ────────────────────────────────────────────────────────────────

function AcercaPage() {
	const { data: settings, isLoading, isError } = useSiteSettings();

	return (
		<main className="bg-white min-h-screen">
			<SeoHead
				title="Acerca"
				description="Conoce más sobre la iglesia El Sembrador Colombia — quiénes somos, dónde estamos y cuándo nos reunimos."
			/>

			{/* Header */}
			<div className="bg-secondary py-16 px-4">
				<div className="max-w-4xl mx-auto text-center">
					<h1 className="font-grotesk-compact-black text-4xl md:text-5xl text-white mb-4 uppercase">
						Acerca
					</h1>
					<p className="text-white/80 text-lg">
						{settings?.tagline ?? "Comunidad de fe en Colombia"}
					</p>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-3xl mx-auto px-4 py-16">
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

				{!isLoading && (
					<div className="space-y-12">
						{/* About description */}
						<section>
							<h2 className="font-grotesk-compact-black text-2xl text-gray-900 mb-4">
								Quiénes somos
							</h2>
							{settings?.aboutDescription ? (
								<p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
									{settings.aboutDescription}
								</p>
							) : (
								<p className="text-gray-500 italic">
									El Sembrador es una comunidad de fe comprometida con el
									evangelio de Jesucristo. Nos reunimos para adorar, crecer y
									servir juntos.
								</p>
							)}
						</section>

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
									Consulta nuestras redes sociales para los horarios
									actualizados.
								</p>
							)}
						</section>
					</div>
				)}
			</div>
		</main>
	);
}
