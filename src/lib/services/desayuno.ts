import type { Tables } from "../database.types";
import { supabase } from "../supabase";
import type { DesayunoFormData } from "../validations/desayuno";

export type DesayunoRegistration = Tables<"desayuno_registrations">;

const PAGE_SIZE = 1000;

export async function fetchDesayunoRegistrations(): Promise<
	DesayunoRegistration[]
> {
	const all: DesayunoRegistration[] = [];
	let offset = 0;

	while (true) {
		const { data, error } = await supabase
			.from("desayuno_registrations")
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
