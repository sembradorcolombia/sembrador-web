import { useMemo } from "react";
import type { Event } from "../services/events";
import type { CmsEvent, CmsEventSeriesWithEvents } from "../types/cms";
import { useCmsEventSeriesBySlug } from "./useCmsEvents";
import { useEvents } from "./useEvents";

export interface MergedEvent {
	/** CMS event data */
	cms: CmsEvent;
	/** Supabase registration data (null if no match found) */
	supabase: Event | null;
}

export interface EventSeriesData {
	series: CmsEventSeriesWithEvents;
	events: MergedEvent[];
}

export function useEventSeriesData(seriesSlug: string) {
	const {
		data: cmsSeries,
		isLoading: cmsLoading,
		isError: cmsError,
	} = useCmsEventSeriesBySlug(seriesSlug);

	const {
		data: supabaseEvents,
		isLoading: supabaseLoading,
		isError: supabaseError,
	} = useEvents();

	const isLoading = cmsLoading || supabaseLoading;
	const isError = cmsError || supabaseError;

	const data = useMemo((): EventSeriesData | null => {
		if (!cmsSeries) return null;

		const supabaseMap = new Map((supabaseEvents ?? []).map((e) => [e.id, e]));

		const events: MergedEvent[] = cmsSeries.events.map((cmsEvent) => ({
			cms: cmsEvent,
			supabase: supabaseMap.get(cmsEvent.supabaseEventId) ?? null,
		}));

		return {
			series: cmsSeries,
			events,
		};
	}, [cmsSeries, supabaseEvents]);

	return { data, isLoading, isError };
}

/**
 * Find a merged event by its CMS slug within the event series data.
 */
export function findMergedEventBySlug(
	events: MergedEvent[],
	slug: string,
): MergedEvent | undefined {
	return events.find((e) => e.cms.slug.current === slug);
}
