import type { SanityImageSource } from "@sanity/image-url";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import {
	AudioPlayer,
	BlogContent,
	ScriptureReferences,
	VideoEmbed,
} from "@/components/blog/BlogContent";
import { useBlogPost } from "@/lib/hooks/useBlog";
import { sanityImageUrl } from "@/lib/sanity";

export const Route = createFileRoute("/blog/$slug")({
	component: BlogPostDetailPage,
});

// ── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
	sermon: "Sermón",
	news: "Noticia",
};

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString("es-CO", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function heroImg(source: SanityImageSource) {
	return sanityImageUrl(source).width(1200).height(630).fit("crop").url();
}

function authorImg(source: SanityImageSource) {
	return sanityImageUrl(source).width(48).height(48).fit("crop").url();
}

// ── Component ────────────────────────────────────────────────────────────────

function BlogPostDetailPage() {
	const { slug } = Route.useParams();
	const { data: post, isLoading, isError } = useBlogPost(slug);

	if (isLoading) {
		return (
			<main className="bg-white min-h-screen flex items-center justify-center">
				<p className="text-gray-500 text-lg">Cargando publicación...</p>
			</main>
		);
	}

	if (isError) {
		return (
			<main className="bg-white min-h-screen flex items-center justify-center">
				<p className="text-red-500 text-lg">Error al cargar la publicación.</p>
			</main>
		);
	}

	if (!post) {
		return (
			<main className="bg-white min-h-screen flex items-center justify-center px-4">
				<div className="text-center max-w-md">
					<h1 className="font-grotesk-compact-black text-2xl text-gray-900 mb-4">
						Publicación no encontrada
					</h1>
					<p className="text-gray-500 mb-8">
						La publicación que buscas no existe o fue removida.
					</p>
					<Link
						to="/blog"
						className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors"
					>
						Volver al blog
					</Link>
				</div>
			</main>
		);
	}

	const featuredImageUrl = post.featuredImage
		? heroImg(post.featuredImage.asset)
		: null;

	const authorImageUrl = post.author?.image
		? authorImg(post.author.image.asset)
		: null;

	const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category;

	return (
		<main className="bg-white min-h-screen">
			<Helmet>
				<title>{post.title} — El Sembrador</title>
				{post.excerpt && <meta name="description" content={post.excerpt} />}
				<meta property="og:title" content={`${post.title} — El Sembrador`} />
				{post.excerpt && (
					<meta property="og:description" content={post.excerpt} />
				)}
				{featuredImageUrl && (
					<meta property="og:image" content={featuredImageUrl} />
				)}
				<meta property="og:type" content="article" />
			</Helmet>

			{/* Featured image */}
			{featuredImageUrl && (
				<div className="w-full aspect-video max-h-[480px] overflow-hidden bg-gray-100">
					<img
						src={featuredImageUrl}
						alt={post.featuredImage?.alt ?? post.title}
						className="w-full h-full object-cover"
					/>
				</div>
			)}

			{/* Article content — constrained reading width */}
			<div className="max-w-prose mx-auto px-4 py-10 md:py-16">
				{/* Category + Date */}
				<div className="flex items-center gap-3 mb-4">
					<span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-800">
						{categoryLabel}
					</span>
					<span className="text-sm text-gray-500">
						{formatDate(post.publishedAt)}
					</span>
				</div>

				{/* Title */}
				<h1 className="font-grotesk-compact-black text-3xl md:text-4xl text-gray-900 mb-6 leading-tight">
					{post.title}
				</h1>

				{/* Author */}
				{post.author && (
					<div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
						{authorImageUrl && (
							<img
								src={authorImageUrl}
								alt={post.author.name}
								className="w-12 h-12 rounded-full object-cover"
							/>
						)}
						<div>
							<p className="font-medium text-gray-900 text-sm">
								{post.author.name}
							</p>
							{post.author.role && (
								<p className="text-xs text-gray-500">{post.author.role}</p>
							)}
						</div>
					</div>
				)}

				{/* Scripture References (before body for sermons) */}
				{post.scriptureReferences && post.scriptureReferences.length > 0 && (
					<ScriptureReferences references={post.scriptureReferences} />
				)}

				{/* Audio embed */}
				{post.audioUrl && <AudioPlayer url={post.audioUrl} />}

				{/* Video embed */}
				{post.videoUrl && <VideoEmbed url={post.videoUrl} />}

				{/* Portable Text body */}
				{post.body && post.body.length > 0 && <BlogContent body={post.body} />}

				{/* Back link */}
				<div className="mt-12 pt-8 border-t border-gray-100">
					<Link
						to="/blog"
						className="text-green-700 hover:text-green-800 transition-colors text-sm font-medium"
					>
						← Volver al blog
					</Link>
				</div>
			</div>
		</main>
	);
}
