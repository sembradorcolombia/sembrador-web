import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NocheParejasForm } from "../NocheParejasForm";

const registerMutateAsync = vi.fn();
const navigate = vi.fn();
const toastWarning = vi.fn();
const toastError = vi.fn();

vi.mock("@tanstack/react-router", () => ({
	Link: ({ children, ...props }: { children: React.ReactNode }) => (
		<a {...props}>{children}</a>
	),
	useNavigate: () => navigate,
}));

vi.mock("sonner", () => ({
	toast: {
		warning: (...args: unknown[]) => toastWarning(...args),
		error: (...args: unknown[]) => toastError(...args),
	},
}));

vi.mock("@/lib/hooks/useCreateNocheParejasRegistration", () => ({
	useCreateNocheParejasRegistration: () => ({
		mutateAsync: registerMutateAsync,
		isPending: false,
	}),
}));

vi.mock("@/lib/hooks/useNocheParejasEvent", () => ({
	useNocheParejasEvent: () => ({
		eventId: "event-1",
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

async function fillRegistrant(user: ReturnType<typeof userEvent.setup>) {
	await user.type(screen.getByLabelText(/^nombre:/i), "Juan Carlos");
	await user.type(screen.getByLabelText(/^apellido:/i), "Pérez");
	await user.type(screen.getByLabelText(/^email:/i), "juan@example.com");
	await user.type(screen.getByLabelText(/^teléfono:/i), "3001234567");
}

async function acceptDataPolicy(user: ReturnType<typeof userEvent.setup>) {
	await user.click(
		screen.getByRole("checkbox", {
			name: /autorizo el tratamiento de mis datos personales/i,
		}),
	);
}

async function enableConyuge(user: ReturnType<typeof userEvent.setup>) {
	await user.click(
		screen.getByRole("checkbox", {
			name: /registrar también a mi cónyuge/i,
		}),
	);
}

async function fillConyuge(user: ReturnType<typeof userEvent.setup>) {
	await user.type(
		screen.getByLabelText(/nombre del cónyuge/i),
		"María Fernanda",
	);
	await user.type(screen.getByLabelText(/apellido del cónyuge/i), "Gómez");
	await user.type(
		screen.getByLabelText(/email del cónyuge/i),
		"maria@example.com",
	);
	await user.type(screen.getByLabelText(/teléfono del cónyuge/i), "3007654321");
	await user.selectOptions(screen.getByLabelText(/relación/i), "Casados");
}

describe("NocheParejasForm", () => {
	beforeEach(() => {
		registerMutateAsync.mockReset();
		navigate.mockReset();
		toastWarning.mockReset();
		toastError.mockReset();
	});

	it("renders the registrant fields and the optional cónyuge checkbox", () => {
		renderWithProviders(<NocheParejasForm />);

		expect(screen.getByLabelText(/^nombre:/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/^apellido:/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/^email:/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/^teléfono:/i)).toBeInTheDocument();
		expect(
			screen.getByRole("checkbox", {
				name: /registrar también a mi cónyuge/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /registrarse/i }),
		).toBeInTheDocument();
	});

	it("hides cónyuge fields until the checkbox is checked, then reveals them", async () => {
		const user = userEvent.setup();
		renderWithProviders(<NocheParejasForm />);

		expect(screen.queryByLabelText(/nombre del cónyuge/i)).toBeNull();

		await enableConyuge(user);

		expect(screen.getByLabelText(/nombre del cónyuge/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/apellido del cónyuge/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/email del cónyuge/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/teléfono del cónyuge/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/relación/i)).toBeInTheDocument();
	});

	it("registers a single person (no cónyuge) and navigates on success", async () => {
		const user = userEvent.setup();
		registerMutateAsync.mockResolvedValueOnce({
			conyugeAlreadyRegistered: false,
		});

		renderWithProviders(<NocheParejasForm />);
		await fillRegistrant(user);
		await acceptDataPolicy(user);

		await user.click(screen.getByRole("button", { name: /registrarse/i }));

		await waitFor(() => {
			expect(registerMutateAsync).toHaveBeenCalledWith(
				expect.objectContaining({
					name: "Juan Carlos",
					lastname: "Pérez",
					email: "juan@example.com",
					phone: "3001234567",
					withConyuge: false,
					eventId: "event-1",
				}),
			);
		});

		await waitFor(() => {
			expect(navigate).toHaveBeenCalledWith({
				to: "/noche-parejas/registro-exitoso",
			});
		});
		expect(toastWarning).not.toHaveBeenCalled();
	});

	it("registers a couple and navigates on success", async () => {
		const user = userEvent.setup();
		registerMutateAsync.mockResolvedValueOnce({
			conyugeAlreadyRegistered: false,
		});

		renderWithProviders(<NocheParejasForm />);
		await fillRegistrant(user);
		await enableConyuge(user);
		await fillConyuge(user);
		await acceptDataPolicy(user);

		await user.click(screen.getByRole("button", { name: /registrarse/i }));

		await waitFor(() => {
			expect(registerMutateAsync).toHaveBeenCalledWith(
				expect.objectContaining({
					withConyuge: true,
					conyugeName: "María Fernanda",
					conyugeLastname: "Gómez",
					conyugeEmail: "maria@example.com",
					conyugePhone: "3007654321",
					relationship: "Casados",
					eventId: "event-1",
				}),
			);
		});

		await waitFor(() => {
			expect(navigate).toHaveBeenCalledWith({
				to: "/noche-parejas/registro-exitoso",
			});
		});
	});

	it("warns when the cónyuge was already registered but still navigates", async () => {
		const user = userEvent.setup();
		registerMutateAsync.mockResolvedValueOnce({
			conyugeAlreadyRegistered: true,
		});

		renderWithProviders(<NocheParejasForm />);
		await fillRegistrant(user);
		await enableConyuge(user);
		await fillConyuge(user);
		await acceptDataPolicy(user);

		await user.click(screen.getByRole("button", { name: /registrarse/i }));

		await waitFor(() => {
			expect(toastWarning).toHaveBeenCalledWith(
				expect.stringMatching(/cónyuge ya estaba inscrito/i),
			);
		});
		await waitFor(() => {
			expect(navigate).toHaveBeenCalledWith({
				to: "/noche-parejas/registro-exitoso",
			});
		});
	});

	it("does not submit and shows an error when the data policy is not accepted", async () => {
		const user = userEvent.setup();
		renderWithProviders(<NocheParejasForm />);
		await fillRegistrant(user);

		await user.click(screen.getByRole("button", { name: /registrarse/i }));

		await waitFor(() => {
			expect(
				screen.getByText("Debes aceptar la política de tratamiento de datos"),
			).toBeInTheDocument();
		});
		expect(registerMutateAsync).not.toHaveBeenCalled();
		expect(navigate).not.toHaveBeenCalled();
	});
});
