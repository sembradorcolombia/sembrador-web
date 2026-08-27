import { supabase } from "../supabase";
import type { NocheParejasFormData } from "../validations/noche-parejas";

export interface NocheParejasRegistrationInput extends NocheParejasFormData {
	eventId: string;
}

export interface NocheParejasRegistrationResult {
	/** True when the cónyuge was already registered for the event. */
	conyugeAlreadyRegistered: boolean;
}

export async function createNocheParejasRegistration(
	input: NocheParejasRegistrationInput,
): Promise<NocheParejasRegistrationResult> {
	const { data, error } = await supabase.rpc(
		"create_noche_parejas_registration",
		{
			p_event_id: input.eventId,
			p_name: input.name,
			p_lastname: input.lastname,
			p_email: input.email,
			p_phone: input.phone,
			p_accepts_data_policy: Boolean(input.acceptsDataPolicy),
			p_with_conyuge: input.withConyuge,
			p_conyuge_name: input.withConyuge ? input.conyugeName : undefined,
			p_conyuge_lastname: input.withConyuge ? input.conyugeLastname : undefined,
			p_conyuge_email: input.withConyuge ? input.conyugeEmail : undefined,
			p_conyuge_phone: input.withConyuge ? input.conyugePhone : undefined,
			p_relationship: input.withConyuge ? input.relationship : undefined,
		},
	);

	if (error) {
		if (error.message.includes("capacity")) {
			throw new Error("Este evento ya alcanzó su capacidad máxima");
		}
		if (error.code === "23505") {
			throw new Error("Ya estás inscrito en este evento");
		}
		if (error.message.includes("conyuge_same_email")) {
			throw new Error("El correo del cónyuge no puede ser igual al tuyo");
		}
		if (import.meta.env.DEV) {
			console.error("Noche de Parejas registration error:", error);
		}
		throw new Error("Ocurrió un error inesperado. Intenta de nuevo más tarde.");
	}

	return { conyugeAlreadyRegistered: data === true };
}
