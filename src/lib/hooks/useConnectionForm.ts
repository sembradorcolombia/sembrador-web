import { useMutation } from "@tanstack/react-query";
import {
	fetchSubscriptionByEmail,
	saveConnectionResponse,
} from "../services/events";
import type { ConnectionData } from "../validations/connection";

export function useSubscriptionByEmail() {
	return useMutation({
		mutationFn: (email: string) => fetchSubscriptionByEmail(email),
	});
}

export function useSaveConnectionData() {
	return useMutation({
		mutationFn: ({
			subscriptionId,
			data,
		}: {
			subscriptionId: string;
			data: ConnectionData;
		}) =>
			saveConnectionResponse(
				subscriptionId,
				data.wantToConnect,
				data.prayerRequest,
			),
	});
}
