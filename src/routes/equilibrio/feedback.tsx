import { createFileRoute } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import { FeedbackForm } from "@/components/equilibrio/FeedbackForm";

export const Route = createFileRoute("/equilibrio/feedback")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="bg-secondary w-full min-h-screen flex items-center justify-center px-4 background-texture">
			<Helmet>
				<title>Tu opinión — El Sembrador</title>
			</Helmet>
			<FeedbackForm />
		</main>
	);
}
