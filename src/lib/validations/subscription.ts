import { z } from "zod";

const DISPOSABLE_EMAIL_DOMAINS = [
	"mailinator.com",
	"guerrillamail.com",
	"guerrillamail.net",
	"guerrillamail.org",
	"tempmail.com",
	"temp-mail.org",
	"yopmail.com",
	"yopmail.fr",
	"throwaway.email",
	"sharklasers.com",
	"guerrillamailblock.com",
	"grr.la",
	"dispostable.com",
	"trashmail.com",
	"trashmail.net",
	"mailnesia.com",
	"maildrop.cc",
	"fakeinbox.com",
	"tempail.com",
	"tempr.email",
	"10minutemail.com",
	"mohmal.com",
	"burnermail.io",
	"getnada.com",
	"emailondeck.com",
	"mintemail.com",
	"mailcatch.com",
	"mytemp.email",
	"harakirimail.com",
	"jetable.org",
	"meltmail.com",
] as const;

const TEST_EMAIL_LOCAL_PARTS = [
	"test",
	"foo",
	"bar",
	"baz",
	"example",
	"admin",
	"user",
	"demo",
	"fake",
	"asdf",
	"qwerty",
	"prueba",
	"ejemplo",
	"none",
	"noreply",
	"no-reply",
	"nobody",
	"null",
	"undefined",
	"temp",
	"tmp",
] as const;

function hasRepeatedCharPattern(localPart: string): boolean {
	if (localPart.length <= 2 && /^(.)\1*$/.test(localPart)) {
		return true;
	}
	return /(.)\1{2,}/.test(localPart);
}

export const subscriptionFormSchema = z.object({
	name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
	email: z
		.string()
		.email("Correo electrónico inválido")
		.superRefine((val, ctx) => {
			const lowerVal = val.toLowerCase();
			const atIndex = lowerVal.lastIndexOf("@");
			if (atIndex === -1) return;

			const localPart = lowerVal.slice(0, atIndex);
			const domain = lowerVal.slice(atIndex + 1);

			if (
				(DISPOSABLE_EMAIL_DOMAINS as readonly string[]).includes(domain)
			) {
				ctx.addIssue({
					code: "custom",
					message:
						"No se permiten correos temporales o desechables. Usa tu correo personal.",
				});
				return;
			}

			if (
				(TEST_EMAIL_LOCAL_PARTS as readonly string[]).includes(localPart)
			) {
				ctx.addIssue({
					code: "custom",
					message: "Por favor ingresa tu correo electrónico real.",
				});
				return;
			}

			if (hasRepeatedCharPattern(localPart)) {
				ctx.addIssue({
					code: "custom",
					message:
						"El correo electrónico no parece válido. Verifica e intenta de nuevo.",
				});
				return;
			}
		}),
	phone: z.string().regex(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos"),
	eventId: z.string().min(1, "Debes seleccionar un evento"),
	acceptsDataPolicy: z.literal(true, {
		message: "Debes aceptar la política de tratamiento de datos",
	}),
});

export type SubscriptionFormData = z.infer<typeof subscriptionFormSchema>;
