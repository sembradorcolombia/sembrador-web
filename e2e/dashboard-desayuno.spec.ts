import { expect, test } from "@playwright/test";
import {
	interceptSanityQueries,
	interceptSupabaseAdmin,
} from "./fixtures/interceptors";

const mockDesayunoRegistrations = [
	{
		id: "des-1",
		name: "Ana",
		lastname: "García",
		email: "ana@example.com",
		phone: "3001111111",
		accepts_data_policy: true,
		created_at: "2025-06-15T10:00:00Z",
	},
	{
		id: "des-2",
		name: "Carlos",
		lastname: "López",
		email: "carlos@example.com",
		phone: "3002222222",
		accepts_data_policy: false,
		created_at: "2025-06-16T12:00:00Z",
	},
];

test.describe("Dashboard Desayuno section", () => {
	test("lists breakfast registrations and exports CSV", async ({ page }) => {
		await interceptSanityQueries(page);
		await interceptSupabaseAdmin(page);

		await page.route("**/rest/v1/events*", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify([]),
			});
		});

		await page.route("**/rest/v1/desayuno_registrations*", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify(mockDesayunoRegistrations),
			});
		});

		await page.goto("/login");
		await page.getByLabel("Correo electrónico").fill("admin@sembrador.co");
		await page.getByLabel("Contraseña").fill("password123");
		await page.getByRole("button", { name: "Ingresar" }).click();

		await expect(page).toHaveURL(/\/dashboard/);

		await page.getByRole("tab", { name: "Desayuno" }).click();

		await expect(page.getByText("Ana", { exact: true })).toBeVisible();
		await expect(page.getByText("García", { exact: true })).toBeVisible();
		await expect(page.getByText("carlos@example.com")).toBeVisible();
		await expect(page.getByText("2 registros")).toBeVisible();

		const downloadButton = page.getByRole("button", {
			name: /Descargar CSV/i,
		});
		const [download] = await Promise.all([
			page.waitForEvent("download"),
			downloadButton.click(),
		]);

		expect(download.suggestedFilename()).toMatch(
			/desayuno-registros-\d{4}-\d{2}-\d{2}\.csv/,
		);
	});

	test("scrolls horizontally within its own container on a narrow viewport", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 375, height: 800 });

		await interceptSanityQueries(page);
		await interceptSupabaseAdmin(page);

		await page.route("**/rest/v1/events*", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify([]),
			});
		});

		await page.route("**/rest/v1/desayuno_registrations*", async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify(mockDesayunoRegistrations),
			});
		});

		await page.goto("/login");
		await page.getByLabel("Correo electrónico").fill("admin@sembrador.co");
		await page.getByLabel("Contraseña").fill("password123");
		await page.getByRole("button", { name: "Ingresar" }).click();

		await expect(page).toHaveURL(/\/dashboard/);
		await page.getByRole("tab", { name: "Desayuno" }).click();
		await expect(page.getByText("carlos@example.com")).toBeVisible();

		const bodyScrollWidth = await page.evaluate(
			() => document.body.scrollWidth,
		);
		const viewportWidth = await page.evaluate(() => window.innerWidth);
		expect(bodyScrollWidth).toBeLessThanOrEqual(viewportWidth);

		await expect(
			page.getByPlaceholder("Buscar nombre, email o celular..."),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: /Descargar CSV/i }),
		).toBeVisible();
	});
});
