import type { SanityImageSource } from "@sanity/image-url";
import type { LinkProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useHero } from "@/lib/hooks/useHero";
import { sanityImageUrl } from "@/lib/sanity";
import type { CmsHeroCta, HeroKey } from "@/lib/types/cms";
import { cn } from "@/lib/utils";

const FALLBACK_BACKGROUND_IMAGE = "/images/ciudad-del-rio-medellin.jpg";

// ── Image URL helper ─────────────────────────────────────────────────────────

function backgroundImg(source: SanityImageSource) {
	return sanityImageUrl(source).width(1920).quality(80).auto("format").url();
}

// ── CTA ──────────────────────────────────────────────────────────────────────

const CTA_CLASS =
	"mt-6 inline-block rounded-lg border border-white/60 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10";

function isExternalLink(link: string) {
	return /^(https?:)?\/\//.test(link) || link.startsWith("mailto:");
}

function HeroCta({ cta }: { cta: CmsHeroCta }) {
	if (isExternalLink(cta.link)) {
		return (
			<a
				href={cta.link}
				target="_blank"
				rel="noopener noreferrer"
				className={CTA_CLASS}
			>
				{cta.text}
			</a>
		);
	}

	return (
		<Link to={cta.link as LinkProps["to"]} className={CTA_CLASS}>
			{cta.text}
		</Link>
	);
}

// ── Hero ─────────────────────────────────────────────────────────────────────

const VARIANT_CLASS = {
	/** Tall banner — the homepage. */
	full: "min-h-[70vh]",
	/** Shorter page header — every other page. */
	compact: "min-h-[40vh]",
} as const;

interface HeroProps {
	/** Which `hero` document to render. */
	heroKey: HeroKey;
	/** Banner height. Defaults to the shorter page-header treatment. */
	variant?: keyof typeof VARIANT_CLASS;
	/** Heading used when no hero document exists or the fetch fails. */
	fallbackHeading: string;
	/** Lead text used when no hero document exists or the fetch fails. */
	fallbackLeadText?: string;
	/** CTA rendered when the hero document defines none. */
	fallbackCta?: CmsHeroCta;
	/**
	 * Page-specific chrome composed over the banner, rendered between the lead
	 * text and the CTA.
	 */
	children?: ReactNode;
}

export function Hero({
	heroKey,
	variant = "compact",
	fallbackHeading,
	fallbackLeadText,
	fallbackCta,
	children,
}: HeroProps) {
	const { data: hero, isLoading } = useHero(heroKey);

	const heading = hero?.heading || fallbackHeading;
	const leadText = hero?.leadText || fallbackLeadText;
	const cta = hero?.cta?.text && hero.cta.link ? hero.cta : fallbackCta;

	const backgroundImage = hero?.backgroundImage
		? backgroundImg(hero.backgroundImage.asset)
		: FALLBACK_BACKGROUND_IMAGE;

	return (
		<section
			className={cn(
				"relative flex items-center justify-center overflow-hidden",
				VARIANT_CLASS[variant],
			)}
		>
			{/* Background image */}
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{ backgroundImage: `url(${backgroundImage})` }}
			/>

			{/* Dark overlay — keeps text legible over light or busy imagery */}
			<div className="absolute inset-0 bg-black/60" />

			{/* Content */}
			<div className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center text-white sm:px-6 lg:px-8">
				{isLoading ? (
					<div
						data-testid="hero-skeleton"
						className="animate-pulse space-y-4"
						aria-hidden="true"
					>
						<div className="mx-auto h-12 w-64 max-w-full rounded bg-white/20" />
						<div className="mx-auto h-6 w-96 max-w-full rounded bg-white/15" />
						<div className="flex flex-wrap justify-center gap-4 pt-4">
							<div className="h-10 w-44 max-w-full rounded-full bg-white/15" />
							<div className="h-10 w-44 max-w-full rounded-full bg-white/15" />
						</div>
						<div className="mx-auto h-10 w-36 rounded-lg bg-white/10" />
					</div>
				) : (
					<>
						<h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
							{heading}
						</h1>
						{leadText && (
							<p className="mt-4 text-lg text-white/90 sm:text-xl">
								{leadText}
							</p>
						)}
						{children}
						{cta && <HeroCta cta={cta} />}
					</>
				)}
			</div>
		</section>
	);
}
