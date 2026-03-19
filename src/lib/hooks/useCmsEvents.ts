import { useQuery } from "@tanstack/react-query";
import {
	fetchEventSeries,
	fetchEventSeriesBySlug,
	fetchEventsBySeries,
} from "../services/cms";

const CMS_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export function useCmsEventSeries() {
	return useQuery({
		queryKey: ["cms", "eventSeries"],
		queryFn: fetchEventSeries,
		staleTime: CMS_STALE_TIME,
	});
}

export function useCmsEventSeriesBySlug(slug: string) {
	return useQuery({
		queryKey: ["cms", "eventSeries", slug],
		queryFn: () => fetchEventSeriesBySlug(slug),
		staleTime: CMS_STALE_TIME,
		enabled: !!slug,
	});
}

export function useCmsEventsBySeries(seriesSlug: string) {
	return useQuery({
		queryKey: ["cms", "eventsBySeries", seriesSlug],
		queryFn: () => fetchEventsBySeries(seriesSlug),
		staleTime: CMS_STALE_TIME,
		enabled: !!seriesSlug,
	});
}
