import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AttendanceConfirmationForm } from "@/components/events/AttendanceConfirmationForm";
import { SeoHead } from "@/components/SeoHead";

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
			<SeoHead title="Confirmar asistencia" />
			<AttendanceConfirmationForm token={token} seriesSlug={seriesSlug} />
		</main>
	);
}
