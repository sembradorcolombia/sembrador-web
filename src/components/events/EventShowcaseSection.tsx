import { Link } from "@tanstack/react-router";
import * as React from "react";
import type { MergedEvent } from "@/lib/hooks/useEventSeriesData";
import { sanityImageUrl } from "@/lib/sanity";
import type { CmsEventSeries } from "@/lib/types/cms";

interface EventShowcaseSectionProps {
	event: MergedEvent;
	series: CmsEventSeries;
	seriesSlug: string;
	themeColor: "primary" | "secondary";
	onReserve: () => void;
}

const MAX_TILT_DEG = 12;

export const EventShowcaseSection = React.forwardRef<
	HTMLElement,
	EventShowcaseSectionProps
>(({ event, series, seriesSlug, themeColor, onReserve: _onReserve }, ref) => {
	const { cms } = event;
	const imageWrapperRef = React.useRef<HTMLDivElement>(null);

	const handlePointerMove = React.useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			const el = imageWrapperRef.current;
			if (!el) return;
			const rect = el.getBoundingClientRect();
			const offsetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
			const offsetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
			el.style.transition = "transform 0.15s ease-out";
			el.style.transform = `perspective(800px) rotateY(${offsetX * -MAX_TILT_DEG}deg) rotateX(${offsetY * MAX_TILT_DEG}deg)`;
		},
		[],
	);

	const handlePointerLeave = React.useCallback(() => {
		const el = imageWrapperRef.current;
		if (!el) return;
		el.style.transition = "transform 0.5s ease-out";
		el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
	}, []);

	const decoratorColor = themeColor === "primary" ? "secondary" : "primary";
	const borderColor =
		decoratorColor === "primary" ? "border-primary" : "border-secondary";

	const speakerName = cms.speaker?.name ?? "Ponente por confirmar";
	const speakerImageUrl = cms.speakerImage
		? sanityImageUrl(cms.speakerImage).width(600).url()
		: cms.speaker?.image
			? sanityImageUrl(cms.speaker.image).width(600).url()
			: null;

	const seriesLogoUrl = series.logo
		? sanityImageUrl(series.logo).width(800).url()
		: null;

	const formattedDate = cms.date
		? new Date(cms.date).toLocaleDateString("es-CO", {
				weekday: "long",
				day: "numeric",
				month: "long",
			})
		: "Por confirmar";

	return (
		<section
			ref={ref}
			className="event_container min-h-screen w-full grid grid-rows-[auto, 1fr] items-start justify-center max-w-7xl mx-auto px-4 sm:px-6 pb-16 snap-start snap-always"
		>
			<div className="event_logo px-4 sm:px-0 w-full mx-auto">
				{seriesLogoUrl ? (
					<img
						src={seriesLogoUrl}
						alt={series.name}
						className="w-full max-w-3xl mx-auto h-auto"
					/>
				) : (
					<h2 className="text-4xl md:text-5xl font-grotesk-compact-black text-white uppercase text-center py-8">
						{series.name}
					</h2>
				)}
			</div>
			<div className="event_data grid sm:grid-cols-2">
				<div className="flex flex-col space-y-8 order-2 lg:order-1">
					<h1 className="text-5xl md:text-6xl lg:text-7xl m-0 font-grotesk-compact-black text-white uppercase leading-tight">
						{cms.name}
					</h1>
					<div>
						<p
							className={`${decoratorColor === "primary" ? "text-primary" : "text-secondary"} font-grotesk-spatial-black text-3xl uppercase tracking-wider mb-2`}
						>
							Ponente
						</p>
						<p className="font-grotesk-tight-medium text-3xl text-white uppercase">
							{speakerName}
						</p>
					</div>
					<div>
						<p
							className={`${decoratorColor === "primary" ? "text-primary" : "text-secondary"} font-grotesk-compact-black text-3xl uppercase`}
						>
							¡Gracias por asistir!
						</p>
						<p className="font-grotesk-tight-medium text-lg text-white/70 uppercase mb-4">
							Este evento ya finalizó
						</p>
						<Link
							to="/eventos/$seriesSlug/feedback"
							params={{ seriesSlug }}
							className={`inline-block font-grotesk-compact-black text-xl px-6 py-3 uppercase rounded-md transition-colors duration-700 ${
								decoratorColor === "primary"
									? "bg-primary hover:bg-primary-dark"
									: "bg-secondary hover:bg-secondary-dark"
							} text-white`}
						>
							Déjanos tu opinión
						</Link>
					</div>
					<div
						className={`grid grid-cols-3 md:grid-cols-3 gap-6 text-white border-t-2 ${borderColor}`}
					>
						<div className="p-2">
							<p
								className={`${decoratorColor === "primary" ? "text-primary" : "text-secondary"} font-grotesk-compact-black text-md uppercase tracking-wider mb-1`}
							>
								Fecha
							</p>
							<p className="text-sm md:text-base font-semibold capitalize">
								{formattedDate}
							</p>
						</div>
						<div className={`border-l-2 p-2 ${borderColor}`}>
							<p
								className={`${decoratorColor === "primary" ? "text-primary" : "text-secondary"} font-grotesk-compact-black text-md uppercase tracking-wider mb-1`}
							>
								Hora
							</p>
							<p className="text-sm md:text-base font-semibold">
								{cms.time ?? "Por confirmar"}
							</p>
						</div>
						<div className={`border-l-2 p-2 ${borderColor}`}>
							<p
								className={`${decoratorColor === "primary" ? "text-primary" : "text-secondary"} font-grotesk-compact-black text-md uppercase tracking-wider mb-1`}
							>
								Lugar
							</p>
							<p className="text-sm md:text-base font-semibold">
								{cms.location ?? "Por confirmar"}
							</p>
						</div>
					</div>
				</div>
				{speakerImageUrl && (
					<div
						ref={imageWrapperRef}
						onPointerMove={handlePointerMove}
						onPointerLeave={handlePointerLeave}
						className="flex items-center justify-center order-1 lg:order-2 will-change-transform"
					>
						<img
							src={speakerImageUrl}
							alt={`${speakerName} - Ponente del evento ${cms.name}`}
							className="w-full max-w-md lg:max-w-lg h-auto object-contain transform-none"
						/>
					</div>
				)}
			</div>
		</section>
	);
});

EventShowcaseSection.displayName = "EventShowcaseSection";
