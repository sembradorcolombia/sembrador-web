import * as React from "react";
import { LogoEquilibrio } from "@/components/LogoEquilibrio";
import { Button } from "@/components/ui/button";
import type { EventWithDetails } from "@/lib/types/event";
import { EventBadge } from "./EventBadge";

interface EventShowcaseSectionProps {
  event: EventWithDetails;
  onReserve: () => void;
}

export const EventShowcaseSection = React.forwardRef<
  HTMLElement,
  EventShowcaseSectionProps
>(({ event, onReserve }, ref) => {
  const { name, maxCapacity, currentCount, details } = event;
  const slotsAvailable = maxCapacity - currentCount;
  const isFull = slotsAvailable <= 0;

  return (
    <section
      ref={ref}
      className="min-h-screen w-full flex items-center justify-center px-4 py-16"
    >
      <div className="max-w-7xl w-full">
        {/* Desktop: Grid layout | Mobile: Stacked layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Event Details - Left on Desktop, Bottom on Mobile */}
          <div className="flex flex-col space-y-8 order-2 lg:order-1">
            {/* Badges */}
            <div className="flex flex-wrap gap-4">
              <EventBadge variant="entrada-gratuita">
                Entrada Gratuita
              </EventBadge>
              <EventBadge variant="cupos-limitados">Cupos Limitados</EventBadge>
              <EventBadge variant="charlas-gratuitas">
                Charlas Gratuitas
              </EventBadge>
            </div>

            {/* Logo Equilibrio */}
            <div>
              <LogoEquilibrio
                decoratorColor={
                  details.color === "primary" ? "secondary" : "primary"
                }
                className="h-24 md:h-32"
              />
            </div>

            {/* Event Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase leading-tight">
              {name}
            </h1>

            {/* Speaker Info */}
            <div>
              <p className="text-sm md:text-base text-white/80 uppercase tracking-wider mb-2">
                Ponente
              </p>
              <p className="text-2xl md:text-3xl font-bold text-white uppercase">
                {details.speakerName}
              </p>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/70 mb-1">
                  Fecha
                </p>
                <p className="text-sm md:text-base font-semibold">
                  {details.date}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-white/70 mb-1">
                  Hora
                </p>
                <p className="text-sm md:text-base font-semibold">
                  {details.time}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-white/70 mb-1">
                  Lugar
                </p>
                <p className="text-sm md:text-base font-semibold">
                  {details.location}
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <Button
                size="lg"
                onClick={onReserve}
                disabled={isFull}
                className="bg-white text-primary hover:bg-white/90 font-black text-lg px-8 py-6 uppercase tracking-wider"
              >
                {isFull
                  ? "Evento Lleno"
                  : `Reserva tu cupo aquí (${slotsAvailable} disponibles)`}
              </Button>
            </div>
          </div>

          {/* Speaker Image - Right on Desktop, Top on Mobile */}
          <div className="flex items-center justify-center order-1 lg:order-2">
            <img
              src={details.speakerImage}
              alt={`${details.speakerName} - Ponente del evento ${name}`}
              className="w-full max-w-md lg:max-w-lg h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
});

EventShowcaseSection.displayName = "EventShowcaseSection";
