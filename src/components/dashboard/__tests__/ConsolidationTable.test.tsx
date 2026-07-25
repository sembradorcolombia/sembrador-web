import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ConsolidationRegistration } from "@/lib/services/consolidation";
import { ConsolidationTable } from "../ConsolidationTable";

vi.mock("@/lib/csv", () => ({
	downloadCSV: vi.fn(),
}));

import { downloadCSV } from "@/lib/csv";

const mockRegistrations: ConsolidationRegistration[] = [
	{
		id: "reg-1",
		name: "Ana",
		lastname: "García",
		email: "ana@example.com",
		mobile: "3001111111",
		next_step: "Discipulado 1:1",
		comment: "Quiero saber más",
		accepts_data_policy: true,
		created_at: "2026-06-15T10:00:00Z",
	},
	{
		id: "reg-2",
		name: "Carlos",
		lastname: "López",
		email: "carlos@example.com",
		mobile: "3002222222",
		next_step: "Consejería",
		comment: null,
		accepts_data_policy: true,
		created_at: "2026-06-16T12:00:00Z",
	},
];

/**
 * 25 registrations — one more than a full page — so pagination, the range
 * label and cross-page sorting have something to act on. Names are zero-padded
 * so lexicographic order matches numeric order.
 */
const manyRegistrations: ConsolidationRegistration[] = Array.from(
	{ length: 25 },
	(_, i) => ({
		id: `reg-${i + 1}`,
		name: `Nombre${String(i + 1).padStart(2, "0")}`,
		lastname: `Apellido${String(i + 1).padStart(2, "0")}`,
		email: `persona${i + 1}@example.com`,
		mobile: `30000000${String(i + 1).padStart(2, "0")}`,
		next_step: "Discipulado 1:1",
		comment: null,
		accepts_data_policy: true,
		created_at: new Date(Date.UTC(2026, 0, i + 1, 10)).toISOString(),
	}),
);

function bodyRowNames() {
	const rows = screen.getAllByRole("row").slice(1); // drop the header row
	return rows.map((row) => within(row).getAllByRole("cell")[1].textContent);
}

