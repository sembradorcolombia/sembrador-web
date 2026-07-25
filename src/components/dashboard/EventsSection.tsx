import { useDashboardData } from "@/lib/hooks/useDashboardData";
import { EventCard } from "./EventCard";
import { SubscriberSearch } from "./SubscriberSearch";

export function EventsSection() {
	const { data, isLoading, isError } = useDashboardData();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-24">
				<p className="text-gray-500">Cargando...</p>
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className="flex items-center justify-center py-24">
				<p className="text-red-600">Error al cargar los datos.</p>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<SubscriberSearch data={data} />
			{data.map((event) => (
				<EventCard key={event.id} event={event} />
			))}
		</div>
	);
}
