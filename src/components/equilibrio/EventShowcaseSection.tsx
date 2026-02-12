import * as React from "react";
import { Button } from "@/components/ui/button";
import type { EventWithDetails } from "@/lib/types/event";
import { LogoEquilibrio } from "../LogoEquilibrio";

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
  const decoratorColor = details?.color === "primary" ? "secondary" : "primary";
  const buttonBackgroundColor =
    decoratorColor === "primary" ? "bg-primary" : "bg-secondary";
  const borderColor =
    decoratorColor === "primary" ? "border-primary" : "border-secondary";
  const hoverBackgroundColor =
    decoratorColor === "primary"
      ? "hover:bg-primary-dark duration-700"
      : "hover:bg-secondary-dark duration-700";

  return (
    <section
      ref={ref}
      className="event_container min-h-screen w-full grid grid-rows-[auto, 1fr] items-start justify-center max-w-7xl mx-auto px-4 sm:px-6 pb-16 snap-start snap-always"
    >
      <div className="event_logo px-4 sm:px-0 w-full mx-auto">
        <LogoEquilibrio decoratorColor={decoratorColor} />
      </div>
      <div className="event_data grid sm:grid-cols-2">
        <div className="flex flex-col space-y-8 order-2 lg:order-1">
          <h1 className="text-5xl md:text-6xl lg:text-7xl m-0 font-grotesk-compact-black text-white uppercase leading-tight">
            {name}
          </h1>
          <div>
            <p
              className={`${decoratorColor === "primary" ? "text-primary" : "text-secondary"} font-grotesk-spatial-black text-3xl uppercase tracking-wider mb-2`}
            >
              Ponente
            </p>
            <p className="font-grotesk-tight-medium text-3xl text-white uppercase">
              {details.speakerName}
            </p>
          </div>
          <div>
            <Button
              size="lg"
              onClick={onReserve}
              disabled={isFull}
              className={`${buttonBackgroundColor} ${hoverBackgroundColor} w-full sm:w-auto font-grotesk-compact-black text-3xl px-8 py-9 uppercase cursor-pointer`}
            >
              {isFull ? (
                "Evento Lleno"
              ) : (
                <p className="font-grotesk-compact-black">
                  Reserva tu cupo aquí{" "}
                  <span className="block text-sm font-grotesk-wide-medium">
                    ({slotsAvailable} disponibles)
                  </span>
                </p>
              )}
            </Button>
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
              <p className="text-sm md:text-base font-semibold">
                {details.date}
              </p>
            </div>
            <div className={`border-l-2 p-2 ${borderColor}`}>
              <p
                className={`${decoratorColor === "primary" ? "text-primary" : "text-secondary"} font-grotesk-compact-black text-md uppercase tracking-wider mb-1`}
              >
                Hora
              </p>
              <p className="text-sm md:text-base font-semibold">
                {details.time}
              </p>
            </div>
            <div className={`border-l-2 p-2 ${borderColor}`}>
              <p
                className={`${decoratorColor === "primary" ? "text-primary" : "text-secondary"} font-grotesk-compact-black text-md uppercase tracking-wider mb-1`}
              >
                Lugar
              </p>
              <p className="text-sm md:text-base font-semibold">
                {details.location}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center order-1 lg:order-2">
          <img
            src={details.speakerImage}
            alt={`${details.speakerName} - Ponente del evento ${name}`}
            className="w-full max-w-md lg:max-w-lg h-auto object-contain transform-none"
          />
        </div>
      </div>
    </section>
  );
});

EventShowcaseSection.displayName = "EventShowcaseSection";
