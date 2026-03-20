import type { Page } from "@playwright/test";
import {
	ADMIN_SESSION,
	MOCK_BLOG_POSTS,
	MOCK_BLOG_POST_DETAIL,
	MOCK_EVENT_SERIES_LIST,
	MOCK_EVENT_SERIES_WITH_EVENTS,
	MOCK_GIVING_OPTIONS,
	MOCK_NEXT_STEPS,
	MOCK_SITE_SETTINGS,
	MOCK_SUPABASE_EVENTS,
} from "./mock-data";

// ── 1×1 transparent PNG ─────────────────────────────────────────────────────

const TRANSPARENT_PIXEL = Buffer.from(
	"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQAB" +
		"Nl7BcQAAAABJRU5ErkJggg==",
	"base64",
);

// ── Sanity CDN Interceptors ─────────────────────────────────────────────────

/**
 * Intercept Sanity CDN API queries and return mock data based on the GROQ query.
 */
export async function interceptSanityQueries(
	page: Page,
	overrides?: {
		siteSettings?: typeof MOCK_SITE_SETTINGS | null;
		blogPosts?: typeof MOCK_BLOG_POSTS;
		blogPostDetail?: typeof MOCK_BLOG_POST_DETAIL | null;
		eventSeriesList?: typeof MOCK_EVENT_SERIES_LIST;
		eventSeriesWithEvents?: typeof MOCK_EVENT_SERIES_WITH_EVENTS | null;
		nextSteps?: typeof MOCK_NEXT_STEPS;
		givingOptions?: typeof MOCK_GIVING_OPTIONS;
	},
) {
	const siteSettings = overrides?.siteSettings ?? MOCK_SITE_SETTINGS;
	const blogPosts = overrides?.blogPosts ?? MOCK_BLOG_POSTS;
	const blogPostDetail = overrides?.blogPostDetail ?? MOCK_BLOG_POST_DETAIL;
	const eventSeriesList = overrides?.eventSeriesList ?? MOCK_EVENT_SERIES_LIST;
	const eventSeriesWithEvents =
		overrides?.eventSeriesWithEvents ?? MOCK_EVENT_SERIES_WITH_EVENTS;
	const nextSteps = overrides?.nextSteps ?? MOCK_NEXT_STEPS;
	const givingOptions = overrides?.givingOptions ?? MOCK_GIVING_OPTIONS;

	await page.route("**sanity.io/v*/data/query/**", async (route) => {
		const url = new URL(route.request().url());
		const query = url.searchParams.get("query") ?? "";

		let result: unknown = [];

		if (query.includes("siteSettings")) {
			result = siteSettings;
		} else if (
			query.includes("blogPost") &&
			query.includes("slug.current")
		) {
			// Single post by slug — return the detail object (or null)
			result = blogPostDetail;
		} else if (query.includes("blogPost") && query.includes("category")) {
			// Filtered by category — extract category from $category param
			const categoryParam = url.searchParams.get("$category");
			const category = categoryParam?.replace(/^"|"$/g, "");
			result = category
				? blogPosts.filter((p) => p.category === category)
				: blogPosts;
		} else if (query.includes("blogPost")) {
			result = blogPosts;
		} else if (
			query.includes("eventSeries") &&
			query.includes("slug.current")
		) {
			result = eventSeriesWithEvents;
		} else if (query.includes("eventSeries")) {
			result = eventSeriesList;
		} else if (query.includes("nextStep")) {
			result = nextSteps;
		} else if (query.includes("givingOption")) {
			result = givingOptions;
		}

		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({ result }),
		});
	});
}

/**
 * Intercept Sanity CDN image requests with a transparent 1×1 PNG.
 */
export async function interceptSanityImages(page: Page) {
	await page.route("**sanity.io/images/**", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "image/png",
			body: TRANSPARENT_PIXEL,
		});
	});
}

// ── Supabase Interceptors ───────────────────────────────────────────────────

/**
 * Set up Supabase API interceptors for public (unauthenticated) pages.
 */
export async function interceptSupabasePublic(page: Page) {
	await page.route("**/rest/v1/events*", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify(MOCK_SUPABASE_EVENTS),
		});
	});

	await page.route("**/rest/v1/rpc/*", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify(null),
		});
	});

	await page.route("**/rest/v1/event_subscriptions*", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify([]),
		});
	});

	await page.route("**/auth/v1/token*", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				access_token: "mock-token",
				token_type: "bearer",
				user: { id: "user-1", email: "visitor@test.com" },
			}),
		});
	});

	await page.route("**/auth/v1/session*", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({ data: { session: null } }),
		});
	});
}

/**
 * Set up Supabase API interceptors for admin (authenticated) pages.
 * Returns helpers to log in programmatically.
 */
export async function interceptSupabaseAdmin(page: Page) {
	let hasLoggedIn = false;

	await page.route("**/auth/v1/session*", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				data: { session: hasLoggedIn ? ADMIN_SESSION : null },
			}),
		});
	});

	await page.route("**/auth/v1/user*", async (route) => {
		if (hasLoggedIn) {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({ data: { user: ADMIN_SESSION.user } }),
			});
		} else {
			await route.fulfill({
				status: 401,
				contentType: "application/json",
				body: JSON.stringify({ error: "not authenticated" }),
			});
		}
	});

	await page.route("**/auth/v1/token*", async (route) => {
		hasLoggedIn = true;
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify(ADMIN_SESSION),
		});
	});

	return {
		markLoggedIn() {
			hasLoggedIn = true;
		},
	};
}
