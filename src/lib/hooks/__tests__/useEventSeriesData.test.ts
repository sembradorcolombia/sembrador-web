import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Event } from "@/lib/services/events";
import type { CmsEvent, CmsEventSeriesWithEvents } from "@/lib/types/cms";
import * as useCmsEventsModule from "../useCmsEvents";
import {
	findMergedEventBySlug,
	type MergedEvent,
	useEventSeriesData,
} from "../useEventSeriesData";
import * as useEventsModule from "../useEvents";

vi.mock("@/lib/hooks/useCmsEvents");
vi.mock("@/lib/hooks/useEvents");

const mockUseCmsEventSeriesBySlug = vi.mocked(
	useCmsEventsModule.useCmsEventSeriesBySlug,
);
const mockUseEvents = vi.mocked(useEventsModule.useEvents);

describe("findMergedEventBySlug", () => {
	const mockEvents: MergedEvent[] = [
		{
			cms: {
				_id: "cms-1",
				slug: { current: "first-event" },
				supabaseEventId: "sup-1",
			} as CmsEvent,
			supabase: { id: "sup-1" } as Event,
		},
		{
			cms: {
				_id: "cms-2",
				slug: { current: "second-event" },
				supabaseEventId: "sup-2",
			} as CmsEvent,
			supabase: null,
		},
	];

	it("returns the merged event matching the given slug", () => {
		const result = findMergedEventBySlug(mockEvents, "first-event");
		expect(result).toBeDefined();
		expect(result?.cms._id).toBe("cms-1");
	});

	it("returns undefined when slug doesn't match any event", () => {
		const result = findMergedEventBySlug(mockEvents, "nonexistent");
		expect(result).toBeUndefined();
	});

	it("matches only by CMS slug, not Supabase data", () => {
		const result = findMergedEventBySlug(mockEvents, "second-event");
		expect(result).toBeDefined();
		expect(result?.supabase).toBeNull();
	});
});

describe("useEventSeriesData", () => {
	it("merges CMS events with Supabase events by supabaseEventId", () => {
		const cmsSeries: CmsEventSeriesWithEvents = {
			_id: "series-1",
			slug: { _type: "slug", current: "test-series" },
			name: "Test Series",
			isActive: true,
			events: [
				{
					_id: "cms-event-1",
					name: "Event 1",
					slug: { _type: "slug", current: "event-1" },
					date: "2026-04-01",
					time: "18:00",
					location: "Church",
					supabaseEventId: "sup-1",
				} as CmsEvent,
				{
					_id: "cms-event-2",
					name: "Event 2",
					slug: { _type: "slug", current: "event-2" },
					date: "2026-04-08",
					time: "18:00",
					location: "Church",
					supabaseEventId: "sup-2",
				} as CmsEvent,
			],
		};

		const supabaseEvents: Event[] = [
			{ id: "sup-1", name: "Event 1" } as Event,
			{ id: "sup-2", name: "Event 2" } as Event,
		];

		mockUseCmsEventSeriesBySlug.mockReturnValue({
			data: cmsSeries,
			isLoading: false,
			isError: false,
		});

		mockUseEvents.mockReturnValue({
			data: supabaseEvents,
			isLoading: false,
			isError: false,
		});

		const { result } = renderHook(() => useEventSeriesData("test-series"));

		expect(result.current.data).toBeDefined();
		expect(result.current.data?.events).toHaveLength(2);
		expect(result.current.data?.events[0].supabase?.id).toBe("sup-1");
		expect(result.current.data?.events[1].supabase?.id).toBe("sup-2");
	});

	it("sets supabase to null when no Supabase match found", () => {
		const cmsSeries: CmsEventSeriesWithEvents = {
			_id: "series-1",
			slug: { _type: "slug", current: "test-series" },
			name: "Test Series",
			isActive: true,
			events: [
				{
					_id: "cms-event-1",
					name: "Event 1",
					slug: { _type: "slug", current: "event-1" },
					date: "2026-04-01",
					time: "18:00",
					location: "Church",
					supabaseEventId: "nonexistent",
				} as CmsEvent,
			],
		};

		mockUseCmsEventSeriesBySlug.mockReturnValue({
			data: cmsSeries,
			isLoading: false,
			isError: false,
		});

		mockUseEvents.mockReturnValue({
			data: [],
			isLoading: false,
			isError: false,
		});

		const { result } = renderHook(() => useEventSeriesData("test-series"));

		expect(result.current.data?.events[0].supabase).toBeNull();
	});

	it("returns null data when CMS series not yet loaded", () => {
		mockUseCmsEventSeriesBySlug.mockReturnValue({
			data: null,
			isLoading: true,
			isError: false,
		});

		mockUseEvents.mockReturnValue({
			data: [],
			isLoading: false,
			isError: false,
		});

		const { result } = renderHook(() => useEventSeriesData("test-series"));

		expect(result.current.data).toBeNull();
	});

	it("sets isLoading true when either CMS or Supabase is loading", () => {
		mockUseCmsEventSeriesBySlug.mockReturnValue({
			data: null,
			isLoading: true,
			isError: false,
		});

		mockUseEvents.mockReturnValue({
			data: [],
			isLoading: false,
			isError: false,
		});

		const { result } = renderHook(() => useEventSeriesData("test-series"));

		expect(result.current.isLoading).toBe(true);
	});

	it("sets isLoading true when Supabase is loading", () => {
		const cmsSeries: CmsEventSeriesWithEvents = {
			_id: "series-1",
			slug: { _type: "slug", current: "test-series" },
			name: "Test Series",
			isActive: true,
			events: [],
		};

		mockUseCmsEventSeriesBySlug.mockReturnValue({
			data: cmsSeries,
			isLoading: false,
			isError: false,
		});

		mockUseEvents.mockReturnValue({
			data: null,
			isLoading: true,
			isError: false,
		});

		const { result } = renderHook(() => useEventSeriesData("test-series"));

		expect(result.current.isLoading).toBe(true);
	});

	it("returns error state when CMS has error", () => {
		mockUseCmsEventSeriesBySlug.mockReturnValue({
			data: null,
			isLoading: false,
			isError: true,
		});

		mockUseEvents.mockReturnValue({
			data: [],
			isLoading: false,
			isError: false,
		});

		const { result } = renderHook(() => useEventSeriesData("test-series"));

		expect(result.current.isError).toBe(true);
	});

	it("returns error state when Supabase has error", () => {
		mockUseCmsEventSeriesBySlug.mockReturnValue({
			data: null,
			isLoading: false,
			isError: false,
		});

		mockUseEvents.mockReturnValue({
			data: null,
			isLoading: false,
			isError: true,
		});

		const { result } = renderHook(() => useEventSeriesData("test-series"));

		expect(result.current.isError).toBe(true);
	});
});
