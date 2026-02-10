import { useMemo } from "react";
import { DEFAULT_EVENT_DETAILS, EVENT_DETAILS_MAP } from "../constants/eventDetails";
import type { EventWithDetails } from "../types/event";
import { useEvents } from "./useEvents";

export function useEventsWithDetails() {
	const { data: events, ...rest } = useEvents();

	const eventsWithDetails = useMemo((): EventWithDetails[] | undefined => {
		return events?.map((event) => ({
			...event,
			details: EVENT_DETAILS_MAP[event.id] || DEFAULT_EVENT_DETAILS,
		}));
	}, [events]);

	return { data: eventsWithDetails, ...rest };
}
