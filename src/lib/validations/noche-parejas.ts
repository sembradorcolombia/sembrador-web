import { z } from "zod";
import { emailSchema } from "./email";

export const RELATIONSHIP_OPTIONS = [
	"Casados",
	"Novios",
	"Comprometidos",
	"Unión libre",
] as const;

export type RelationshipOption = (typeof RELATIONSHIP_OPTIONS)[number];

// Reusable field schemas so the form can validate individual fields (including
// the conditionally-required cónyuge fields) and the full-form schema can reuse
// the exact same rules.
export const nameFieldSchema = z
	.string()
	.min(2, "El nombre debe tener al menos 2 caracteres")
	.max(100, "El nombre no puede tener más de 100 caracteres");

export const lastnameFieldSchema = z
	.string()
	.min(2, "El apellido debe tener al menos 2 caracteres")
	.max(100, "El apellido no puede tener más de 100 caracteres");

export const phoneFieldSchema = z
	.string()
	.regex(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos");

export const relationshipFieldSchema = z.enum(RELATIONSHIP_OPTIONS, {
	message: "Debes seleccionar una opción",
});

export const nocheParejasFormSchema = z
	.object({
		name: nameFieldSchema,
		lastname: lastnameFieldSchema,
		email: emailSchema,
		phone: phoneFieldSchema,
		withConyuge: z.boolean(),
		conyugeName: z.string(),
		conyugeLastname: z.string(),
		conyugeEmail: z.string(),
		conyugePhone: z.string(),
		relationship: z.string(),
		acceptsDataPolicy: z.literal(true, {
			message: "Debes aceptar la política de tratamiento de datos",
		}),
	})
	.superRefine((data, ctx) => {
		if (!data.withConyuge) return;

		const checks: [keyof typeof data, z.ZodTypeAny][] = [
			["conyugeName", nameFieldSchema],
			["conyugeLastname", lastnameFieldSchema],
			["conyugeEmail", emailSchema],
			["conyugePhone", phoneFieldSchema],
			["relationship", relationshipFieldSchema],
		];

		for (const [key, schema] of checks) {
			const result = schema.safeParse(data[key]);
			if (!result.success) {
				ctx.addIssue({
					code: "custom",
					path: [key],
					message: result.error.issues[0]?.message ?? "Campo inválido",
				});
			}
		}
	});

export type NocheParejasFormData = z.infer<typeof nocheParejasFormSchema>;
