import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { ConsolidationSection } from "@/components/dashboard/ConsolidationSection";
import {
	type DashboardSection,
	DashboardTabs,
} from "@/components/dashboard/DashboardTabs";
import { EventsSection } from "@/components/dashboard/EventsSection";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
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
	const navigate = useNavigate();
	const [section, setSection] = useState<DashboardSection>("eventos");

	const handleLogout = async () => {
		await signOut();
		navigate({ to: "/login" });
	};

	return (
		<main className="min-h-screen bg-gray-50">
			<SeoHead title="Dashboard" />

			<header className="flex flex-col gap-3 bg-white px-4 py-4 shadow sm:flex-row sm:items-center sm:justify-between sm:px-6">
				<h1 className="text-lg font-bold sm:text-xl">
					El Sembrador — Dashboard
				</h1>
				<div className="flex items-center gap-3">
					<span className="truncate text-sm text-gray-600">
						{auth.user?.email}
					</span>
					<Button variant="outline" size="sm" onClick={handleLogout}>
						<LogOut className="mr-2 h-4 w-4" />
						Salir
					</Button>
				</div>
			</header>

			<div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
				<DashboardTabs active={section} onChange={setSection} />

				{/*
				 * Only the active section is rendered — not hidden with CSS — so the
				 * inactive section's query hook never mounts and its data is not
				 * fetched until the tab is first opened.
				 */}
				<div
					role="tabpanel"
					id={`panel-${section}`}
					aria-labelledby={`tab-${section}`}
				>
					{section === "eventos" ? <EventsSection /> : <ConsolidationSection />}
				</div>
			</div>
		</main>
	);
}
