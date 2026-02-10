import { createFileRoute } from "@tanstack/react-router";
import { SubscriptionForm } from "@/components/forms/SubscriptionForm";
import { LogoEquilibrio } from "@/components/LogoEquilibrio";
import { useEvents } from "@/lib/hooks/useEvents";

export const Route = createFileRoute("/equilibrio")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: events, isLoading, isError } = useEvents();

  return (
    <main className="bg-secondary w-full min-h-screen">
      <section className="wrapper max-w-300 m-auto py-8">
        <article>
          <header className="text-center mb-8">
            <img
              src="/logo-hw.svg"
              alt="logo el sembrador"
              className="h-20 mx-auto mb-4"
            />
            <LogoEquilibrio decoratorColor="primary" className="h-24 mx-auto" />
          </header>

          <section className="mb-8">
            {isLoading ? (
              <p className="text-center text-white">Cargando eventos...</p>
            ) : isError ? (
              <p className="text-center text-red-400">
                Error al cargar eventos
              </p>
            ) : (
              <SubscriptionForm events={events ?? []} />
            )}
          </section>

          <footer className="text-center text-white text-sm">
            <p>© 2026 El Sembrador Colombia</p>
          </footer>
        </article>
      </section>
    </main>
  );
}
