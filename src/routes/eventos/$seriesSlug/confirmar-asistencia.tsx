import { createFileRoute } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { AttendanceConfirmationForm } from "@/components/events/AttendanceConfirmationForm";

const confirmSearchSchema = z.object({
	token: z.string().uuid().optional(),
});

export const Route = createFileRoute(
	"/eventos/$seriesSlug/confirmar-asistencia",
)({
	validateSearch: confirmSearchSchema,
	component: RouteComponent,
});

function RouteComponent() {
	const { seriesSlug } = Route.useParams();
	const { token } = Route.useSearch();

	return (
		<main
			className={`bg-secondary w-full min-h-screen flex items-center justify-center px-4${seriesSlug === "equilibrio" ? " background-texture" : ""}`}
		>
			<Helmet>
				<title>Confirmar asistencia — El Sembrador</title>
			</Helmet>
			<AttendanceConfirmationForm token={token} seriesSlug={seriesSlug} />
		</main>
	);
}
