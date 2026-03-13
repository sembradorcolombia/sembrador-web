import { z } from "zod";

export const connectionEmailSchema = z.object({
	email: z.string().email("Correo electrónico inválido"),
});

export type ConnectionEmailData = z.infer<typeof connectionEmailSchema>;

export const INTEREST_TOPICS = [
	"Emprendimiento / Finanzas",
	"Vida familiar / Crianza",
	"Desarrollo personal y espiritual / Emociones",
] as const;

export type InterestTopic = (typeof INTEREST_TOPICS)[number];
