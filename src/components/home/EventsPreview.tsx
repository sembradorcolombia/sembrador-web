import type { LinkProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { useCmsEventSeries } from "@/lib/hooks/useCmsEvents";
import { sanityImageUrl } from "@/lib/sanity";

function EventCardSkeleton() {
	return (
		<div className="animate-pulse overflow-hidden rounded-xl bg-white shadow-sm">
			<div className="p-6">
				<div className="h-5 w-32 rounded bg-gray-200" />
				<div className="mt-3 h-4 w-48 rounded bg-gray-200" />
				<div className="mt-2 h-4 w-36 rounded bg-gray-200" />
			</div>
		</div>
	);
}

export function EventsPreview() {
	const { data: series, isLoading } = useCmsEventSeries();

	const activeSeries = series?.filter((s) => s.isActive) ?? [];

	// Hide section entirely when there are no active series and not loading
	if (!isLoading && activeSeries.length === 0) {
		return null;
	}

	return (
		<section className="py-16 sm:py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex items-end justify-between">
					<div>
						<h2 className="text-3xl font-bold tracking-tight text-gray-900">
							Eventos
						</h2>
						<p className="mt-2 text-gray-600">
							Únete a nuestros próximos encuentros
						</p>
					</div>
					<Link
						to={"/eventos" as LinkProps["to"]}
						className="hidden text-sm font-semibold text-primary transition-colors hover:text-primary-dark sm:block"
					>
						Ver eventos &rarr;
					</Link>
				</div>

				<div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{isLoading
						? ["ev-sk-1", "ev-sk-2", "ev-sk-3"].map((id) => (
								<EventCardSkeleton key={id} />
							))
						: activeSeries.map((s) => {
								const logoUrl = s.logo
									? sanityImageUrl(s.logo.asset)
											.width(80)
											.height(80)
											.quality(75)
											.url()
									: null;

								return (
									<article
										key={s._id}
										className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
									>
										<div className="p-6">
											<div className="flex items-center gap-3">
												{logoUrl && (
													<img
														src={logoUrl}
														alt={s.name}
														className="h-10 w-10 rounded-lg object-contain"
													/>
												)}
												<h3
													className="text-lg font-semibold text-gray-900 group-hover:text-primary"
													style={
														s.themeColor ? { color: s.themeColor } : undefined
													}
												>
													{s.name}
												</h3>
											</div>
											{s.description && (
												<p className="mt-3 line-clamp-2 text-sm text-gray-600">
													{s.description}
												</p>
											)}
											<div className="mt-4">
												<span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
													<Calendar size={14} />
													Serie activa
												</span>
											</div>
										</div>
									</article>
								);
							})}
				</div>

				{/* Mobile "Ver eventos" link */}
				<div className="mt-8 text-center sm:hidden">
					<Link
						to={"/eventos" as LinkProps["to"]}
						className="text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
					>
						Ver eventos &rarr;
					</Link>
				</div>
			</div>
		</section>
	);
}
