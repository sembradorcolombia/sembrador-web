import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubscription } from "../services/events";

export function useCreateSubscription() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createSubscription,
		onSuccess: () => {
			// Invalidate events query to refetch updated counts
			queryClient.invalidateQueries({ queryKey: ["events"] });
		},
	});
}
