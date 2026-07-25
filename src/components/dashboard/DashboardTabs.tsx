import { cn } from "@/lib/utils";

export type DashboardSection = "eventos" | "consolidacion";

const TABS: { id: DashboardSection; label: string }[] = [
	{ id: "eventos", label: "Eventos" },
	{ id: "consolidacion", label: "Consolidación" },
];

interface DashboardTabsProps {
	active: DashboardSection;
	onChange: (section: DashboardSection) => void;
}

export function DashboardTabs({ active, onChange }: DashboardTabsProps) {
	return (
		<div
			role="tablist"
			aria-label="Secciones del dashboard"
			className="flex gap-1 border-b border-gray-200"
		>
			{TABS.map((tab) => {
				const isActive = tab.id === active;
				return (
					<button
						key={tab.id}
						type="button"
						role="tab"
						id={`tab-${tab.id}`}
						aria-selected={isActive}
						aria-controls={`panel-${tab.id}`}
						onClick={() => onChange(tab.id)}
						className={cn(
							"-mb-px cursor-pointer border-b-2 px-3 py-2 text-sm font-medium transition-colors sm:px-4 sm:text-base",
							isActive
								? "border-amber-500 text-gray-900"
								: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
						)}
					>
						{tab.label}
					</button>
				);
			})}
		</div>
	);
}
