import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { NocheParejasForm } from "../NocheParejasForm";

const mutateAsync = vi.fn();
const navigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
	Link: ({ children, ...props }: { children: React.ReactNode }) => (
		<a {...props}>{children}</a>
	),
	useNavigate: () => navigate,
}));

vi.mock("@/lib/hooks/useCreateSubscription", () => ({
	useCreateSubscription: () => ({
		mutateAsync,
		isPending: false,
	}),
}));

vi.mock("@/lib/hooks/useNocheParejasEvent", () => ({
	useNocheParejasEvent: () => ({
		eventId: "event-noche-parejas",
		isLoading: false,
		isError: false,
	}),
}));

const queryClient = new QueryClient({
	defaultOptions: { queries: { retry: false } },
});

function renderWithProviders(ui: React.ReactElement) {
	return render(
		<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
	);
}

describe("NocheParejasForm", () => {
	beforeEach(() => {
		mutateAsync.mockReset();
		navigate.mockReset();
	});
	it("renders all form fields", () => {
		renderWithProviders(<NocheParejasForm />);

		expect(screen.getByLabelText(/^nombre:/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/^apellido:/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
		expect(
			screen.getByRole("checkbox", {
				name: /autorizo el tratamiento de mis datos personales/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /registrarse/i }),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				/\* Solo es necesario que se registre uno de los conyuges/i,
			),
		).toBeInTheDocument();
	});

	it("concatenates nombres and apellidos and submits createSubscription with the resolved event id", async () => {
		const user = userEvent.setup();
		(mutateAsync as Mock).mockResolvedValueOnce(undefined);

		renderWithProviders(<NocheParejasForm />);

		await user.type(screen.getByLabelText(/^nombre:/i), "Juan Carlos");
		await user.type(screen.getByLabelText(/^apellido:/i), "Pérez");
		await user.type(screen.getByLabelText(/email/i), "juan@example.com");
		await user.type(screen.getByLabelText(/teléfono/i), "3001234567");
		await user.click(
			screen.getByRole("checkbox", {
				name: /autorizo el tratamiento de mis datos personales/i,
			}),
		);

		await user.click(screen.getByRole("button", { name: /registrarse/i }));

		await waitFor(() => {
			expect(mutateAsync).toHaveBeenCalledWith({
				name: "Juan Carlos Pérez",
				email: "juan@example.com",
				phone: "3001234567",
				eventId: "event-noche-parejas",
				acceptsDataPolicy: true,
			});
		});

		await waitFor(() => {
			expect(navigate).toHaveBeenCalledWith({
				to: "/noche-parejas/registro-exitoso",
			});
		});
	});

	it("does not submit and shows errors for invalid fields", async () => {
		const user = userEvent.setup();
		renderWithProviders(<NocheParejasForm />);

		await user.click(screen.getByRole("button", { name: /registrarse/i }));

		await waitFor(() => {
			expect(mutateAsync).not.toHaveBeenCalled();
		});

		expect(
			screen.getByText("Debes aceptar la política de tratamiento de datos"),
		).toBeInTheDocument();
	});
});
