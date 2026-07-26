import { useQuery } from "@tanstack/react-query";
import { fetchHeroByKey } from "../services/cms";
import type { HeroKey } from "../types/cms";

const CMS_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export function useHero(key: HeroKey) {
	return useQuery({
		queryKey: ["cms", "hero", key],
		queryFn: () => fetchHeroByKey(key),
		staleTime: CMS_STALE_TIME,
	});
}
