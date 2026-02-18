import { createFileRoute } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { AttendanceConfirmationForm } from "@/components/equilibrio/AttendanceConfirmationForm";

const confirmSearchSchema = z.object({
	token: z.string().optional(),
});

export const Route = createFileRoute("/equilibrio/confirmar-asistencia")({
	validateSearch: confirmSearchSchema,
	component: RouteComponent,
});

function RouteComponent() {
	const { token } = Route.useSearch();

	return (
		<main className="bg-secondary w-full min-h-screen flex items-center justify-center px-4 background-texture">
			<Helmet>
				<title>Confirmar asistencia — El Sembrador</title>
			</Helmet>
			<AttendanceConfirmationForm token={token} />
		</main>
	);
}
