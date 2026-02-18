import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	confirmAttendanceByToken,
	fetchSubscriptionsByToken,
} from "../services/events";

export function useSubscriptionsByToken(token: string | undefined) {
	return useQuery({
		queryKey: ["subscriptions-by-token", token],
		queryFn: () => fetchSubscriptionsByToken(token!),
		enabled: !!token,
	});
}

export function useConfirmAttendance() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ token, eventIds }: { token: string; eventIds: string[] }) =>
			confirmAttendanceByToken(token, eventIds),
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["subscriptions-by-token", variables.token],
			});
		},
	});
}
