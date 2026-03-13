import { useMutation } from "@tanstack/react-query";
import {
	fetchSubscriptionByEmail,
	fetchSubscriptionInterests,
	saveSubscriptionInterests,
} from "../services/events";

export function useSubscriptionByEmail() {
	return useMutation({
		mutationFn: async (email: string) => {
			const subscription = await fetchSubscriptionByEmail(email);
			if (!subscription) return null;
			const existingTopics = await fetchSubscriptionInterests(
				subscription.subscriptionId,
			);
			return { ...subscription, existingTopics };
		},
	});
}

export function useSaveInterests() {
	return useMutation({
		mutationFn: ({
			eventSubscriptionId,
			topics,
		}: {
			eventSubscriptionId: string;
			topics: string[];
		}) => saveSubscriptionInterests(eventSubscriptionId, topics),
	});
}
