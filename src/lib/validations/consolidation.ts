import { z } from "zod";
import { emailSchema } from "./email";

export const CONNECT_OPTIONS = [
	"Comunidades misionales",
	"Discipulado 1:1",
	"Consejería",
] as const;

export type ConnectOption = (typeof CONNECT_OPTIONS)[number];

export const consolidationFormSchema = z.object({
	name: z
		.string()
		.min(2, "El nombre debe tener al menos 2 caracteres")
		.max(100, "El nombre no puede tener más de 100 caracteres"),
	lastname: z
		.string()
		.min(2, "El apellido debe tener al menos 2 caracteres")
		.max(100, "El apellido no puede tener más de 100 caracteres"),
	mobile: z.string().regex(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos"),
	email: emailSchema,
	nextStep: z.enum(CONNECT_OPTIONS, {
		message: "Debes seleccionar una opción",
	}),
	comment: z
		.string()
		.max(500, "El comentario no puede tener más de 500 caracteres")
		.optional(),
	acceptsDataPolicy: z.literal(true, {
		message: "Debes aceptar la política de tratamiento de datos",
	}),
});

export type ConsolidationFormData = z.infer<typeof consolidationFormSchema>;
