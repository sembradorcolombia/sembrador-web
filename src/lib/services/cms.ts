import { sanityClient } from "../sanity";
import type {
	CmsBlogPost,
	CmsBlogPostSummary,
	CmsEventSeries,
	CmsEventSeriesWithEvents,
	CmsGivingOption,
	CmsNextStep,
	CmsSiteSettings,
} from "../types/cms";

// ── Blog Posts ───────────────────────────────────────────────────────────────

const BLOG_POST_SUMMARY_PROJECTION = `{
	_id,
	title,
	slug,
	publishedAt,
	category,
	excerpt,
	featuredImage,
	author->{ name, image }
}`;

const BLOG_POST_FULL_PROJECTION = `{
	_id,
	title,
	slug,
	publishedAt,
	category,
	excerpt,
	body,
	featuredImage,
	author->{ _id, name, image, bio, role },
	scriptureReferences,
	audioUrl,
	videoUrl
}`;

export async function fetchBlogPosts(): Promise<CmsBlogPostSummary[]> {
	return sanityClient.fetch(
		`*[_type == "blogPost"] | order(publishedAt desc) ${BLOG_POST_SUMMARY_PROJECTION}`,
	);
}

export async function fetchBlogPostBySlug(
	slug: string,
): Promise<CmsBlogPost | null> {
	return sanityClient.fetch(
		`*[_type == "blogPost" && slug.current == $slug][0] ${BLOG_POST_FULL_PROJECTION}`,
		{ slug },
	);
}

export async function fetchBlogPostsByCategory(
	category: string,
): Promise<CmsBlogPostSummary[]> {
	return sanityClient.fetch(
		`*[_type == "blogPost" && category == $category] | order(publishedAt desc) ${BLOG_POST_SUMMARY_PROJECTION}`,
		{ category },
	);
}

// ── Event Series ─────────────────────────────────────────────────────────────

export async function fetchEventSeries(): Promise<CmsEventSeries[]> {
	return sanityClient.fetch(
		`*[_type == "eventSeries"] {
			_id,
			name,
			slug,
			description,
			logo,
			themeColor,
			isActive
		}`,
	);
}

export async function fetchEventSeriesBySlug(
	slug: string,
): Promise<CmsEventSeriesWithEvents | null> {
	return sanityClient.fetch(
		`*[_type == "eventSeries" && slug.current == $slug][0] {
			_id,
			name,
			slug,
			description,
			logo,
			themeColor,
			isActive,
			"events": *[_type == "event" && eventSeries._ref == ^._id] | order(date asc) {
				_id,
				name,
				slug,
				date,
				time,
				location,
				supabaseEventId,
				speaker->{ _id, name, image, bio, role },
				speakerImage,
				description,
				themeColor,
				status
			}
		}`,
		{ slug },
	);
}

export async function fetchEventsBySeries(
	seriesSlug: string,
): Promise<CmsEventSeriesWithEvents | null> {
	return fetchEventSeriesBySlug(seriesSlug);
}

// ── Next Steps ───────────────────────────────────────────────────────────────

export async function fetchNextSteps(): Promise<CmsNextStep[]> {
	return sanityClient.fetch(
		`*[_type == "nextStep"] | order(order asc) {
			_id,
			title,
			description,
			icon,
			ctaText,
			ctaLink,
			order
		}`,
	);
}

// ── Giving Options ───────────────────────────────────────────────────────────

export async function fetchGivingOptions(): Promise<CmsGivingOption[]> {
	return sanityClient.fetch(
		`*[_type == "givingOption"] | order(order asc) {
			_id,
			title,
			description,
			type,
			details,
			qrCodeImage,
			order
		}`,
	);
}

// ── Site Settings ────────────────────────────────────────────────────────────

export async function fetchSiteSettings(): Promise<CmsSiteSettings | null> {
	return sanityClient.fetch(
		`*[_type == "siteSettings"][0] {
			_id,
			churchName,
			tagline,
			heroImage,
			aboutDescription,
			aboutLocation,
			aboutServiceTimes,
			socialLinks
		}`,
	);
}
