import { expect, test } from "@playwright/test";

test.describe("Auth Flow", () => {
	test("redirects unauthenticated user from /dashboard to /login", async ({
		page,
	}) => {
		// Mock no session
		await page.route("**/auth/v1/session*", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({ data: { session: null } }),
			});
		});

		await page.route("**/auth/v1/user*", async (route) => {
			await route.fulfill({
				status: 401,
				contentType: "application/json",
				body: JSON.stringify({ error: "not authenticated" }),
			});
		});

		await page.goto("/dashboard");
		await expect(page).toHaveURL(/\/login/);
	});

	test("login page renders form", async ({ page }) => {
		await page.route("**/auth/v1/session*", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({ data: { session: null } }),
			});
		});

		await page.route("**/auth/v1/user*", async (route) => {
			await route.fulfill({
				status: 401,
				contentType: "application/json",
				body: JSON.stringify({ error: "not authenticated" }),
			});
		});

		await page.goto("/login");

		await expect(page.getByText("Admin")).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Ingresar" }),
		).toBeVisible();
	});

	test("logs in and navigates to dashboard", async ({ page }) => {
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

		// Initially no session (login page loads)
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

		// Mock dashboard data
		await page.route("**/rest/v1/events*", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify([
					{
						id: "evt-1",
						name: "Evento Test",
						max_capacity: 100,
						current_count: 25,
						created_at: "2025-01-01T00:00:00Z",
					},
				]),
			});
		});

		await page.route("**/rest/v1/event_subscriptions*", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify([]),
			});
		});

		await page.goto("/login");

		// Fill and submit login form
		await page.getByLabel("Correo electrónico").fill("admin@sembrador.co");
		await page.getByLabel("Contraseña").fill("password123");
		await page.getByRole("button", { name: "Ingresar" }).click();

		// Should navigate to dashboard
		await expect(page).toHaveURL(/\/dashboard/);
		await expect(
			page.getByText("El Sembrador — Dashboard"),
		).toBeVisible();
	});
});
