import { useQuery } from "@tanstack/react-query";
import { fetchLeadership } from "../services/cms";

const CMS_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export function useLeadership() {
	return useQuery({
		queryKey: ["cms", "leadership"],
		queryFn: fetchLeadership,
		staleTime: CMS_STALE_TIME,
	});
}
