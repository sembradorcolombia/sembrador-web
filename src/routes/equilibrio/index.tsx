import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { EventShowcaseSection } from "@/components/equilibrio/EventShowcaseSection";
import { SubscriptionModal } from "@/components/equilibrio/SubscriptionModal";
import { useEvents } from "@/lib/hooks/useEvents";
import {
  findEventBySlug,
  useEventsWithDetails,
} from "@/lib/hooks/useEventsWithDetails";
import { useScrollSpy } from "@/lib/hooks/useScrollSpy";

const equilibrioSearchSchema = z.object({
  evento: z.string().optional(),
});

export const Route = createFileRoute("/equilibrio/")({
  validateSearch: equilibrioSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: "/equilibrio/" });
  const { evento } = Route.useSearch();
  const { data: events } = useEvents();
  const {
    data: eventsWithDetails,
    isLoading,
    isError,
  } = useEventsWithDetails();

  // Resolve slug to event UUID for the modal
  const selectedEvent =
    eventsWithDetails && evento
      ? findEventBySlug(eventsWithDetails, evento)
      : undefined;
  const selectedEventId = selectedEvent?.id;

  // Create refs for each event section
  const sectionRefs = [useRef<HTMLElement>(null), useRef<HTMLElement>(null)];
  const headerRef = useRef<HTMLElement>(null);

  // Track active section for background color
  const scrollSpyActiveIndex = useScrollSpy(sectionRefs);

  // Store the active index when modal opens to prevent color changes
  const [frozenActiveIndex, setFrozenActiveIndex] = useState<number | null>(
    null,
  );
  const scrollPositionRef = useRef<number>(0);

  // Use frozen index when modal is open, otherwise use scroll spy
  const activeIndex = frozenActiveIndex ?? scrollSpyActiveIndex;

  // Background colors for each event
  const backgroundColors = ["bg-secondary", "bg-primary"];
  const activeBackgroundColor = backgroundColors[activeIndex] || "bg-secondary";

  // Header colors (opposite of section colors)
  const headerBackgroundColors = ["bg-primary", "bg-secondary"];
  const activeHeaderBackgroudColor =
    headerBackgroundColors[activeIndex] || "bg-primary";
  const fontColor =
    activeBackgroundColor === "bg-primary" ? "text-primary" : "text-secondary";

  // Enable scroll snapping scoped to this page, only after the header has
  // rendered so scroll-padding-top is always set before snap activates
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
      // Modal is opening - store current scroll position and active section
      scrollPositionRef.current = window.scrollY;
      setFrozenActiveIndex(scrollSpyActiveIndex);

      // Prevent scroll restoration on next tick
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollPositionRef.current);
      });
    } else if (frozenActiveIndex !== null) {
      // Modal is closing - restore scroll position before unfreezing
      const savedScroll = scrollPositionRef.current;
      requestAnimationFrame(() => {
        window.scrollTo(0, savedScroll);
        // Unfreeze after scroll is restored
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

  if (isError || !eventsWithDetails) {
    return (
      <main className="bg-secondary w-full min-h-screen flex items-center justify-center">
        <p className="text-red-400 text-xl">Error al cargar eventos</p>
      </main>
    );
  }

  return (
    <main
      className={`${activeBackgroundColor} transition-colors duration-700 ease-in-out w-full background-texture`}
    >
      <Helmet>
        <title>Equilibrio — El Sembrador</title>
      </Helmet>
      {/* Fixed Header Bar with Opposite Color */}
      <header
        ref={headerRef}
        className={`${activeHeaderBackgroudColor} transition-colors duration-700 sticky top-0 left-0 right-0 z-50 w-full`}
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
      {eventsWithDetails.map((event, index) => (
        <EventShowcaseSection
          key={event.id}
          ref={sectionRefs[index]}
          event={event}
          onReserve={() => handleOpenModal(event.details.slug)}
        />
      ))}

      {/* Subscription Modal */}
      <SubscriptionModal
        events={events ?? []}
        selectedEventId={selectedEventId}
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
