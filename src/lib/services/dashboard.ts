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

const PAGE_SIZE = 1000;

async function fetchAllSubscriptionsForEvent(
	eventId: string,
): Promise<EventSubscription[]> {
	const all: EventSubscription[] = [];
	let offset = 0;

	while (true) {
		const { data, error } = await supabase
			.from("event_subscriptions")
			.select("*")
			.eq("event_id", eventId)
			.order("created_at", { ascending: false })
			.range(offset, offset + PAGE_SIZE - 1);

		if (error) throw error;
		if (!data || data.length === 0) break;

		all.push(...data);
		if (data.length < PAGE_SIZE) break;
		offset += PAGE_SIZE;
	}

	return all;
}

export async function fetchEventsWithSubscriptions(): Promise<
	EventWithSubscriptions[]
> {
	const eventsResult = await supabase
		.from("events")
		.select("*")
		.order("created_at", { ascending: true });

	if (eventsResult.error) throw eventsResult.error;

	const events = eventsResult.data ?? [];

	return Promise.all(
		events.map(async (event) => ({
			id: event.id,
			name: event.name,
			maxCapacity: event.max_capacity ?? 0,
			currentCount: event.current_count ?? 0,
			subscriptions: await fetchAllSubscriptionsForEvent(event.id),
		})),
	);
}
