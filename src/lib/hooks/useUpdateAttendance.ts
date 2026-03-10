import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSubscriptionAttendance } from "../services/dashboard";

export function useUpdateAttendance() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			subscriptionId,
			attended,
		}: {
			subscriptionId: string;
			attended: boolean;
		}) => updateSubscriptionAttendance(subscriptionId, attended),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["dashboard", "events-with-subscriptions"],
			});
		},
	});
}
