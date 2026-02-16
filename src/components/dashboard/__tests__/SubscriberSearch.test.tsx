import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { EventWithSubscriptions } from "@/lib/services/dashboard";
import { SubscriberSearch } from "../SubscriberSearch";

const mockData: EventWithSubscriptions[] = [
	{
		id: "evt-1",
		name: "Evento Alpha",
		maxCapacity: 100,
		currentCount: 2,
		subscriptions: [
			{
				id: "sub-1",
				name: "Jorge Ossa",
				email: "jorge@example.com",
				phone: "3001234567",
				event_id: "evt-1",
				accepts_data_policy: true,
				created_at: "2025-01-01T00:00:00Z",
			},
			{
				id: "sub-2",
				name: "Maria Lopez",
				email: "maria@test.co",
				phone: "3009876543",
				event_id: "evt-1",
				accepts_data_policy: true,
				created_at: "2025-01-02T00:00:00Z",
			},
		],
	},
];

describe("SubscriberSearch", () => {
	it("renders search input", () => {
		render(<SubscriberSearch data={mockData} />);
		expect(
			screen.getByPlaceholderText("Escribe un email..."),
		).toBeInTheDocument();
	});

	it("does not show results when query < 3 chars", async () => {
		const user = userEvent.setup();
		render(<SubscriberSearch data={mockData} />);

		await user.type(screen.getByPlaceholderText("Escribe un email..."), "jo");
		expect(screen.queryByText("jorge@example.com")).not.toBeInTheDocument();
	});

	it("filters subscriptions by email when query >= 3 chars", async () => {
		const user = userEvent.setup();
		render(<SubscriberSearch data={mockData} />);

		await user.type(screen.getByPlaceholderText("Escribe un email..."), "jor");
		expect(screen.getByText("jorge@example.com")).toBeInTheDocument();
		expect(screen.queryByText("maria@test.co")).not.toBeInTheDocument();
	});

	it("performs case-insensitive search", async () => {
		const user = userEvent.setup();
		render(<SubscriberSearch data={mockData} />);

		await user.type(
			screen.getByPlaceholderText("Escribe un email..."),
			"JORGE",
		);
		expect(screen.getByText("jorge@example.com")).toBeInTheDocument();
	});

	it("shows no results message when nothing matches", async () => {
		const user = userEvent.setup();
		render(<SubscriberSearch data={mockData} />);

		await user.type(screen.getByPlaceholderText("Escribe un email..."), "zzz");
		expect(
			screen.getByText("No se encontraron resultados"),
		).toBeInTheDocument();
	});
});
