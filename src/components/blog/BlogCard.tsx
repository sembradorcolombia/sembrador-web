import type { SanityImageSource } from "@sanity/image-url";
import { Link } from "@tanstack/react-router";
import { sanityImageUrl } from "@/lib/sanity";
import type { CmsBlogPostSummary } from "@/lib/types/cms";

interface BlogCardProps {
	post: CmsBlogPostSummary;
}

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

function featuredImg(source: SanityImageSource) {
	return sanityImageUrl(source).width(600).height(340).fit("crop").url();
}

function avatarImg(source: SanityImageSource) {
	return sanityImageUrl(source).width(32).height(32).fit("crop").url();
}

export function BlogCard({ post }: BlogCardProps) {
	const imageUrl = post.featuredImage
		? featuredImg(post.featuredImage.asset)
		: null;
	const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category;

	return (
		<Link
			to="/blog/$slug"
			params={{ slug: post.slug.current }}
			className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
		>
			{imageUrl ? (
				<div className="aspect-video overflow-hidden">
					<img
						src={imageUrl}
						alt={post.featuredImage?.alt ?? post.title}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
					/>
				</div>
			) : (
				<div className="aspect-video bg-gray-100 flex items-center justify-center">
					<span className="text-gray-400 text-sm">Sin imagen</span>
				</div>
			)}

			<div className="p-5">
				<div className="flex items-center gap-2 mb-3">
					<span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-800">
						{categoryLabel}
					</span>
					<span className="text-xs text-gray-500">
						{formatDate(post.publishedAt)}
					</span>
				</div>

				<h2 className="font-grotesk-compact-black text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
					{post.title}
				</h2>

				{post.excerpt && (
					<p className="text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
				)}

				{post.author && (
					<div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
						{post.author.image && (
							<img
								src={avatarImg(post.author.image.asset)}
								alt={post.author.name}
								className="w-8 h-8 rounded-full object-cover"
							/>
						)}
						<span className="text-xs text-gray-500">{post.author.name}</span>
					</div>
				)}
			</div>
		</Link>
	);
}
