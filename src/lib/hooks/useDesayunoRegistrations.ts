import { useQuery } from "@tanstack/react-query";
import { fetchDesayunoRegistrations } from "../services/desayuno";

export function useDesayunoRegistrations() {
	return useQuery({
		queryKey: ["dashboard", "desayuno-registrations"],
		queryFn: fetchDesayunoRegistrations,
	});
}
