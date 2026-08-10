import { beforeEach, describe, expect, it, vi } from "vitest";

const rpc = vi.fn();

vi.mock("@/lib/supabase", () => ({
	supabase: {
		rpc: (...args: unknown[]) => rpc(...args),
	},
}));

import { createDesayunoRegistration } from "../desayuno";

const validFormData = {
	name: "Juan",
	lastname: "Pérez",
	email: "jorge@gmail.com",
	phone: "3001234567",
	acceptsDataPolicy: true as const,
};

beforeEach(() => {
	rpc.mockReset();
});

describe("createDesayunoRegistration", () => {
	it("calls the RPC with mapped form fields", async () => {
		rpc.mockResolvedValueOnce({ data: null, error: null });

		await createDesayunoRegistration(validFormData);

		expect(rpc).toHaveBeenCalledWith("create_desayuno_registration", {
			p_name: "Juan",
			p_lastname: "Pérez",
			p_email: "jorge@gmail.com",
			p_phone: "3001234567",
			p_accepts_data_policy: true,
		});
	});

	it("throws a user-facing error when the RPC fails", async () => {
		rpc.mockResolvedValueOnce({
			data: null,
			error: { message: "permission denied" },
		});

		await expect(createDesayunoRegistration(validFormData)).rejects.toThrow(
			"Ocurrió un error inesperado. Intenta de nuevo más tarde.",
		);
	});
});
