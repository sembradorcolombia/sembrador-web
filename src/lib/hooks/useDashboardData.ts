import { useQuery } from "@tanstack/react-query";
import { fetchEventsWithSubscriptions } from "../services/dashboard";

export function useDashboardData() {
	return useQuery({
		queryKey: ["dashboard", "events-with-subscriptions"],
		queryFn: fetchEventsWithSubscriptions,
	});
}
