import type { LinkProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Clock, MapPin } from "lucide-react";
import { useSiteSettings } from "@/lib/hooks/useSiteSettings";

const FALLBACK_DESCRIPTION =
	"Somos una iglesia en Medellín comprometida con compartir el amor de Dios y construir una comunidad donde cada persona pueda crecer en su fe.";

export function AboutPreview() {
	const { data: settings, isLoading } = useSiteSettings();

	// Hide if no about description and no fallback is useful
	if (!isLoading && !settings?.aboutDescription && !settings?.aboutLocation) {
		return null;
	}

	const description = settings?.aboutDescription || FALLBACK_DESCRIPTION;

	return (
		<section className="py-16 sm:py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid items-center gap-12 lg:grid-cols-2">
					<div>
						<h2 className="text-3xl font-bold tracking-tight text-gray-900">
							Acerca de nosotros
						</h2>
						{isLoading ? (
							<div className="mt-4 animate-pulse space-y-3">
								<div className="h-4 rounded bg-gray-200" />
								<div className="h-4 w-5/6 rounded bg-gray-200" />
								<div className="h-4 w-4/6 rounded bg-gray-200" />
							</div>
						) : (
							<>
								<p className="mt-4 text-lg leading-relaxed text-gray-600">
									{description}
								</p>

								{/* Location and service times */}
								<div className="mt-6 space-y-3">
									{settings?.aboutLocation && (
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<MapPin size={16} className="shrink-0 text-primary" />
											<span>{settings.aboutLocation}</span>
										</div>
									)}
									{settings?.aboutServiceTimes && (
										<div className="flex items-center gap-2 text-sm text-gray-600">
											<Clock size={16} className="shrink-0 text-primary" />
											<span>{settings.aboutServiceTimes}</span>
										</div>
									)}
								</div>

								<Link
									to={"/acerca" as LinkProps["to"]}
									className="mt-6 inline-block text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
								>
									Conocer más &rarr;
								</Link>
							</>
						)}
					</div>

					{/* Decorative image or placeholder */}
					<div className="hidden lg:block">
						<div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
							<img
								src="/images/ciudad-del-rio-medellin.jpg"
								alt="El Sembrador - Medellín"
								className="h-full w-full object-cover"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
