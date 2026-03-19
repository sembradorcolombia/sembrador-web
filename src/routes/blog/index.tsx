import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";
import { BlogCard } from "@/components/blog/BlogCard";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { SeoHead } from "@/components/SeoHead";
import { useBlogPosts, useBlogPostsByCategory } from "@/lib/hooks/useBlog";

// ── Search param validation ──────────────────────────────────────────────────

const searchSchema = z.object({
	categoria: z.enum(["sermon", "news"]).optional(),
});

export const Route = createFileRoute("/blog/")({
	validateSearch: searchSchema,
	component: BlogListingPage,
});

// ── Component ────────────────────────────────────────────────────────────────

function BlogListingPage() {
	const { categoria } = Route.useSearch();

	// Use category-filtered query when a filter is active, otherwise load all
	const allPosts = useBlogPosts();
	const filteredPosts = useBlogPostsByCategory(categoria);

	const {
		data: posts,
		isLoading,
		isError,
	} = categoria ? filteredPosts : allPosts;

	return (
		<main className="bg-white min-h-screen">
			<SeoHead
				title="Blog"
				description="Sermones, reflexiones y noticias de la iglesia El Sembrador Colombia."
			/>

			{/* Header */}
			<div className="bg-secondary py-16 px-4 background-texture">
				<div className="max-w-4xl mx-auto text-center">
					<h1 className="font-grotesk-compact-black text-4xl md:text-5xl text-white mb-4 uppercase">
						Blog
					</h1>
					<p className="text-white/80 text-lg">
						Sermones, reflexiones y noticias de nuestra comunidad
					</p>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-6xl mx-auto px-4 py-12">
				{/* Category Filter */}
				<div className="mb-8">
					<CategoryFilter />
				</div>

				{/* Loading state */}
				{isLoading && (
					<div className="flex items-center justify-center py-24">
						<p className="text-gray-500 text-lg">Cargando publicaciones...</p>
					</div>
				)}

				{/* Error state */}
				{isError && (
					<div className="flex items-center justify-center py-24">
						<p className="text-red-500 text-lg">
							Error al cargar las publicaciones.
						</p>
					</div>
				)}

				{/* Empty state */}
				{!isLoading && !isError && (!posts || posts.length === 0) && (
					<div className="flex flex-col items-center justify-center py-24 text-center">
						<p className="text-gray-500 text-xl mb-2">
							No hay publicaciones disponibles
						</p>
						{categoria && (
							<p className="text-gray-400 text-sm">
								Intenta seleccionar otra categoría
							</p>
						)}
					</div>
				)}

				{/* Blog post grid */}
				{posts && posts.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{posts.map((post) => (
							<BlogCard key={post._id} post={post} />
						))}
					</div>
				)}
			</div>
		</main>
	);
}
