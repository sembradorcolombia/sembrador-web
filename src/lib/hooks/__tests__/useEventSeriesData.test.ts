import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Event } from "@/lib/services/events";
import type { CmsEvent, CmsEventSeriesWithEvents } from "@/lib/types/cms";
import {
	findMergedEventBySlug,
	type MergedEvent,
	useEventSeriesData,
} from "../useEventSeriesData";

vi.mock("@/lib/hooks/useCmsEvents", () => ({
	useCmsEventSeriesBySlug: vi.fn(),
}));

vi.mock("@/lib/hooks/useEvents", () => ({
	useEvents: vi.fn(),
}));

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
	it("merges CMS events with Supabase events by supabaseEventId", async () => {
		const { useCmsEventSeriesBySlug } = await import(
			"@/lib/hooks/useCmsEvents"
		);
		const { useEvents } = await import("@/lib/hooks/useEvents");

		const cmsSeries: CmsEventSeriesWithEvents = {
			_id: "series-1",
			slug: { current: "test-series" },
			events: [
				{
					_id: "cms-event-1",
					slug: { current: "event-1" },
					supabaseEventId: "sup-1",
				} as CmsEvent,
				{
					_id: "cms-event-2",
					slug: { current: "event-2" },
					supabaseEventId: "sup-2",
				} as CmsEvent,
			],
		} as CmsEventSeriesWithEvents;

		const supabaseEvents: Event[] = [
			{ id: "sup-1", name: "Event 1" } as Event,
			{ id: "sup-2", name: "Event 2" } as Event,
		];

		useCmsEventSeriesBySlug.mockReturnValue({
			data: cmsSeries,
			isLoading: false,
			isError: false,
		});

		useEvents.mockReturnValue({
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

	it("sets supabase to null when no Supabase match found", async () => {
		const { useCmsEventSeriesBySlug } = await import(
			"@/lib/hooks/useCmsEvents"
		);
		const { useEvents } = await import("@/lib/hooks/useEvents");

		const cmsSeries: CmsEventSeriesWithEvents = {
			_id: "series-1",
			slug: { current: "test-series" },
			events: [
				{
					_id: "cms-event-1",
					slug: { current: "event-1" },
					supabaseEventId: "nonexistent",
				} as CmsEvent,
			],
		} as CmsEventSeriesWithEvents;

		useCmsEventSeriesBySlug.mockReturnValue({
			data: cmsSeries,
			isLoading: false,
			isError: false,
		});

		useEvents.mockReturnValue({
			data: [],
			isLoading: false,
			isError: false,
		});

		const { result } = renderHook(() => useEventSeriesData("test-series"));

		expect(result.current.data?.events[0].supabase).toBeNull();
	});

	it("returns null data when CMS series not yet loaded", async () => {
		const { useCmsEventSeriesBySlug } = await import(
			"@/lib/hooks/useCmsEvents"
		);
		const { useEvents } = await import("@/lib/hooks/useEvents");

		useCmsEventSeriesBySlug.mockReturnValue({
			data: null,
			isLoading: true,
			isError: false,
		});

		useEvents.mockReturnValue({
			data: [],
			isLoading: false,
			isError: false,
		});

		const { result } = renderHook(() => useEventSeriesData("test-series"));

		expect(result.current.data).toBeNull();
	});

	it("sets isLoading true when either CMS or Supabase is loading", async () => {
		const { useCmsEventSeriesBySlug } = await import(
			"@/lib/hooks/useCmsEvents"
		);
		const { useEvents } = await import("@/lib/hooks/useEvents");

		useCmsEventSeriesBySlug.mockReturnValue({
			data: null,
			isLoading: true,
			isError: false,
		});

		useEvents.mockReturnValue({
			data: [],
			isLoading: false,
			isError: false,
		});

		const { result } = renderHook(() => useEventSeriesData("test-series"));

		expect(result.current.isLoading).toBe(true);
	});

	it("sets isLoading true when Supabase is loading", async () => {
		const { useCmsEventSeriesBySlug } = await import(
			"@/lib/hooks/useCmsEvents"
		);
		const { useEvents } = await import("@/lib/hooks/useEvents");

		const cmsSeries: CmsEventSeriesWithEvents = {
			_id: "series-1",
			slug: { current: "test-series" },
			events: [],
		} as CmsEventSeriesWithEvents;

		useCmsEventSeriesBySlug.mockReturnValue({
			data: cmsSeries,
			isLoading: false,
			isError: false,
		});

		useEvents.mockReturnValue({
			data: null,
			isLoading: true,
			isError: false,
		});

		const { result } = renderHook(() => useEventSeriesData("test-series"));

		expect(result.current.isLoading).toBe(true);
	});

	it("returns error state when CMS has error", async () => {
		const { useCmsEventSeriesBySlug } = await import(
			"@/lib/hooks/useCmsEvents"
		);
		const { useEvents } = await import("@/lib/hooks/useEvents");

		useCmsEventSeriesBySlug.mockReturnValue({
			data: null,
			isLoading: false,
			isError: true,
		});

		useEvents.mockReturnValue({
			data: [],
			isLoading: false,
			isError: false,
		});

		const { result } = renderHook(() => useEventSeriesData("test-series"));

		expect(result.current.isError).toBe(true);
	});

	it("returns error state when Supabase has error", async () => {
		const { useCmsEventSeriesBySlug } = await import(
			"@/lib/hooks/useCmsEvents"
		);
		const { useEvents } = await import("@/lib/hooks/useEvents");

		useCmsEventSeriesBySlug.mockReturnValue({
			data: null,
			isLoading: false,
			isError: false,
		});

		useEvents.mockReturnValue({
			data: null,
			isLoading: false,
			isError: true,
		});

		const { result } = renderHook(() => useEventSeriesData("test-series"));

		expect(result.current.isError).toBe(true);
	});
});
