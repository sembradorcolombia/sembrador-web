import { Clock, MapPin } from "lucide-react";
import { Hero } from "@/components/ui/Hero";
import { useSiteSettings } from "@/lib/hooks/useSiteSettings";

const FALLBACK_HEADING = "El Sembrador";
const FALLBACK_LEAD_TEXT = "Bienvenidos a nuestra comunidad de fe en Medellín";
const FALLBACK_CTA = { text: "Conocer más", link: "/acerca" };

export function HeroSection() {
	const { data: settings } = useSiteSettings();

	const serviceTime = settings?.aboutServiceTimes || "Domingos 10:00 AM";
	const serviceLocation = settings?.address || "Medellín, Colombia";
	const mapsUrl =
		settings?.googleMapsUrl ||
		`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(serviceLocation)}`;

	return (
		<Hero
			heroKey="home"
			variant="full"
			fallbackHeading={FALLBACK_HEADING}
			fallbackLeadText={FALLBACK_LEAD_TEXT}
			fallbackCta={FALLBACK_CTA}
		>
			{/* Service info pills — homepage chrome, sourced from site settings */}
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
		</Hero>
	);
}
