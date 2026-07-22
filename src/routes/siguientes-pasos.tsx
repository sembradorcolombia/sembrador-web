import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/siguientes-pasos")({
	beforeLoad: () => {
		throw redirect({ to: "/conectar" });
	},
	component: () => null,
});
