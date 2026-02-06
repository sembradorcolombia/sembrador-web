import { createFileRoute } from "@tanstack/react-router";
import { LogoEquilibrio } from "@/components/LogoEquilibrio";

export const Route = createFileRoute("/equilibrio")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="bg-secondary w-full h-screen">
      <section className="wrapper max-w-300 m-auto">
        <article>
          <header>
            <img src="/logo-hw.svg" alt="logo el sembrador" className="h-20" />
            <LogoEquilibrio decoratorColor="primary" />
          </header>
          <section>Content</section>
          <footer>Footer</footer>
        </article>
      </section>
    </main>
  );
}
