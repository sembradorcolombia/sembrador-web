import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { EventSubscription } from "@/lib/services/dashboard";
import { SubscribersTable } from "../SubscribersTable";

vi.mock("@/lib/csv", () => ({
	downloadCSV: vi.fn(),
}));

import { downloadCSV } from "@/lib/csv";

const mockSubscriptions: EventSubscription[] = [
	{
		id: "sub-1",
		name: "Ana García",
		email: "ana@example.com",
		phone: "3001111111",
		event_id: "evt-1",
		accepts_data_policy: true,
		created_at: "2025-06-15T10:00:00Z",
		confirmed_at: null,
		confirmation_token: "token-1",
	},
	{
		id: "sub-2",
		name: "Carlos López",
		email: "carlos@example.com",
		phone: "3002222222",
		event_id: "evt-1",
		accepts_data_policy: true,
		created_at: "2025-06-16T12:00:00Z",
		confirmed_at: null,
		confirmation_token: "token-2",
	},
];

describe("SubscribersTable", () => {
	it("shows empty message when there are no subscriptions", () => {
		render(<SubscribersTable subscriptions={[]} eventName="Evento Test" />);
		expect(screen.getByText("No hay inscritos aun.")).toBeInTheDocument();
	});

	it("does not show download button when there are no subscriptions", () => {
		render(<SubscribersTable subscriptions={[]} eventName="Evento Test" />);
		expect(screen.queryByText("Descargar CSV")).not.toBeInTheDocument();
	});

	it("renders subscriber rows with name and email", () => {
		render(
			<SubscribersTable
				subscriptions={mockSubscriptions}
				eventName="Evento Test"
			/>,
		);
		expect(screen.getByText("Ana García")).toBeInTheDocument();
		expect(screen.getByText("ana@example.com")).toBeInTheDocument();
		expect(screen.getByText("Carlos López")).toBeInTheDocument();
		expect(screen.getByText("carlos@example.com")).toBeInTheDocument();
	});

	it("shows download button when there are subscriptions", () => {
		render(
			<SubscribersTable
				subscriptions={mockSubscriptions}
				eventName="Evento Test"
			/>,
		);
		expect(
			screen.getByRole("button", { name: /Descargar CSV/i }),
		).toBeInTheDocument();
	});

	it("calls downloadCSV with correct arguments when button is clicked", async () => {
		const user = userEvent.setup();
		vi.setSystemTime(new Date("2026-02-16T12:00:00Z"));

		render(
			<SubscribersTable
				subscriptions={mockSubscriptions}
				eventName="Emociones y Liderazgo"
			/>,
		);

		await user.click(screen.getByRole("button", { name: /Descargar CSV/i }));

		expect(downloadCSV).toHaveBeenCalledWith(
			"emociones-y-liderazgo-inscritos-2026-02-16.csv",
			["#", "Nombre", "Email", "Teléfono", "Fecha", "Confirmado"],
			[
				[
					"1",
					"Ana García",
					"ana@example.com",
					"3001111111",
					new Date("2025-06-15T10:00:00Z").toLocaleDateString("es-CO"),
					"",
				],
				[
					"2",
					"Carlos López",
					"carlos@example.com",
					"3002222222",
					new Date("2025-06-16T12:00:00Z").toLocaleDateString("es-CO"),
					"",
				],
			],
		);

		vi.useRealTimers();
	});
});
