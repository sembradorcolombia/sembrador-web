import type { SanityImageSource } from "@sanity/image-url";

// ── Sanity-specific base types ──────────────────────────────────────────────

export interface SanitySlug {
	_type: "slug";
	current: string;
}

export interface SanityImage {
	_type: "image";
	asset: SanityImageSource;
	alt?: string;
	hotspot?: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
}

export interface SanityReference {
	_type: "reference";
	_ref: string;
}

/**
 * Portable Text block — simplified type covering the most common shapes.
 * For full rendering, use `@portabletext/react` which handles the complete spec.
 */
// biome-ignore lint/suspicious/noExplicitAny: Portable Text blocks have a complex recursive structure that varies by content
export type PortableTextBlock = Record<string, any>;

// ── CMS Content Types ───────────────────────────────────────────────────────

export interface CmsAuthor {
	_id: string;
	name: string;
	image: SanityImage;
	bio?: string;
	role?: string;
}

export interface CmsBlogPost {
	_id: string;
	title: string;
	slug: SanitySlug;
	publishedAt: string;
	category: "sermon" | "news";
	excerpt: string;
	body: PortableTextBlock[];
	featuredImage: SanityImage;
	author?: CmsAuthor;
	scriptureReferences?: string[];
	audioUrl?: string;
	videoUrl?: string;
}

/** Lightweight version for listing pages (no body content). */
export interface CmsBlogPostSummary {
	_id: string;
	title: string;
	slug: SanitySlug;
	publishedAt: string;
	category: "sermon" | "news";
	excerpt: string;
	featuredImage: SanityImage;
	author?: {
		name: string;
		image: SanityImage;
	};
}

export interface CmsEventSeries {
	_id: string;
	name: string;
	slug: SanitySlug;
	description?: string;
	logo?: SanityImage;
	themeColor?: string;
	isActive: boolean;
}

export interface CmsEvent {
	_id: string;
	name: string;
	slug: SanitySlug;
	date: string;
	time: string;
	location: string;
	supabaseEventId: string;
	speaker?: CmsAuthor;
	speakerImage?: SanityImage;
	description?: string;
	themeColor?: string;
	status?: "upcoming" | "past";
}

export interface CmsEventSeriesWithEvents extends CmsEventSeries {
	events: CmsEvent[];
}

export interface CmsNextStep {
	_id: string;
	title: string;
	description: string;
	icon?: string;
	ctaText: string;
	ctaLink: string;
	order: number;
}

export interface CmsGivingOption {
	_id: string;
	title: string;
	description: string;
	type: "bank" | "nequi" | "daviplata" | "other";
	details?: string;
	qrCodeImage?: SanityImage;
	order: number;
}

export interface CmsSocialLink {
	platform: string;
	url: string;
}

export interface CmsSiteSettings {
	_id: string;
	churchName: string;
	tagline: string;
	heroImage?: SanityImage;
	aboutDescription?: string;
	aboutLocation?: string;
	aboutServiceTimes?: string;
	socialLinks?: CmsSocialLink[];
}
