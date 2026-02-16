import { expect, test } from "@playwright/test";

const adminSession = {
	access_token: "mock-admin-token",
	refresh_token: "mock-refresh-token",
	token_type: "bearer",
	expires_in: 3600,
	user: {
		id: "admin-1",
		email: "admin@sembrador.co",
		app_metadata: { is_admin: true },
	},
};

const mockSubscriptions = [
	{
		id: "sub-1",
		name: "Ana García",
		email: "ana@example.com",
		phone: "3001111111",
		event_id: "evt-1",
		accepts_data_policy: true,
		created_at: "2025-06-15T10:00:00Z",
	},
	{
		id: "sub-2",
		name: "Carlos López",
		email: "carlos@example.com",
		phone: "3002222222",
		event_id: "evt-1",
		accepts_data_policy: true,
		created_at: "2025-06-16T12:00:00Z",
	},
];

test.describe("Dashboard CSV Export", () => {
	test("downloads CSV file when clicking the download button", async ({
		page,
	}) => {
		let hasLoggedIn = false;

		await page.route("**/auth/v1/session*", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					data: { session: hasLoggedIn ? adminSession : null },
				}),
			});
		});

		await page.route("**/auth/v1/user*", async (route) => {
			if (hasLoggedIn) {
				await route.fulfill({
					status: 200,
					contentType: "application/json",
					body: JSON.stringify({ data: { user: adminSession.user } }),
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
				body: JSON.stringify(adminSession),
			});
		});

		await page.route("**/rest/v1/events*", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify([
					{
						id: "evt-1",
						name: "Evento Test",
						max_capacity: 100,
						current_count: 2,
						created_at: "2025-01-01T00:00:00Z",
					},
				]),
			});
		});

		await page.route("**/rest/v1/event_subscriptions*", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify(mockSubscriptions),
			});
		});

		// Log in first to establish the session
		await page.goto("/login");
		await page.getByLabel("Correo electrónico").fill("admin@sembrador.co");
		await page.getByLabel("Contraseña").fill("password123");
		await page.getByRole("button", { name: "Ingresar" }).click();

		// Should navigate to dashboard
		await expect(page).toHaveURL(/\/dashboard/);
		await expect(page.getByText("El Sembrador — Dashboard")).toBeVisible();
		await expect(page.getByText("Evento Test")).toBeVisible();

		const downloadButton = page.getByRole("button", {
			name: /Descargar CSV/i,
		});
		await expect(downloadButton).toBeVisible();

		const [download] = await Promise.all([
			page.waitForEvent("download"),
			downloadButton.click(),
		]);

		expect(download.suggestedFilename()).toMatch(
			/evento-test-inscritos-\d{4}-\d{2}-\d{2}\.csv/,
		);
	});
});
