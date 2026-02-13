import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

export const Route = createFileRoute("/equilibrio/registro-exitoso")({
  component: RouteComponent,
});

function RouteComponent() {
  useEffect(() => {
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", "SubscribeSuccess");
    }
  }, []);

  return (
    <main className="bg-secondary w-full min-h-screen flex items-center justify-center px-4 background-texture">
      <Helmet>
        <title>Registro exitoso — El Sembrador</title>
      </Helmet>
      <div className="text-center max-w-md">
        <h1 className="font-grotesk-wide-medium text-3xl text-white mb-4">
          ¡Inscripción exitosa!
        </h1>
        <p className="text-white text-lg">Te esperamos en el evento.</p>
        <p className="text-white mb-8">
          Por ahora te invitamos a que te unas a nuestro canal en {""}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://whatsapp.com/channel/0029VbCPpodEwEjo8BINSi2P"
            className="text-primary underline hover:text-primary-dark font-grotesk-wide-medium"
          >
            WhatsApp
          </a>
        </p>
        <Link
          to="/equilibrio"
          className="inline-block font-grotesk-wide-medium text-lg px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
        >
          Volver
        </Link>
      </div>
    </main>
  );
}
