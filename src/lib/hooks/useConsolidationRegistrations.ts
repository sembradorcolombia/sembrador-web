import { useQuery } from "@tanstack/react-query";
import { fetchConsolidationRegistrations } from "../services/consolidation";

export function useConsolidationRegistrations() {
	return useQuery({
		queryKey: ["dashboard", "consolidation-registrations"],
		queryFn: fetchConsolidationRegistrations,
	});
}
