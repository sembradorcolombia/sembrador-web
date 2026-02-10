import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../services/events";

export function useEvents() {
	return useQuery({
		queryKey: ["events"],
		queryFn: fetchEvents,
	});
}
