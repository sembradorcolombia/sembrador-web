import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { EventWithSubscriptions } from "@/lib/services/dashboard";
import { EventCard } from "../EventCard";

const queryClient = new QueryClient({
	defaultOptions: { queries: { retry: false } },
});

function renderWithProviders(ui: React.ReactElement) {
	return render(
		<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
	);
}

const mockEvent: EventWithSubscriptions = {
	id: "evt-1",
	name: "Evento Prueba",
	maxCapacity: 200,
	currentCount: 50,
	subscriptions: [
		{
			id: "sub-1",
			name: "Test User",
			email: "real@example.com",
			phone: "3001234567",
			event_id: "evt-1",
			accepts_data_policy: true,
			created_at: "2025-01-01T00:00:00Z",
			confirmed_at: null,
			confirmation_token: "token-1",
			attended: false,
		},
	],
};

describe("EventCard", () => {
	it("renders event name and subscriber info", () => {
		renderWithProviders(<EventCard event={mockEvent} />);
		expect(screen.getByText("Evento Prueba")).toBeInTheDocument();
		expect(screen.getByText("50 / 200 inscritos (25%)")).toBeInTheDocument();
		expect(screen.getByText("0 confirmados")).toBeInTheDocument();
		expect(screen.getByText("0 asistieron")).toBeInTheDocument();
	});

	it("renders correct confirmed and attended counts", () => {
		const eventWithConfirmed: EventWithSubscriptions = {
			...mockEvent,
			subscriptions: [
				{
					...mockEvent.subscriptions[0],
					confirmed_at: "2025-01-02T00:00:00Z",
					attended: true,
				},
				{
					...mockEvent.subscriptions[0],
					id: "sub-2",
					confirmed_at: "2025-01-03T00:00:00Z",
					attended: false,
				},
			],
		};
		renderWithProviders(<EventCard event={eventWithConfirmed} />);
		expect(screen.getByText("2 confirmados")).toBeInTheDocument();
		expect(screen.getByText("1 asistieron")).toBeInTheDocument();
	});

	it("renders progress bar with correct width", () => {
		const { container } = renderWithProviders(<EventCard event={mockEvent} />);
		const progressBar = container.querySelector(
			".bg-emerald-600",
		) as HTMLElement;
		expect(progressBar.style.width).toBe("25%");
	});

	it("toggles subscriber table on button click", async () => {
		const user = userEvent.setup();
		renderWithProviders(<EventCard event={mockEvent} />);

		// Initially expanded (default state)
		expect(screen.getByText("real@example.com")).toBeInTheDocument();

		// Collapse
		await user.click(screen.getByText(/Ocultar/));
		expect(screen.queryByText("real@example.com")).not.toBeInTheDocument();

		// Expand again
		await user.click(screen.getByText(/Ver/));
		expect(screen.getByText("real@example.com")).toBeInTheDocument();
	});
});
