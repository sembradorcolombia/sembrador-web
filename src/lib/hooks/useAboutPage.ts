import { useQuery } from "@tanstack/react-query";
import { fetchAboutPage } from "../services/cms";

const CMS_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export function useAboutPage() {
	return useQuery({
		queryKey: ["cms", "aboutPage"],
		queryFn: fetchAboutPage,
		staleTime: CMS_STALE_TIME,
	});
}
