import { supabase } from "../supabase";
import type { SubscriptionFormData } from "../validations/subscription";

export interface Event {
	id: string;
	name: string;
	maxCapacity: number;
	currentCount: number;
}

// Base service functions
export async function fetchEvents(): Promise<Event[]> {
	const { data, error } = await supabase.from("events").select("*");
	if (error) throw error;
	return (data ?? []).map((event) => ({
		id: event.id,
		name: event.name,
		maxCapacity: event.max_capacity ?? 0,
		currentCount: event.current_count ?? 0,
	}));
}

export async function createSubscription(
	formData: SubscriptionFormData,
): Promise<void> {
	const { error } = await supabase.rpc("create_subscription_with_increment", {
		p_name: formData.name,
		p_email: formData.email,
		p_phone: formData.phone,
		p_event_id: formData.eventId,
		p_accepts_data_policy: Boolean(formData.acceptsDataPolicy),
	});

	if (error) {
		if (error.message.includes("capacity")) {
			throw new Error("Este evento ya alcanzó su capacidad máxima");
		}
		if (error.code === "23505") {
			throw new Error("Ya estás inscrito en este evento");
		}
		throw error;
	}
}
