import { z } from "zod";
import { emailSchema } from "./email";

export const subscriptionFormSchema = z.object({
	name: z
		.string()
		.min(2, "El nombre debe tener al menos 2 caracteres")
		.max(100, "El nombre no puede tener más de 100 caracteres"),
	email: emailSchema,
	phone: z.string().regex(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos"),
	eventId: z.string().min(1, "Debes seleccionar un evento"),
	acceptsDataPolicy: z.literal(true, {
		message: "Debes aceptar la política de tratamiento de datos",
	}),
});

export type SubscriptionFormData = z.infer<typeof subscriptionFormSchema>;
