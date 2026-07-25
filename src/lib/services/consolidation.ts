import type { Tables } from "../database.types";
import { supabase } from "../supabase";
import type { ConsolidationFormData } from "../validations/consolidation";

export type ConsolidationRegistration = Tables<"consolidation_registrations">;

const PAGE_SIZE = 1000;

export async function fetchConsolidationRegistrations(): Promise<
	ConsolidationRegistration[]
> {
	const all: ConsolidationRegistration[] = [];
	let offset = 0;

	while (true) {
		const { data, error } = await supabase
			.from("consolidation_registrations")
			.select("*")
			.order("created_at", { ascending: false })
			.range(offset, offset + PAGE_SIZE - 1);

		if (error) throw error;
		if (!data || data.length === 0) break;

		all.push(...data);
		if (data.length < PAGE_SIZE) break;
		offset += PAGE_SIZE;
	}

	return all;
}

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