describe("ConsolidationTable", () => {
	it("shows empty message when there are no registrations", () => {
		render(<ConsolidationTable registrations={[]} />);
		expect(screen.getByText("No hay registros aun.")).toBeInTheDocument();
	});

	it("renders a row per registration with all columns", () => {
		render(<ConsolidationTable registrations={mockRegistrations} />);

		expect(screen.getByText("Ana")).toBeInTheDocument();
		expect(screen.getByText("García")).toBeInTheDocument();
		expect(screen.getByText("ana@example.com")).toBeInTheDocument();
		expect(screen.getByText("3001111111")).toBeInTheDocument();
		expect(screen.getByText("Discipulado 1:1")).toBeInTheDocument();
		expect(screen.getByText("Quiero saber más")).toBeInTheDocument();
	});

	it("renders an em dash for a null comment", () => {
		render(<ConsolidationTable registrations={mockRegistrations} />);
		expect(screen.getByText("—")).toBeInTheDocument();
	});

	it("orders by date descending on first render", () => {
		render(<ConsolidationTable registrations={mockRegistrations} />);
		expect(bodyRowNames()).toEqual(["Carlos", "Ana"]);
	});

	it("sorts ascending then descending when a header is clicked", async () => {
		const user = userEvent.setup();
		render(<ConsolidationTable registrations={mockRegistrations} />);

		await user.click(screen.getByRole("button", { name: /Nombre/i }));
		expect(bodyRowNames()).toEqual(["Ana", "Carlos"]);

		await user.click(screen.getByRole("button", { name: /Nombre/i }));
		expect(bodyRowNames()).toEqual(["Carlos", "Ana"]);
	});

	it.each([
		["email", "carlos@example.com"],
		["name", "Ana"],
		["lastname", "López"],
		["mobile", "3001111111"],
	])("filters by %s", async (_field, query) => {
		const user = userEvent.setup();
		render(<ConsolidationTable registrations={mockRegistrations} />);

		await user.type(screen.getByLabelText(/Buscar/i), query);

		expect(screen.getAllByRole("row")).toHaveLength(2); // header + 1 match
	});

	it("matches case-insensitively", async () => {
		const user = userEvent.setup();
		render(<ConsolidationTable registrations={mockRegistrations} />);

		await user.type(screen.getByLabelText(/Buscar/i), "ANA@EXAMPLE");

		expect(bodyRowNames()).toEqual(["Ana"]);
	});

	it("shows a no-results message when nothing matches", async () => {
		const user = userEvent.setup();
		render(<ConsolidationTable registrations={mockRegistrations} />);

		await user.type(screen.getByLabelText(/Buscar/i), "zzzz");

		expect(
			screen.getByText("No se encontraron resultados"),
		).toBeInTheDocument();
	});

	it("restores every row when the search is cleared", async () => {
		const user = userEvent.setup();
		render(<ConsolidationTable registrations={mockRegistrations} />);

		const search = screen.getByLabelText(/Buscar/i);
		await user.type(search, "ana");
		expect(bodyRowNames()).toEqual(["Ana"]);

		await user.clear(search);
		expect(bodyRowNames()).toEqual(["Carlos", "Ana"]);
	});

	it("exports every registration to CSV in the displayed order", async () => {
		const user = userEvent.setup();
		vi.setSystemTime(new Date("2026-07-25T12:00:00Z"));

		render(<ConsolidationTable registrations={mockRegistrations} />);
		await user.click(screen.getByRole("button", { name: /Descargar CSV/i }));

		expect(downloadCSV).toHaveBeenCalledWith(
			"consolidacion-registros-2026-07-25.csv",
			[
				"#",
				"Nombre",
				"Apellido",
				"Email",
				"Celular",
				"Conectar",
				"Comentario",
				"Fecha",
			],
			[
				[
					"1",
					"Carlos",
					"López",
					"carlos@example.com",
					"3002222222",
					"Consejería",
					"",
					new Date("2026-06-16T12:00:00Z").toLocaleDateString("es-CO"),
				],
				[
					"2",
					"Ana",
					"García",
					"ana@example.com",
					"3001111111",
					"Discipulado 1:1",
					"Quiero saber más",
					new Date("2026-06-15T10:00:00Z").toLocaleDateString("es-CO"),
				],
			],
		);

		vi.useRealTimers();
	});

	it("exports only the matching rows when a search is active", async () => {
		const user = userEvent.setup();
		vi.mocked(downloadCSV).mockClear();
		vi.setSystemTime(new Date("2026-07-25T12:00:00Z"));

		render(<ConsolidationTable registrations={mockRegistrations} />);
		await user.type(screen.getByLabelText(/Buscar/i), "ana@example.com");
		await user.click(screen.getByRole("button", { name: /Descargar CSV/i }));

		const [, , rows] = vi.mocked(downloadCSV).mock.calls[0];
		expect(rows).toHaveLength(1);
		expect(rows[0][1]).toBe("Ana");

		vi.useRealTimers();
	});

	it("hides the pagination controls when everything fits on one page", () => {
		render(<ConsolidationTable registrations={mockRegistrations} />);

		expect(
			screen.queryByRole("button", { name: "Página siguiente" }),
		).not.toBeInTheDocument();
		expect(screen.queryByText(/Mostrando/)).not.toBeInTheDocument();
	});

	it("paginates at 20 rows and moves between pages", async () => {
		const user = userEvent.setup();
		render(<ConsolidationTable registrations={manyRegistrations} />);

		expect(bodyRowNames()).toHaveLength(20);
		expect(screen.getByText(/Mostrando 1–20 de 25/)).toBeInTheDocument();
		expect(screen.getByText("1 / 2")).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "Página siguiente" }));

		expect(bodyRowNames()).toHaveLength(5);
		expect(screen.getByText(/Mostrando 21–25 de 25/)).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "Página anterior" }));

		expect(bodyRowNames()).toHaveLength(20);
		expect(screen.getByText(/Mostrando 1–20 de 25/)).toBeInTheDocument();
	});

	it("sorts across the whole result set, not just the visible page", async () => {
		const user = userEvent.setup();
		render(<ConsolidationTable registrations={manyRegistrations} />);

		// Default sort is created_at desc, so the newest (Nombre25) leads.
		expect(bodyRowNames()[0]).toBe("Nombre25");

		await user.click(screen.getByRole("button", { name: /Nombre/i }));

		// Ascending by nombre: page 1 starts at the global minimum, and the row
		// that was first under the previous sort has moved to the last page.
		expect(bodyRowNames()[0]).toBe("Nombre01");
		expect(bodyRowNames()).not.toContain("Nombre25");

		await user.click(screen.getByRole("button", { name: "Página siguiente" }));
		expect(bodyRowNames()).toEqual([
			"Nombre21",
			"Nombre22",
			"Nombre23",
			"Nombre24",
			"Nombre25",
		]);
	});

	it("keeps the search filter applied across pages", async () => {
		const user = userEvent.setup();
		render(<ConsolidationTable registrations={manyRegistrations} />);

		await user.type(screen.getByLabelText(/Buscar/i), "Nombre1");

		// Nombre1 matches Nombre10–Nombre19 only — one page, so no controls.
		expect(bodyRowNames()).toHaveLength(10);
		expect(
			screen.queryByRole("button", { name: "Página siguiente" }),
		).not.toBeInTheDocument();
	});

	it("renders sortable headers for the sortable columns", () => {
		render(<ConsolidationTable registrations={mockRegistrations} />);
		for (const label of [
			/Nombre/i,
			/Apellido/i,
			/Email/i,
			/Celular/i,
			/Conectar/i,
			/Fecha/i,
		]) {
			expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
		}
	});
});
