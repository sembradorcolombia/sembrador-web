import { z } from "zod";

export const subscriptionFormSchema = z.object({
	name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
	email: z.string().email("Correo electrónico inválido"),
	phone: z.string().regex(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos"),
	eventId: z.string().min(1, "Debes seleccionar un evento"),
	acceptsDataPolicy: z.literal(true, {
		message: "Debes aceptar la política de tratamiento de datos",
	}),
});

export type SubscriptionFormData = z.infer<typeof subscriptionFormSchema>;
