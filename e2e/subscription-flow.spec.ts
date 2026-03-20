import { expect, test } from "@playwright/test";
import {
	interceptSanityImages,
	interceptSanityQueries,
	interceptSupabasePublic,
} from "./fixtures/interceptors";

const REAL_EVENT_SLUG = "paz-financiera";

test.describe("Subscription Flow", () => {
	test.beforeEach(async ({ page }) => {
		await interceptSanityQueries(page);
		await interceptSanityImages(page);
		await interceptSupabasePublic(page);
	});

	test("navigates to event series and opens subscription modal via URL", async ({
		page,
	}) => {
		await page.goto(`/eventos/equilibrio?evento=${REAL_EVENT_SLUG}`);

		// Modal should be open (triggered by URL search param)
		await expect(
			page.getByRole("heading", { name: "Reserva tu cupo" }),
		).toBeVisible();
		await expect(
			page.getByText("Completa el formulario para inscribirte"),
		).toBeVisible();
	});

	test("fills form and submits successfully", async ({ page }) => {
		await page.goto(`/eventos/equilibrio?evento=${REAL_EVENT_SLUG}`);

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

	test("success page has link back to event series", async ({ page }) => {
		await page.goto("/eventos/equilibrio/registro-exitoso");

		await expect(page.getByText("¡Inscripción exitosa!")).toBeVisible();
		await expect(page.getByRole("link", { name: "Volver" })).toHaveAttribute(
			"href",
			"/eventos/equilibrio",
		);
	});
});
