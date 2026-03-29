import { useQuery } from "@tanstack/react-query";
import { fetchSiteSettings } from "../services/cms";

const SITE_SETTINGS_STALE_TIME = 30 * 60 * 1000; // 30 minutes

export function useSiteSettings() {
	return useQuery({
		queryKey: ["cms", "siteSettings"],
		queryFn: fetchSiteSettings,
		staleTime: SITE_SETTINGS_STALE_TIME,
	});
}
