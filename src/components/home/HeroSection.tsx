import type { LinkProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Clock, MapPin } from "lucide-react";
import { useSiteSettings } from "@/lib/hooks/useSiteSettings";
import { sanityImageUrl } from "@/lib/sanity";

const FALLBACK_CHURCH_NAME = "El Sembrador";
const FALLBACK_TAGLINE = "Bienvenidos a nuestra comunidad de fe en Medellín";

export function HeroSection() {
	const { data: settings, isLoading } = useSiteSettings();

	const churchName = settings?.churchName || FALLBACK_CHURCH_NAME;
	const tagline = settings?.tagline || FALLBACK_TAGLINE;
	const serviceTime = settings?.aboutServiceTimes || "Domingos 10:00 AM";
	const serviceLocation = settings?.address || "Medellín, Colombia";
	const mapsUrl =
		settings?.googleMapsUrl ||
		`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(serviceLocation)}`;

	const heroImageUrl = settings?.heroImage
		? sanityImageUrl(settings.heroImage.asset).width(1920).quality(80).url()
		: "/images/ciudad-del-rio-medellin.jpg";

	return (
		<section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
			{/* Background image */}
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{ backgroundImage: `url(${heroImageUrl})` }}
			/>

			{/* Dark overlay */}
			<div className="absolute inset-0 bg-black/60" />

			{/* Content */}
			<div className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center text-white sm:px-6 lg:px-8">
				{isLoading ? (
					<div className="animate-pulse space-y-4">
						<div className="mx-auto h-12 w-64 rounded bg-white/20" />
						<div className="mx-auto h-6 w-96 max-w-full rounded bg-white/15" />
						<div className="flex justify-center gap-4 pt-4">
							<div className="h-10 w-44 rounded-full bg-white/15" />
							<div className="h-10 w-44 rounded-full bg-white/15" />
						</div>
						<div className="mx-auto h-10 w-36 rounded-lg bg-white/10" />
					</div>
				) : (
					<>
						<h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
							{churchName}
						</h1>
						<p className="mt-4 text-lg text-white/90 sm:text-xl">{tagline}</p>

						{/* Service info pills */}
						<div className="mt-8 flex flex-wrap justify-center gap-3">
							<span className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
								<Clock size={16} className="shrink-0" />
								<span className="truncate">{serviceTime}</span>
							</span>
							<a
								href={mapsUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
							>
								<MapPin size={16} className="shrink-0" />
								<span className="truncate">{serviceLocation}</span>
							</a>
						</div>

						{/* Secondary CTA */}
						<Link
							to={"/acerca" as LinkProps["to"]}
							className="mt-6 inline-block rounded-lg border border-white/60 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
						>
							Conocer más
						</Link>
					</>
				)}
			</div>
		</section>
	);
}
