import { expect, test } from "@playwright/test";

// Use the real event ID from EVENT_DETAILS_MAP so findEventBySlug resolves correctly
const REAL_EVENT_ID = "70597170-f501-41f6-9062-3f9d6a5ad7e5";
const REAL_EVENT_SLUG = "paz-financiera";

const MOCK_EVENTS = [
	{
		id: REAL_EVENT_ID,
		name: "Paz Financiera",
		max_capacity: 100,
		current_count: 10,
		created_at: "2025-01-01T00:00:00Z",
	},
];

test.describe("Subscription Flow", () => {
	test.beforeEach(async ({ page }) => {
		// Intercept Supabase API calls
		await page.route("**/rest/v1/events*", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify(MOCK_EVENTS),
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

		// Mock auth - return no session for public pages
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
	});

	test("navigates to equilibrio and opens subscription modal via URL", async ({
		page,
	}) => {
		await page.goto(`/equilibrio?evento=${REAL_EVENT_SLUG}`);

		// Modal should be open (triggered by URL search param)
		await expect(
			page.getByRole("heading", { name: "Reserva tu cupo" }),
		).toBeVisible();
		await expect(
			page.getByText("Completa el formulario para inscribirte"),
		).toBeVisible();
	});

	test("fills form and submits successfully", async ({ page }) => {
		await page.goto(`/equilibrio?evento=${REAL_EVENT_SLUG}`);

		// Wait for modal
		await expect(
			page.getByRole("heading", { name: "Reserva tu cupo" }),
		).toBeVisible();

		// Fill form
		await page.getByPlaceholder("Juan Pérez").fill("Carlos Prueba");
		await page.getByPlaceholder("juan@ejemplo.com").fill("carlos@gmail.com");
		await page.getByPlaceholder("3001234567").fill("3109876543");

		// Check data policy checkbox
		await page.getByRole("checkbox").check();

		// Submit
		await page.getByRole("button", { name: "Inscribirse" }).click();

		// Should redirect to success page
		await expect(page).toHaveURL(/registro-exitoso/);
		await expect(page.getByText("¡Inscripción exitosa!")).toBeVisible();
	});

	test("success page has link back to equilibrio", async ({ page }) => {
		await page.goto("/equilibrio/registro-exitoso");

		await expect(page.getByText("¡Inscripción exitosa!")).toBeVisible();
		await expect(page.getByRole("link", { name: "Volver" })).toHaveAttribute(
			"href",
			"/equilibrio",
		);
	});
});
