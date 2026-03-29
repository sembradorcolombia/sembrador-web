import { createClient } from "@sanity/client";
import type { SanityImageSource } from "@sanity/image-url";
import imageUrlBuilder from "@sanity/image-url";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET;

if (!projectId || !dataset) {
	console.warn(
		"Missing Sanity environment variables (VITE_SANITY_PROJECT_ID, VITE_SANITY_DATASET). CMS features will be unavailable.",
	);
}

export const sanityClient = createClient({
	projectId: projectId || "",
	dataset: dataset || "production",
	useCdn: true,
	apiVersion: "2024-01-01",
});

const builder = imageUrlBuilder(sanityClient);

export function sanityImageUrl(source: SanityImageSource) {
	return builder.image(source);
}
