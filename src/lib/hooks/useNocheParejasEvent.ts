import { NOCHE_PAREJAS_EVENT_NAME } from "@/lib/constants/events";
import { useEvents } from "./useEvents";

export interface NocheParejasEventState {
	eventId: string | undefined;
	isLoading: boolean;
	isError: boolean;
}

export function useNocheParejasEvent(): NocheParejasEventState {
	const { data: events, isLoading, isError } = useEvents();

	const eventId = events?.find(
		(event) => event.name === NOCHE_PAREJAS_EVENT_NAME,
	)?.id;

	return { eventId, isLoading, isError };
}
