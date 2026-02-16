import { describe, expect, it } from "vitest";
import { subscriptionFormSchema } from "../subscription";

const validData = {
	name: "Juan Pérez",
	email: "jorge@gmail.com",
	phone: "3001234567",
	eventId: "some-event-id",
	acceptsDataPolicy: true as const,
};

describe("subscriptionFormSchema", () => {
	it("accepts valid form data", () => {
		const result = subscriptionFormSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	describe("name", () => {
		it("rejects names shorter than 2 characters", () => {
			const result = subscriptionFormSchema.safeParse({
				...validData,
				name: "J",
			});
			expect(result.success).toBe(false);
		});

		it("accepts names with 2+ characters", () => {
			const result = subscriptionFormSchema.safeParse({
				...validData,
				name: "Jo",
			});
			expect(result.success).toBe(true);
		});
	});

	describe("email", () => {
		it("rejects invalid email format", () => {
			const result = subscriptionFormSchema.safeParse({
				...validData,
				email: "not-an-email",
			});
			expect(result.success).toBe(false);
		});

		it.each(["mailinator.com", "yopmail.com", "guerrillamail.com"])(
			"rejects disposable domain %s",
			(domain) => {
				const result = subscriptionFormSchema.safeParse({
					...validData,
					email: `user@${domain}`,
				});
				expect(result.success).toBe(false);
			},
		);

		it.each(["test", "foo", "prueba", "admin", "demo", "asdf"])(
			"rejects test local part '%s'",
			(localPart) => {
				const result = subscriptionFormSchema.safeParse({
					...validData,
					email: `${localPart}@gmail.com`,
				});
				expect(result.success).toBe(false);
			},
		);

		it.each(["aaa@gmail.com", "xx@gmail.com", "bbbb@gmail.com"])(
			"rejects repeated char pattern in %s",
			(email) => {
				const result = subscriptionFormSchema.safeParse({
					...validData,
					email,
				});
				expect(result.success).toBe(false);
			},
		);

		it("accepts valid emails", () => {
			const result = subscriptionFormSchema.safeParse({
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
				const result = subscriptionFormSchema.safeParse({
					...validData,
					phone,
				});
				expect(result.success).toBe(false);
			},
		);

		it("accepts 10-digit numbers", () => {
			const result = subscriptionFormSchema.safeParse({
				...validData,
				phone: "3001234567",
			});
			expect(result.success).toBe(true);
		});
	});

	describe("eventId", () => {
		it("rejects empty string", () => {
			const result = subscriptionFormSchema.safeParse({
				...validData,
				eventId: "",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("acceptsDataPolicy", () => {
		it("rejects false", () => {
			const result = subscriptionFormSchema.safeParse({
				...validData,
				acceptsDataPolicy: false,
			});
			expect(result.success).toBe(false);
		});

		it("accepts true", () => {
			const result = subscriptionFormSchema.safeParse({
				...validData,
				acceptsDataPolicy: true,
			});
			expect(result.success).toBe(true);
		});
	});
});
