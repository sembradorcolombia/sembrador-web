import { createFileRoute } from "@tanstack/react-router";
import { FeedbackForm } from "@/components/events/FeedbackForm";
import { SeoHead } from "@/components/SeoHead";

export const Route = createFileRoute("/eventos/$seriesSlug/feedback")({
	component: RouteComponent,
});

function RouteComponent() {
	const { seriesSlug } = Route.useParams();

	return (
		<main
			className={`bg-secondary w-full min-h-screen flex items-center justify-center px-4${seriesSlug === "equilibrio" ? " background-texture" : ""}`}
		>
			<SeoHead title="Tu opinión" />
			<FeedbackForm seriesSlug={seriesSlug} />
		</main>
	);
}
