import { useMutation } from "@tanstack/react-query";
import { createDesayunoRegistration } from "../services/desayuno";

export function useCreateDesayunoRegistration() {
	return useMutation({
		mutationFn: createDesayunoRegistration,
	});
}
