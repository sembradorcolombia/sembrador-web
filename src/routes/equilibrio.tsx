import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { EventShowcaseSection } from "@/components/equilibrio/EventShowcaseSection";
import { SubscriptionModal } from "@/components/equilibrio/SubscriptionModal";
import { useEvents } from "@/lib/hooks/useEvents";
import { useEventsWithDetails } from "@/lib/hooks/useEventsWithDetails";
import { useScrollSpy } from "@/lib/hooks/useScrollSpy";

const equilibrioSearchSchema = z.object({
  eventId: z.string().optional(),
});

export const Route = createFileRoute("/equilibrio")({
  validateSearch: equilibrioSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate({ from: "/equilibrio" });
  const { eventId } = Route.useSearch();
  const { data: events } = useEvents();
  const {
    data: eventsWithDetails,
    isLoading,
    isError,
  } = useEventsWithDetails();

  // Create refs for each event section
  const sectionRefs = [useRef<HTMLElement>(null), useRef<HTMLElement>(null)];

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

  // Handle modal opening/closing - freeze scroll and active section
  useEffect(() => {
    if (eventId) {
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
  }, [eventId, scrollSpyActiveIndex, frozenActiveIndex]);

  const handleOpenModal = (selectedEventId: string) => {
    navigate({
      search: { eventId: selectedEventId },
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
      className={`${activeBackgroundColor} transition-colors duration-700 ease-in-out w-full`}
    >
      {/* Fixed Header Bar with Opposite Color */}
      <header
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
          onReserve={() => handleOpenModal(event.id)}
        />
      ))}

      {/* Subscription Modal */}
      <SubscriptionModal
        events={events ?? []}
        selectedEventId={eventId}
        open={!!eventId}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseModal();
          }
        }}
      />
    </main>
  );
}
