import type { LinkProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useBlogPosts } from "@/lib/hooks/useBlog";
import { sanityImageUrl } from "@/lib/sanity";

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString("es-CO", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function BlogCardSkeleton() {
	return (
		<div className="animate-pulse overflow-hidden rounded-xl bg-white shadow-sm">
			<div className="h-48 bg-gray-200" />
			<div className="space-y-3 p-5">
				<div className="h-4 w-24 rounded bg-gray-200" />
				<div className="h-5 w-3/4 rounded bg-gray-200" />
				<div className="space-y-2">
					<div className="h-3 rounded bg-gray-200" />
					<div className="h-3 w-5/6 rounded bg-gray-200" />
				</div>
			</div>
		</div>
	);
}

export function BlogPreview() {
	const { data: posts, isLoading } = useBlogPosts();

	// Hide section entirely when there are no posts and not loading
	if (!isLoading && (!posts || posts.length === 0)) {
		return null;
	}

	const recentPosts = posts?.slice(0, 3) ?? [];

	return (
		<section className="bg-gray-50 py-16 sm:py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex items-end justify-between">
					<div>
						<h2 className="text-3xl font-bold tracking-tight text-gray-900">
							Blog
						</h2>
						<p className="mt-2 text-gray-600">
							Reflexiones, noticias y mensajes de nuestra comunidad
						</p>
					</div>
					<Link
						to={"/blog" as LinkProps["to"]}
						className="hidden text-sm font-semibold text-primary transition-colors hover:text-primary-dark sm:block"
					>
						Ver todos &rarr;
					</Link>
				</div>

				<div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{isLoading
						? ["blog-sk-1", "blog-sk-2", "blog-sk-3"].map((id) => (
								<BlogCardSkeleton key={id} />
							))
						: recentPosts.map((post) => {
								const imageUrl = post.featuredImage
									? sanityImageUrl(post.featuredImage.asset)
											.width(600)
											.height(400)
											.quality(75)
											.url()
									: null;

								return (
									<article
										key={post._id}
										className="group overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
									>
										{imageUrl && (
											<div className="h-48 overflow-hidden">
												<img
													src={imageUrl}
													alt={post.featuredImage?.alt || post.title}
													className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
												/>
											</div>
										)}
										<div className="p-5">
											<time
												dateTime={post.publishedAt}
												className="text-sm text-gray-500"
											>
												{formatDate(post.publishedAt)}
											</time>
											<h3 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-primary">
												{post.title}
											</h3>
											<p className="mt-2 line-clamp-2 text-sm text-gray-600">
												{post.excerpt}
											</p>
										</div>
									</article>
								);
							})}
				</div>

				{/* Mobile "Ver todos" link */}
				<div className="mt-8 text-center sm:hidden">
					<Link
						to={"/blog" as LinkProps["to"]}
						className="text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
					>
						Ver todos &rarr;
					</Link>
				</div>
			</div>
		</section>
	);
}
