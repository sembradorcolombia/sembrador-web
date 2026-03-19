import type { LinkProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useSiteSettings } from "@/lib/hooks/useSiteSettings";
import { sanityImageUrl } from "@/lib/sanity";

const FALLBACK_CHURCH_NAME = "El Sembrador";
const FALLBACK_TAGLINE = "Bienvenidos a nuestra comunidad de fe en Medellín";

export function HeroSection() {
	const { data: settings, isLoading } = useSiteSettings();

	const churchName = settings?.churchName || FALLBACK_CHURCH_NAME;
	const tagline = settings?.tagline || FALLBACK_TAGLINE;

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
					</div>
				) : (
					<>
						<h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
							{churchName}
						</h1>
						<p className="mt-4 text-lg text-white/90 sm:text-xl">{tagline}</p>
						<Link
							to={"/eventos" as LinkProps["to"]}
							className="mt-8 inline-block rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-primary-dark"
						>
							Nuestros eventos
						</Link>
					</>
				)}
			</div>
		</section>
	);
}
