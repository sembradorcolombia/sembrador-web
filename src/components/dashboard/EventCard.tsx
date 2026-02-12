import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { EventWithSubscriptions } from "@/lib/services/dashboard";
import { SubscribersTable } from "./SubscribersTable";

interface EventCardProps {
	event: EventWithSubscriptions;
}

export function EventCard({ event }: EventCardProps) {
	const [isExpanded, setIsExpanded] = useState(true);
	const percentage =
		event.maxCapacity > 0
			? Math.round((event.currentCount / event.maxCapacity) * 100)
			: 0;

	return (
		<div className="rounded-lg bg-white p-4 shadow sm:p-6">
			<div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
				<h2 className="text-lg font-bold">{event.name}</h2>
				<span className="text-sm text-gray-600">
					{event.currentCount} / {event.maxCapacity} inscritos ({percentage}%)
				</span>
			</div>

			<div className="mb-4 h-2 w-full rounded-full bg-gray-200">
				<div
					className="h-2 rounded-full bg-emerald-600 transition-all"
					style={{ width: `${Math.min(percentage, 100)}%` }}
				/>
			</div>

			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900"
			>
				{isExpanded ? (
					<ChevronUp className="h-4 w-4" />
				) : (
					<ChevronDown className="h-4 w-4" />
				)}
				{isExpanded ? "Ocultar" : "Ver"} inscritos ({event.subscriptions.length}
				)
			</button>

			{isExpanded && <SubscribersTable subscriptions={event.subscriptions} />}
		</div>
	);
}
