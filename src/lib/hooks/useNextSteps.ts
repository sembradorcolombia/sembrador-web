import { useQuery } from "@tanstack/react-query";
import { fetchNextSteps } from "../services/cms";

const CMS_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export function useNextSteps() {
	return useQuery({
		queryKey: ["cms", "nextSteps"],
		queryFn: fetchNextSteps,
		staleTime: CMS_STALE_TIME,
	});
}
