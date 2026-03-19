import { useQuery } from "@tanstack/react-query";
import { fetchGivingOptions } from "../services/cms";

const CMS_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export function useGivingOptions() {
	return useQuery({
		queryKey: ["cms", "givingOptions"],
		queryFn: fetchGivingOptions,
		staleTime: CMS_STALE_TIME,
	});
}
