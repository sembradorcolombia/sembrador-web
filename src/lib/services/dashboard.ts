import type { Tables } from "../database.types";
import { supabase } from "../supabase";

type EventSubscriptionRow = Tables<"event_subscriptions">;

/**
 * A subscription enriched with its Noche de Parejas couple link, when one
 * exists. The couple fields are populated for the person who registered the
 * couple (the relationship's `subscription_id`); other subscribers have them
 * as null.
 */
export interface EventSubscription extends EventSubscriptionRow {
	conyugeName: string | null;
	conyugeLastname: string | null;
	relationship: string | null;
}

export interface EventWithSubscriptions {
	id: string;
	name: string;
	maxCapacity: number;
	currentCount: number;
	subscriptions: EventSubscription[];
}

const PAGE_SIZE = 1000;

async function fetchCoupleInfoForEvent(
	eventId: string,
): Promise<
	Map<string, { name: string; lastname: string; relationship: string }>
> {
	const { data, error } = await supabase
		.from("noche_parejas_relationships")
		.select("subscription_id, conyuge_name, conyuge_lastname, relationship")
		.eq("event_id", eventId);

	if (error) throw error;

	const map = new Map<
		string,
		{ name: string; lastname: string; relationship: string }
	>();
	for (const row of data ?? []) {
		map.set(row.subscription_id, {
			name: row.conyuge_name,
			lastname: row.conyuge_lastname,
			relationship: row.relationship,
		});
	}
	return map;
}

async function fetchAllSubscriptionsForEvent(
	eventId: string,
): Promise<EventSubscription[]> {
	const rows: EventSubscriptionRow[] = [];
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

		rows.push(...data);
		if (data.length < PAGE_SIZE) break;
		offset += PAGE_SIZE;
	}

	const coupleInfo = await fetchCoupleInfoForEvent(eventId);

	return rows.map((row) => {
		const couple = coupleInfo.get(row.id);
		return {
			...row,
			conyugeName: couple?.name ?? null,
			conyugeLastname: couple?.lastname ?? null,
			relationship: couple?.relationship ?? null,
		};
	});
}

export async function updateSubscriptionAttendance(
	subscriptionId: string,
	attended: boolean,
): Promise<void> {
	const { error } = await supabase
		.from("event_subscriptions")
		.update({ attended })
		.eq("id", subscriptionId);
	if (error) throw error;
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
