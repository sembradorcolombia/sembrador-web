import { sanityClient } from "../sanity";
import type {
	CmsAboutPage,
	CmsBlogPost,
	CmsBlogPostSummary,
	CmsConnectStep,
	CmsEventSeries,
	CmsEventSeriesWithEvents,
	CmsGivingOption,
	CmsHero,
	CmsLeader,
	CmsSiteSettings,
	HeroKey,
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
	author->{ _id, name, image, bio, roles },
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
				speaker->{ _id, name, image, bio, roles },
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

// ── Connect Steps ────────────────────────────────────────────────────────────

export async function fetchConnectSteps(): Promise<CmsConnectStep[]> {
	return sanityClient.fetch(
		`*[_type == "connectStep"] | order(order asc) {
			_id,
			title,
			description,
			icon,
			ctaText,
			ctaLink,
			consolidationStep,
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

// ── Heroes ───────────────────────────────────────────────────────────────────

/**
 * Uniqueness per key is only a Studio validation rule, so a duplicate is
 * possible in the dataset. Taking `[0]` makes the first one win instead of
 * failing.
 */
export async function fetchHeroByKey(key: HeroKey): Promise<CmsHero | null> {
	return sanityClient.fetch(
		`*[_type == "hero" && key == $key][0] {
			_id,
			key,
			heading,
			backgroundImage,
			leadText,
			cta
		}`,
		{ key },
	);
}

// ── About Page ───────────────────────────────────────────────────────────────

export async function fetchAboutPage(): Promise<CmsAboutPage | null> {
	return sanityClient.fetch(
		`*[_type == "aboutPage"][0] {
			_id,
			description,
			vision,
			mission,
			coreValues[]{ title, description },
			coreBeliefs[]{ title, description },
			documents[]{ title, description, "fileUrl": file.asset->url }
		}`,
	);
}

// ── Leadership ───────────────────────────────────────────────────────────────

/**
 * Filters on the `leader` role rather than the presence of `leadershipTitle`,
 * which persists in the dataset for authors that lost the role.
 */
export async function fetchLeadership(): Promise<CmsLeader[]> {
	return sanityClient.fetch(
		`*[_type == "author" && "leader" in roles]
			| order(coalesce(leadershipOrder, 9999) asc, name asc) {
			_id,
			name,
			image,
			leadershipTitle,
			leadershipOrder
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
			aboutLocation,
			aboutServiceTimes,
			footerTagline,
			address,
			googleMapsUrl,
			contactPhone,
			contactEmail,
			socialLinks
		}`,
	);
}
