import { Helmet } from "react-helmet-async";

// ── Site-wide defaults ────────────────────────────────────────────────────────

const SITE_NAME = "El Sembrador";
const DEFAULT_DESCRIPTION =
	"El Sembrador es una iglesia en Medellín comprometida con compartir el amor de Dios y construir comunidad. Eventos, blog, y más.";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SeoHeadProps {
	/**
	 * Page title. Will be formatted as "{title} — El Sembrador".
	 * If omitted, the site name is used as-is (for the homepage use the `fullTitle` prop).
	 */
	title?: string;
	/**
	 * When true, the `title` value is used verbatim (no suffix appended).
	 * Use this for the homepage where the full title is "El Sembrador — Iglesia en Medellín".
	 */
	fullTitle?: string;
	/** Meta description. Defaults to the site-wide description. */
	description?: string;
	/** Absolute URL of the Open Graph image. Defaults to undefined (no og:image tag). */
	image?: string;
	/** Open Graph type. Defaults to "website". Use "article" for blog posts. */
	type?: "website" | "article";
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SeoHead({
	title,
	fullTitle,
	description = DEFAULT_DESCRIPTION,
	image,
	type = "website",
}: SeoHeadProps) {
	const resolvedTitle = fullTitle
		? fullTitle
		: title
			? `${title} — ${SITE_NAME}`
			: SITE_NAME;

	return (
		<Helmet>
			<title>{resolvedTitle}</title>
			<meta name="description" content={description} />

			{/* Open Graph */}
			<meta property="og:title" content={resolvedTitle} />
			<meta property="og:description" content={description} />
			<meta property="og:type" content={type} />
			{image && <meta property="og:image" content={image} />}
		</Helmet>
	);
}
