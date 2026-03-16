import { useMutation } from "@tanstack/react-query";
import {
	type FeedbackData,
	fetchAllSubscriptionsByEmail,
	saveFeedback,
} from "../services/events";

export function useLookupSubscriber() {
	return useMutation({
		mutationFn: (email: string) => fetchAllSubscriptionsByEmail(email),
	});
}

export function useSaveFeedback() {
	return useMutation({
		mutationFn: (data: FeedbackData) => saveFeedback(data),
	});
}
