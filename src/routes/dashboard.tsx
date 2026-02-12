import {
	createFileRoute,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { EventCard } from "@/components/dashboard/EventCard";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/lib/hooks/useDashboardData";
import { signOut } from "@/lib/services/auth";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/dashboard")({
	beforeLoad: async () => {
		const {
			data: { session },
		} = await supabase.auth.getSession();
		if (!session?.user?.app_metadata?.is_admin) {
			throw redirect({ to: "/login" });
		}
	},
	component: DashboardPage,
});

function DashboardPage() {
	const { auth } = Route.useRouteContext();
	const { data, isLoading, isError } = useDashboardData();
	const navigate = useNavigate();

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<p className="text-gray-500">Cargando...</p>
			</div>
		);
	}

	const handleLogout = async () => {
		await signOut();
		navigate({ to: "/login" });
	};

	if (isError || !data) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<p className="text-red-600">Error al cargar los datos.</p>
			</div>
		);
	}

	return (
		<main className="min-h-screen bg-gray-50">
			<Helmet>
				<title>Dashboard — El Sembrador</title>
			</Helmet>

			<header className="flex items-center justify-between bg-white px-6 py-4 shadow">
				<h1 className="text-xl font-bold">El Sembrador — Dashboard</h1>
				<div className="flex items-center gap-4">
					<span className="text-sm text-gray-600">{auth.user?.email}</span>
					<Button variant="outline" size="sm" onClick={handleLogout}>
						<LogOut className="mr-2 h-4 w-4" />
						Salir
					</Button>
				</div>
			</header>

			<div className="mx-auto max-w-6xl space-y-8 p-6">
				{data.map((event) => (
					<EventCard key={event.id} event={event} />
				))}
			</div>
		</main>
	);
}
