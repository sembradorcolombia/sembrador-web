import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { EventShowcaseSection } from "@/components/events/EventShowcaseSection";
import { SubscriptionModal } from "@/components/events/SubscriptionModal";
import { SeoHead } from "@/components/SeoHead";
import {
	findMergedEventBySlug,
	useEventSeriesData,
} from "@/lib/hooks/useEventSeriesData";
import { useScrollSpy } from "@/lib/hooks/useScrollSpy";

const eventSearchSchema = z.object({
	evento: z.string().optional(),
});

export const Route = createFileRoute("/eventos/$seriesSlug/")({
	validateSearch: eventSearchSchema,
	component: RouteComponent,
});

function RouteComponent() {
	const { seriesSlug } = Route.useParams();
	const navigate = useNavigate({ from: "/eventos/$seriesSlug/" });
	const { evento } = Route.useSearch();
	const {
		data: seriesData,
		isLoading,
		isError,
	} = useEventSeriesData(seriesSlug);

	// Collect supabase events for the subscription modal
	const supabaseEvents = useMemo(
		() =>
			seriesData?.events
				.filter(
					(e): e is typeof e & { supabase: NonNullable<typeof e.supabase> } =>
						e.supabase !== null,
				)
				.map((e) => e.supabase) ?? [],
		[seriesData],
	);

	// Resolve slug to event UUID for the modal
	const selectedEvent =
		seriesData && evento
			? findMergedEventBySlug(seriesData.events, evento)
			: undefined;
	const selectedEventId = selectedEvent?.supabase?.id;

	// Create refs for each event section dynamically
	const sectionRefsRef = useRef<React.RefObject<HTMLElement | null>[]>([]);
	const eventCount = seriesData?.events.length ?? 0;

	// Ensure we have the right number of refs
	if (sectionRefsRef.current.length !== eventCount) {
		sectionRefsRef.current = Array.from({ length: eventCount }, () => ({
			current: null,
		}));
	}

	const headerRef = useRef<HTMLElement>(null);

	// Track active section for background color
	const scrollSpyActiveIndex = useScrollSpy(sectionRefsRef.current);

	// Store the active index when modal opens to prevent color changes
	const [frozenActiveIndex, setFrozenActiveIndex] = useState<number | null>(
		null,
	);
	const scrollPositionRef = useRef<number>(0);

	// Use frozen index when modal is open, otherwise use scroll spy
	const activeIndex = frozenActiveIndex ?? scrollSpyActiveIndex;

	// Background colors cycling between secondary and primary
	const getBackgroundColor = useCallback(
		(index: number) => (index % 2 === 0 ? "bg-secondary" : "bg-primary"),
		[],
	);
	const getThemeColor = useCallback(
		(index: number): "primary" | "secondary" =>
			index % 2 === 0 ? "secondary" : "primary",
		[],
	);

	const activeBackgroundColor = getBackgroundColor(activeIndex);

	// Header colors (opposite of section colors)
	const getHeaderBackgroundColor = useCallback(
		(index: number) => (index % 2 === 0 ? "bg-primary" : "bg-secondary"),
		[],
	);
	const activeHeaderBackgroundColor = getHeaderBackgroundColor(activeIndex);
	const fontColor =
		activeBackgroundColor === "bg-primary" ? "text-primary" : "text-secondary";

	// Enable scroll snapping scoped to this page
	useEffect(() => {
		const html = document.documentElement;
		const header = headerRef.current;

		if (evento) {
			html.style.scrollSnapType = "none";
		} else if (header) {
			html.style.scrollPaddingTop = `${header.offsetHeight}px`;
			html.style.scrollSnapType = "y mandatory";
		}

		return () => {
			html.style.scrollSnapType = "";
			html.style.scrollPaddingTop = "";
		};
	}, [evento]);

	// Handle modal opening/closing - freeze scroll and active section
	useEffect(() => {
		if (evento) {
			scrollPositionRef.current = window.scrollY;
			setFrozenActiveIndex(scrollSpyActiveIndex);

			requestAnimationFrame(() => {
				window.scrollTo(0, scrollPositionRef.current);
			});
		} else if (frozenActiveIndex !== null) {
			const savedScroll = scrollPositionRef.current;
			requestAnimationFrame(() => {
				window.scrollTo(0, savedScroll);
				setTimeout(() => {
					setFrozenActiveIndex(null);
				}, 100);
			});
		}
	}, [evento, scrollSpyActiveIndex, frozenActiveIndex]);

	const handleOpenModal = (eventSlug: string) => {
		if (typeof window.fbq === "function") {
			window.fbq("trackCustom", "SubscribeButtonClick");
		}
		navigate({
			search: { evento: eventSlug },
		});
	};

	const handleCloseModal = () => {
		navigate({
			search: {},
		});
	};

	if (isLoading) {
		return (
			<main className="bg-secondary w-full min-h-screen flex items-center justify-center">
				<p className="text-white text-xl">Cargando eventos...</p>
			</main>
		);
	}

	if (isError || !seriesData) {
		return (
			<main className="bg-secondary w-full min-h-screen flex items-center justify-center">
				<p className="text-white text-xl">Serie de eventos no encontrada</p>
			</main>
		);
	}

	return (
		<main
			className={`${activeBackgroundColor} transition-colors duration-700 ease-in-out w-full${seriesSlug === "equilibrio" ? " background-texture" : ""}`}
		>
			<SeoHead title={seriesData.series.name} />
			{/* Fixed Header Bar with Opposite Color */}
			<header
				ref={headerRef}
				className={`${activeHeaderBackgroundColor} transition-colors duration-700 sticky top-0 left-0 right-0 z-50 w-full`}
			>
				<div
					className={`header_container ${fontColor} transition-colors duration-700 ease-in-out flex flex-row justify-between items-center gap-2 sm:gap-4 px-4 sm:px-6 py-1 sm:py-2 max-w-7xl mx-auto text-xs sm:text-sm`}
				>
					<span className="font-grotesk-compact-black uppercase">
						Entrada Gratuita
					</span>
					<span className="font-grotesk-spatial-black uppercase">
						Cupos Limitados
					</span>
					<span className="font-grotesk-compact-black uppercase">
						Refrigerio Incluido
					</span>
				</div>
			</header>

			{/* Event Sections */}
			{seriesData.events.map((event, index) => (
				<EventShowcaseSection
					key={event.cms._id}
					ref={sectionRefsRef.current[index]}
					event={event}
					series={seriesData.series}
					seriesSlug={seriesSlug}
					themeColor={getThemeColor(index)}
					onReserve={() => handleOpenModal(event.cms.slug.current)}
				/>
			))}

			{/* Subscription Modal */}
			<SubscriptionModal
				events={supabaseEvents}
				selectedEventId={selectedEventId}
				seriesSlug={seriesSlug}
				open={!!evento}
				onOpenChange={(open) => {
					if (!open) {
						handleCloseModal();
					}
				}}
			/>
		</main>
	);
}
