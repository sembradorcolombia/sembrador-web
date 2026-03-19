import { createFileRoute } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import { FeedbackForm } from "@/components/events/FeedbackForm";

export const Route = createFileRoute("/eventos/$seriesSlug/feedback")({
	component: RouteComponent,
});

function RouteComponent() {
	const { seriesSlug } = Route.useParams();

	return (
		<main className="bg-secondary w-full min-h-screen flex items-center justify-center px-4 background-texture">
			<Helmet>
				<title>Tu opinión — El Sembrador</title>
			</Helmet>
			<FeedbackForm seriesSlug={seriesSlug} />
		</main>
	);
}
