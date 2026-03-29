import type {
	PortableTextBlock,
	PortableTextComponents,
} from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { sanityImageUrl } from "@/lib/sanity";
import type { SanityImage } from "@/lib/types/cms";

// ── Image URL helpers ────────────────────────────────────────────────────────

function blockImg(source: SanityImageSource) {
	return sanityImageUrl(source).width(800).fit("max").auto("format").url();
}

// ── Portable Text custom components ─────────────────────────────────────────

const components: PortableTextComponents = {
	block: {
		h1: ({ children }) => (
			<h1 className="font-grotesk-compact-black text-3xl text-gray-900 mt-8 mb-4">
				{children}
			</h1>
		),
		h2: ({ children }) => (
			<h2 className="font-grotesk-compact-black text-2xl text-gray-900 mt-8 mb-3">
				{children}
			</h2>
		),
		h3: ({ children }) => (
			<h3 className="font-grotesk-compact-black text-xl text-gray-900 mt-6 mb-2">
				{children}
			</h3>
		),
		h4: ({ children }) => (
			<h4 className="font-grotesk-wide-medium text-lg text-gray-900 mt-4 mb-2">
				{children}
			</h4>
		),
		normal: ({ children }) => (
			<p className="text-base text-gray-700 leading-relaxed mb-4">{children}</p>
		),
		blockquote: ({ children }) => (
			<blockquote className="border-l-4 border-green-600 pl-4 py-1 my-6 bg-green-50 rounded-r-lg">
				<p className="text-gray-700 italic leading-relaxed">{children}</p>
			</blockquote>
		),
	},
	list: {
		bullet: ({ children }) => (
			<ul className="list-disc list-inside space-y-1 mb-4 text-gray-700">
				{children}
			</ul>
		),
		number: ({ children }) => (
			<ol className="list-decimal list-inside space-y-1 mb-4 text-gray-700">
				{children}
			</ol>
		),
	},
	listItem: {
		bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
		number: ({ children }) => <li className="leading-relaxed">{children}</li>,
	},
	marks: {
		strong: ({ children }) => (
			<strong className="font-semibold text-gray-900">{children}</strong>
		),
		em: ({ children }) => <em className="italic">{children}</em>,
		underline: ({ children }) => <span className="underline">{children}</span>,
		"strike-through": ({ children }) => (
			<span className="line-through">{children}</span>
		),
		link: ({ children, value }) => {
			const href = value?.href ?? "";
			const isExternal = href.startsWith("http");
			return (
				<a
					href={href}
					target={isExternal ? "_blank" : undefined}
					rel={isExternal ? "noopener noreferrer" : undefined}
					className="text-green-700 underline hover:text-green-800 transition-colors"
				>
					{children}
				</a>
			);
		},
	},
	types: {
		image: ({
			value,
		}: {
			value: SanityImage & { alt?: string; caption?: string };
		}) => {
			if (!value?.asset) return null;

			const imageUrl = blockImg(value.asset);

			const srcSet = [
				`${sanityImageUrl(value).width(400).auto("format").url()} 400w`,
				`${sanityImageUrl(value).width(800).auto("format").url()} 800w`,
				`${sanityImageUrl(value).width(1200).auto("format").url()} 1200w`,
			].join(", ");

			return (
				<figure className="my-6">
					<img
						src={imageUrl}
						srcSet={srcSet}
						sizes="(max-width: 768px) 100vw, 800px"
						alt={value.alt ?? ""}
						className="w-full rounded-lg"
						loading="lazy"
					/>
					{value.caption && (
						<figcaption className="text-sm text-gray-500 text-center mt-2">
							{value.caption}
						</figcaption>
					)}
				</figure>
			);
		},
		// Fallback for unknown custom types — log in dev, render nothing
		// biome-ignore lint/suspicious/noExplicitAny: unknown block type from CMS
		unknownType: ({ value }: { value: any }) => {
			if (import.meta.env.DEV) {
				console.warn("[BlogContent] Unknown Portable Text type:", value._type);
			}
			return null;
		},
	},
};

// ── Scripture References ─────────────────────────────────────────────────────

interface ScriptureReferencesProps {
	references: string[];
}

export function ScriptureReferences({ references }: ScriptureReferencesProps) {
	if (references.length === 0) return null;

	return (
		<aside className="bg-amber-50 border border-amber-200 rounded-xl p-5 my-6">
			<h3 className="font-grotesk-wide-medium text-sm uppercase tracking-wide text-amber-800 mb-3">
				Referencias bíblicas
			</h3>
			<ul className="space-y-1">
				{references.map((ref) => (
					<li
						key={ref}
						className="text-amber-900 text-sm flex items-start gap-2"
					>
						<span className="text-amber-600 mt-0.5">📖</span>
						{ref}
					</li>
				))}
			</ul>
		</aside>
	);
}

// ── Audio Player ─────────────────────────────────────────────────────────────

interface AudioPlayerProps {
	url: string;
}

export function AudioPlayer({ url }: AudioPlayerProps) {
	return (
		<div className="my-6 bg-gray-50 rounded-xl p-4">
			<p className="text-sm font-medium text-gray-700 mb-2">Audio del sermón</p>
			{/* biome-ignore lint/a11y/useMediaCaption: sermon audio content does not have captions */}
			<audio controls className="w-full" preload="metadata">
				<source src={url} />
				Tu navegador no soporta la reproducción de audio.
			</audio>
		</div>
	);
}

// ── Video Embed ───────────────────────────────────────────────────────────────

interface VideoEmbedProps {
	url: string;
}

function getYouTubeId(url: string): string | null {
	const match = url.match(
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
	);
	return match ? (match[1] ?? null) : null;
}

function getVimeoId(url: string): string | null {
	const match = url.match(/vimeo\.com\/(\d+)/);
	return match ? (match[1] ?? null) : null;
}

export function VideoEmbed({ url }: VideoEmbedProps) {
	const youtubeId = getYouTubeId(url);
	const vimeoId = getVimeoId(url);

	if (youtubeId) {
		return (
			<div className="my-6 aspect-video rounded-xl overflow-hidden">
				<iframe
					src={`https://www.youtube.com/embed/${youtubeId}`}
					title="Video del sermón"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
					className="w-full h-full"
				/>
			</div>
		);
	}

	if (vimeoId) {
		return (
			<div className="my-6 aspect-video rounded-xl overflow-hidden">
				<iframe
					src={`https://player.vimeo.com/video/${vimeoId}`}
					title="Video del sermón"
					allow="autoplay; fullscreen; picture-in-picture"
					allowFullScreen
					className="w-full h-full"
				/>
			</div>
		);
	}

	// Fallback: native video element
	return (
		<div className="my-6 rounded-xl overflow-hidden">
			{/* biome-ignore lint/a11y/useMediaCaption: sermon video content does not have captions */}
			<video controls className="w-full" preload="metadata">
				<source src={url} />
				Tu navegador no soporta la reproducción de video.
			</video>
		</div>
	);
}

// ── Main BlogContent component ────────────────────────────────────────────────

interface BlogContentProps {
	// biome-ignore lint/suspicious/noExplicitAny: Portable Text blocks are typed as Record<string,any> in the CMS layer
	body: Record<string, any>[];
}

export function BlogContent({ body }: BlogContentProps) {
	return (
		<div className="prose-blog">
			<PortableText
				value={body as PortableTextBlock[]}
				components={components}
			/>
		</div>
	);
}
