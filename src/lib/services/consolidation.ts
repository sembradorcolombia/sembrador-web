import { supabase } from "../supabase";
import type { ConsolidationFormData } from "../validations/consolidation";

export async function createConsolidationRegistration(
	formData: ConsolidationFormData,
): Promise<void> {
	const { error } = await supabase.rpc("create_consolidation_registration", {
		p_name: formData.name,
		p_lastname: formData.lastname,
		p_mobile: formData.mobile,
		p_email: formData.email,
		p_next_step: formData.nextStep,
		p_comment: formData.comment || undefined,
		p_accepts_data_policy: Boolean(formData.acceptsDataPolicy),
	});

	if (error) {
		if (import.meta.env.DEV) {
			console.error("Consolidation registration error:", error);
		}
		throw new Error("Ocurrió un error inesperado. Intenta de nuevo más tarde.");
	}
}
