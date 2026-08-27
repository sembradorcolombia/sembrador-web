import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNocheParejasRegistration } from "../services/nocheParejas";

export function useCreateNocheParejasRegistration() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createNocheParejasRegistration,
		onSuccess: () => {
			// Refresh event counts used by the landing/dashboard queries.
			queryClient.invalidateQueries({ queryKey: ["events"] });
		},
	});
}
