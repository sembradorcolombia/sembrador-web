import { useQuery } from "@tanstack/react-query";
import {
	fetchBlogPostBySlug,
	fetchBlogPosts,
	fetchBlogPostsByCategory,
} from "../services/cms";

const CMS_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export function useBlogPosts() {
	return useQuery({
		queryKey: ["cms", "blogPosts"],
		queryFn: fetchBlogPosts,
		staleTime: CMS_STALE_TIME,
	});
}

export function useBlogPost(slug: string) {
	return useQuery({
		queryKey: ["cms", "blogPost", slug],
		queryFn: () => fetchBlogPostBySlug(slug),
		staleTime: CMS_STALE_TIME,
		enabled: !!slug,
	});
}

export function useBlogPostsByCategory(category: string | undefined) {
	return useQuery({
		queryKey: ["cms", "blogPosts", "category", category],
		queryFn: () => fetchBlogPostsByCategory(category as string),
		staleTime: CMS_STALE_TIME,
		enabled: !!category,
	});
}
