import type { Tables } from "../database.types";
import { supabase } from "../supabase";

export type EventSubscription = Tables<"event_subscriptions">;

export interface EventWithSubscriptions {
	id: string;
	name: string;
	maxCapacity: number;
	currentCount: number;
	subscriptions: EventSubscription[];
}

export async function fetchEventsWithSubscriptions(): Promise<
	EventWithSubscriptions[]
> {
	const [eventsResult, subscriptionsResult] = await Promise.all([
		supabase
			.from("events")
			.select("*")
			.order("created_at", { ascending: true }),
		supabase
			.from("event_subscriptions")
			.select("*")
			.order("created_at", { ascending: false }),
	]);

	if (eventsResult.error) throw eventsResult.error;
	if (subscriptionsResult.error) throw subscriptionsResult.error;

	const subscriptions = subscriptionsResult.data ?? [];

	return (eventsResult.data ?? []).map((event) => ({
		id: event.id,
		name: event.name,
		maxCapacity: event.max_capacity ?? 0,
		currentCount: event.current_count ?? 0,
		subscriptions: subscriptions.filter((s) => s.event_id === event.id),
	}));
}
