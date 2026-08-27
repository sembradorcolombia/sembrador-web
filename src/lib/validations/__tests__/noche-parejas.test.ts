import { describe, expect, it } from "vitest";
import { nocheParejasFormSchema } from "../noche-parejas";

const validData = {
	name: "Juan",
	lastname: "Pérez",
	email: "jorge@gmail.com",
	phone: "3001234567",
	withConyuge: true as const,
	conyugeName: "María",
	conyugeLastname: "Gómez",
	conyugeEmail: "maria@gmail.com",
	conyugePhone: "3007654321",
	relationship: "Casados" as const,
	acceptsDataPolicy: true as const,
};

describe("nocheParejasFormSchema", () => {
	it("accepts valid form data", () => {
		const result = nocheParejasFormSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	describe("withConyuge (optional spouse)", () => {
		it("accepts the form without spouse data when withConyuge is false", () => {
			const result = nocheParejasFormSchema.safeParse({
				name: "Juan",
				lastname: "Pérez",
				email: "jorge@gmail.com",
				phone: "3001234567",
				withConyuge: false,
				conyugeName: "",
				conyugeLastname: "",
				conyugeEmail: "",
				conyugePhone: "",
				relationship: "",
				acceptsDataPolicy: true,
			});
			expect(result.success).toBe(true);
		});

		it("requires spouse fields when withConyuge is true", () => {
			const result = nocheParejasFormSchema.safeParse({
				name: "Juan",
				lastname: "Pérez",
				email: "jorge@gmail.com",
				phone: "3001234567",
				withConyuge: true,
				conyugeName: "",
				conyugeLastname: "",
				conyugeEmail: "",
				conyugePhone: "",
				relationship: "",
				acceptsDataPolicy: true,
			});
			expect(result.success).toBe(false);
		});
	});

	describe("name", () => {
		it("rejects names shorter than 2 characters", () => {
			const result = nocheParejasFormSchema.safeParse({
				...validData,
				name: "J",
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0]?.message).toBe(
					"El nombre debe tener al menos 2 caracteres",
				);
			}
		});

		it("rejects names longer than 100 characters", () => {
			const result = nocheParejasFormSchema.safeParse({
				...validData,
				name: "a".repeat(101),
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0]?.message).toBe(
					"El nombre no puede tener más de 100 caracteres",
				);
			}
		});

		it("accepts names with 2+ characters", () => {
			const result = nocheParejasFormSchema.safeParse({
				...validData,
				name: "Jo",
			});
			expect(result.success).toBe(true);
		});
	});

	describe("lastname", () => {
		it("rejects lastnames shorter than 2 characters", () => {
			const result = nocheParejasFormSchema.safeParse({
				...validData,
				lastname: "P",
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0]?.message).toBe(
					"El apellido debe tener al menos 2 caracteres",
				);
			}
		});

		it("rejects lastnames longer than 100 characters", () => {
			const result = nocheParejasFormSchema.safeParse({
				...validData,
				lastname: "a".repeat(101),
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0]?.message).toBe(
					"El apellido no puede tener más de 100 caracteres",
				);
			}
		});
	});

	describe("email", () => {
		it("rejects invalid email format", () => {
			const result = nocheParejasFormSchema.safeParse({
				...validData,
				email: "not-an-email",
			});
			expect(result.success).toBe(false);
		});

		it.each(["mailinator.com", "yopmail.com", "guerrillamail.com"])(
			"rejects disposable domain %s",
			(domain) => {
				const result = nocheParejasFormSchema.safeParse({
					...validData,
					email: `user@${domain}`,
				});
				expect(result.success).toBe(false);
			},
		);

		it("accepts valid emails", () => {
			const result = nocheParejasFormSchema.safeParse({
				...validData,
				email: "jorge@gmail.com",
			});
			expect(result.success).toBe(true);
		});
	});

	describe("phone", () => {
		it.each(["123", "12345678901", "300abcdefg", ""])(
			"rejects invalid phone '%s'",
			(phone) => {
				const result = nocheParejasFormSchema.safeParse({
					...validData,
					phone,
				});
				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error.issues[0]?.message).toBe(
						"El teléfono debe tener 10 dígitos",
					);
				}
			},
		);

		it("accepts 10-digit numbers", () => {
			const result = nocheParejasFormSchema.safeParse({
				...validData,
				phone: "3001234567",
			});
			expect(result.success).toBe(true);
		});
	});

	describe("conyugeName", () => {
		it("rejects names shorter than 2 characters", () => {
			const result = nocheParejasFormSchema.safeParse({
				...validData,
				conyugeName: "M",
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0]?.message).toBe(
					"El nombre debe tener al menos 2 caracteres",
				);
			}
		});

		it("rejects names longer than 100 characters", () => {
			const result = nocheParejasFormSchema.safeParse({
				...validData,
				conyugeName: "a".repeat(101),
			});
			expect(result.success).toBe(false);
		});
	});

	describe("conyugeLastname", () => {
		it("rejects lastnames shorter than 2 characters", () => {
			const result = nocheParejasFormSchema.safeParse({
				...validData,
				conyugeLastname: "G",
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0]?.message).toBe(
					"El apellido debe tener al menos 2 caracteres",
				);
			}
		});
	});

	describe("conyugeEmail", () => {
		it("rejects invalid email format", () => {
			const result = nocheParejasFormSchema.safeParse({
				...validData,
				conyugeEmail: "not-an-email",
			});
			expect(result.success).toBe(false);
		});

		it("rejects disposable domains", () => {
			const result = nocheParejasFormSchema.safeParse({
				...validData,
				conyugeEmail: "user@mailinator.com",
			});
			expect(result.success).toBe(false);
		});

		it("accepts valid emails", () => {
			const result = nocheParejasFormSchema.safeParse({
				...validData,
				conyugeEmail: "maria@gmail.com",
			});
			expect(result.success).toBe(true);
		});
	});

	describe("conyugePhone", () => {
		it.each(["123", "12345678901", "300abcdefg", ""])(
			"rejects invalid phone '%s'",
			(phone) => {
				const result = nocheParejasFormSchema.safeParse({
					...validData,
					conyugePhone: phone,
				});
				expect(result.success).toBe(false);
				if (!result.success) {
					expect(result.error.issues[0]?.message).toBe(
						"El teléfono debe tener 10 dígitos",
					);
				}
			},
		);

		it("accepts 10-digit numbers", () => {
			const result = nocheParejasFormSchema.safeParse({
				...validData,
				conyugePhone: "3007654321",
			});
			expect(result.success).toBe(true);
		});
	});

	describe("relationship", () => {
		it("rejects an empty relationship", () => {
			const result = nocheParejasFormSchema.safeParse({
				...validData,
				relationship: "",
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0]?.message).toBe(
					"Debes seleccionar una opción",
				);
			}
		});

		it("rejects a value outside the allowed options", () => {
			const result = nocheParejasFormSchema.safeParse({
				...validData,
				relationship: "Amigos",
			});
			expect(result.success).toBe(false);
		});

		it.each(["Casados", "Novios", "Comprometidos", "Unión libre"])(
			"accepts %s",
			(relationship) => {
				const result = nocheParejasFormSchema.safeParse({
					...validData,
					relationship,
				});
				expect(result.success).toBe(true);
			},
		);
	});

	describe("acceptsDataPolicy", () => {
		it("rejects false", () => {
			const result = nocheParejasFormSchema.safeParse({
				...validData,
				acceptsDataPolicy: false,
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0]?.message).toBe(
					"Debes aceptar la política de tratamiento de datos",
				);
			}
		});

		it("accepts true", () => {
			const result = nocheParejasFormSchema.safeParse({
				...validData,
				acceptsDataPolicy: true,
			});
			expect(result.success).toBe(true);
		});
	});
});
