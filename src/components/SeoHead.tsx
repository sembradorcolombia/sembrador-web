// ── Site-wide defaults ────────────────────────────────────────────────────────

const SITE_NAME = "El Sembrador";
const DEFAULT_DESCRIPTION =
	"El Sembrador es una iglesia en Medellín comprometida con compartir el amor de Dios y construir comunidad. Eventos, blog, y más.";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SeoHeadProps {
	/**
	 * Page title. Will be formatted as "{title} — El Sembrador".
	 * If omitted, the site name is used as-is.
	 */
	title?: string;
	/**
	 * When provided, used verbatim (no suffix appended).
	 * Use this for the homepage where the full title is "El Sembrador — Iglesia en Medellín".
	 */
	fullTitle?: string;
	/** Meta description. Defaults to the site-wide description. */
	description?: string;
	/** Absolute URL of the Open Graph image. */
	image?: string;
	/** Open Graph type. Defaults to "website". Use "article" for blog posts. */
	type?: "website" | "article";
}

// ── Component ─────────────────────────────────────────────────────────────────
// React 19 natively hoists <title> and <meta> to <head> — no library needed.

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
		<>
			<title>{resolvedTitle}</title>
			<meta name="description" content={description} />
			<meta property="og:title" content={resolvedTitle} />
			<meta property="og:description" content={description} />
			<meta property="og:type" content={type} />
			{image && <meta property="og:image" content={image} />}
		</>
	);
}
