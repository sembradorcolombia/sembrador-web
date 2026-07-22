import { useMutation } from "@tanstack/react-query";
import { createConsolidationRegistration } from "../services/consolidation";

export function useCreateConsolidationRegistration() {
	return useMutation({
		mutationFn: createConsolidationRegistration,
	});
}
