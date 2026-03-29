import { expect, test } from "@playwright/test";
import {
	interceptSanityImages,
	interceptSanityQueries,
	interceptSupabasePublic,
} from "./fixtures/interceptors";
import {
	MOCK_BLOG_POSTS,
	MOCK_BLOG_POST_DETAIL,
	MOCK_EVENT_SERIES_LIST,
	MOCK_EVENT_SERIES_WITH_EVENTS,
	MOCK_GIVING_OPTIONS,
	MOCK_NEXT_STEPS,
	MOCK_SITE_SETTINGS,
} from "./fixtures/mock-data";

test.describe("CMS Content", () => {
	test.beforeEach(async ({ page }) => {
		await interceptSanityQueries(page);
		await interceptSanityImages(page);
		await interceptSupabasePublic(page);
	});

	// ── Home Page ──────────────────────────────────────────────────────────────

	test.describe("Home Page", () => {
		test("renders hero and preview sections with CMS content", async ({
			page,
		}) => {
			await page.goto("/");

			// Hero section — church name from CMS
			await expect(
				page.getByRole("heading", { name: MOCK_SITE_SETTINGS.churchName }),
			).toBeVisible();

			// Blog preview — post titles
			for (const post of MOCK_BLOG_POSTS) {
				await expect(page.getByText(post.title).first()).toBeVisible();
			}

			// Events preview — active series name
			await expect(
				page.getByText(MOCK_EVENT_SERIES_LIST[0].name).first(),
			).toBeVisible();

			// Next steps preview — step titles
			for (const step of MOCK_NEXT_STEPS) {
				await expect(page.getByText(step.title).first()).toBeVisible();
			}
		});
	});

	// ── Blog Pages ────────────────────────────────────────────────────────────

	test.describe("Blog Pages", () => {
		test("blog listing shows post titles and category filter", async ({
			page,
		}) => {
			await page.goto("/blog");

			// Page heading
			await expect(
				page.getByRole("heading", { name: "Blog" }),
			).toBeVisible();

			// Category filter buttons
			await expect(
				page.getByRole("button", { name: "Todos" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "Sermones" }),
			).toBeVisible();
			await expect(
				page.getByRole("button", { name: "Noticias" }),
			).toBeVisible();

			// Post titles
			for (const post of MOCK_BLOG_POSTS) {
				await expect(page.getByText(post.title)).toBeVisible();
			}
		});

		test("blog category filter shows only sermon posts", async ({ page }) => {
			await page.goto("/blog?categoria=sermon");

			// Sermon post visible
			const sermonPost = MOCK_BLOG_POSTS.find((p) => p.category === "sermon");
			if (sermonPost) {
				await expect(page.getByText(sermonPost.title)).toBeVisible();
			}

			// News post not visible
			const newsPost = MOCK_BLOG_POSTS.find((p) => p.category === "news");
			if (newsPost) {
				await expect(page.getByText(newsPost.title)).not.toBeVisible();
			}
		});

		test("blog post detail renders title, author, and category", async ({
			page,
		}) => {
			await page.goto("/blog/la-gracia-transformadora");

			// Title
			await expect(
				page.getByRole("heading", { name: MOCK_BLOG_POST_DETAIL.title }),
			).toBeVisible();

			// Author name
			if (MOCK_BLOG_POST_DETAIL.author) {
				await expect(
					page.getByText(MOCK_BLOG_POST_DETAIL.author.name),
				).toBeVisible();
			}

			// Category label (sermon → Sermón)
			await expect(page.getByText("Sermón")).toBeVisible();

			// Back link
			await expect(
				page.getByRole("link", { name: /Volver al blog/ }),
			).toBeVisible();
		});
	});

	// ── Events Directory ──────────────────────────────────────────────────────

	test.describe("Events Directory", () => {
		test("events page shows active series and hides inactive", async ({
			page,
		}) => {
			await page.goto("/eventos");

			// Active series visible
			await expect(
				page.getByText(MOCK_EVENT_SERIES_LIST[0].name),
			).toBeVisible();

			// Inactive series not rendered
			await expect(
				page.getByText(MOCK_EVENT_SERIES_LIST[1].name),
			).not.toBeVisible();
		});

		test("event series page renders events and header", async ({ page }) => {
			await page.goto("/eventos/equilibrio");

			// Header bar text
			await expect(page.getByText("Entrada Gratuita")).toBeVisible();

			// Event name from CMS
			await expect(
				page.getByText(MOCK_EVENT_SERIES_WITH_EVENTS.events[0].name),
			).toBeVisible();
		});
	});

	// ── About Page ────────────────────────────────────────────────────────────

	test.describe("About Page", () => {
		test("renders tagline and about content from site settings", async ({
			page,
		}) => {
			await page.goto("/acerca");

			// Page heading
			await expect(
				page.getByRole("heading", { name: "Acerca" }),
			).toBeVisible();

			// Tagline from CMS
			await expect(
				page.getByText(MOCK_SITE_SETTINGS.tagline),
			).toBeVisible();

			// About description
			await expect(
				page.getByText(MOCK_SITE_SETTINGS.aboutDescription),
			).toBeVisible();

			// Location
			await expect(
				page.getByText(MOCK_SITE_SETTINGS.aboutLocation),
			).toBeVisible();

			// Service times
			await expect(
				page.getByText(MOCK_SITE_SETTINGS.aboutServiceTimes),
			).toBeVisible();
		});
	});

	// ── Next Steps Page ───────────────────────────────────────────────────────

	test.describe("Next Steps Page", () => {
		test("renders step titles and descriptions", async ({ page }) => {
			await page.goto("/siguientes-pasos");

			// Page heading
			await expect(
				page.getByRole("heading", { name: "Siguientes Pasos" }),
			).toBeVisible();

			for (const step of MOCK_NEXT_STEPS) {
				await expect(page.getByText(step.title).first()).toBeVisible();
				await expect(page.getByText(step.description).first()).toBeVisible();
			}
		});
	});

	// ── Giving Page ───────────────────────────────────────────────────────────

	test.describe("Giving Page", () => {
		test("renders giving option titles and descriptions", async ({ page }) => {
			await page.goto("/dar");

			// Page heading
			await expect(
				page.getByRole("heading", { name: "Dar" }),
			).toBeVisible();

			for (const option of MOCK_GIVING_OPTIONS) {
				await expect(
					page.getByRole("heading", { name: option.title }),
				).toBeVisible();
				await expect(page.getByText(option.description)).toBeVisible();
			}
		});
	});

	// ── Footer ────────────────────────────────────────────────────────────────

	test.describe("Footer", () => {
		test("renders CMS content in footer", async ({ page }) => {
			// Use /acerca since it has the shared layout (navbar + footer)
			await page.goto("/acerca");

			const footer = page.locator("footer");

			// Footer tagline
			await expect(
				footer.getByText(MOCK_SITE_SETTINGS.footerTagline),
			).toBeVisible();

			// Contact info
			await expect(
				footer.getByText(MOCK_SITE_SETTINGS.address),
			).toBeVisible();
			await expect(
				footer.getByText(MOCK_SITE_SETTINGS.contactPhone),
			).toBeVisible();
			await expect(
				footer.getByText(MOCK_SITE_SETTINGS.contactEmail),
			).toBeVisible();

			// Social links — aria-labels match platform name
			for (const social of MOCK_SITE_SETTINGS.socialLinks) {
				await expect(
					footer.getByRole("link", { name: social.platform }),
				).toBeVisible();
			}

			// Navigation links
			await expect(footer.getByRole("link", { name: "Inicio" })).toBeVisible();
			await expect(footer.getByRole("link", { name: "Blog" })).toBeVisible();
			await expect(footer.getByRole("link", { name: "Acerca" })).toBeVisible();
			await expect(
				footer.getByRole("link", { name: "Eventos" }),
			).toBeVisible();
			await expect(
				footer.getByRole("link", { name: "Siguientes Pasos" }),
			).toBeVisible();
			await expect(footer.getByRole("link", { name: "Dar" })).toBeVisible();
		});
	});
});
