import { useQuery } from "@tanstack/react-query";
import { fetchConnectSteps } from "../services/cms";

const CMS_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export function useConnectSteps() {
	return useQuery({
		queryKey: ["cms", "connectSteps"],
		queryFn: fetchConnectSteps,
		staleTime: CMS_STALE_TIME,
	});
}
