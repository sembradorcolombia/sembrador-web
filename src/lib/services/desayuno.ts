import { supabase } from "../supabase";
import type { DesayunoFormData } from "../validations/desayuno";

export async function createDesayunoRegistration(
	formData: DesayunoFormData,
): Promise<void> {
	const { error } = await supabase.rpc("create_desayuno_registration", {
		p_name: formData.name,
		p_lastname: formData.lastname,
		p_email: formData.email,
		p_phone: formData.phone,
		p_accepts_data_policy: Boolean(formData.acceptsDataPolicy),
	});

	if (error) {
		if (import.meta.env.DEV) {
			console.error("Desayuno registration error:", error);
		}
		throw new Error("Ocurrió un error inesperado. Intenta de nuevo más tarde.");
	}
}
