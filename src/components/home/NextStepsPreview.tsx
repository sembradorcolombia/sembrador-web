import type { LinkProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useNextSteps } from "@/lib/hooks/useNextSteps";

function StepCardSkeleton() {
	return (
		<div className="animate-pulse rounded-xl bg-white p-6 shadow-sm">
			<div className="h-10 w-10 rounded-lg bg-gray-200" />
			<div className="mt-4 h-5 w-3/4 rounded bg-gray-200" />
			<div className="mt-2 space-y-2">
				<div className="h-3 rounded bg-gray-200" />
				<div className="h-3 w-5/6 rounded bg-gray-200" />
			</div>
		</div>
	);
}

export function NextStepsPreview() {
	const { data: steps, isLoading } = useNextSteps();

	// Hide section entirely when there are no steps and not loading
	if (!isLoading && (!steps || steps.length === 0)) {
		return null;
	}

	const visibleSteps = steps?.slice(0, 4) ?? [];

	return (
		<section className="bg-gray-50 py-16 sm:py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex items-end justify-between">
					<div>
						<h2 className="text-3xl font-bold tracking-tight text-gray-900">
							Siguientes Pasos
						</h2>
						<p className="mt-2 text-gray-600">
							Descubre cómo puedes crecer y conectar
						</p>
					</div>
					<Link
						to={"/siguientes-pasos" as LinkProps["to"]}
						className="hidden text-sm font-semibold text-primary transition-colors hover:text-primary-dark sm:block"
					>
						Ver más &rarr;
					</Link>
				</div>

				<div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{isLoading
						? ["ns-sk-1", "ns-sk-2", "ns-sk-3", "ns-sk-4"].map((id) => (
								<StepCardSkeleton key={id} />
							))
						: visibleSteps.map((step) => (
								<article
									key={step._id}
									className="group rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
								>
									{step.icon && (
										<span
											className="inline-block text-3xl"
											role="img"
											aria-hidden="true"
										>
											{step.icon}
										</span>
									)}
									<h3 className="mt-4 text-lg font-semibold text-gray-900">
										{step.title}
									</h3>
									<p className="mt-2 line-clamp-3 text-sm text-gray-600">
										{step.description}
									</p>
									{step.ctaLink && (
										<a
											href={step.ctaLink}
											className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
										>
											{step.ctaText || "Más información"}
											<ArrowRight
												size={14}
												className="transition-transform group-hover:translate-x-0.5"
											/>
										</a>
									)}
								</article>
							))}
				</div>

				{/* Mobile "Ver más" link */}
				<div className="mt-8 text-center sm:hidden">
					<Link
						to={"/siguientes-pasos" as LinkProps["to"]}
						className="text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
					>
						Ver más &rarr;
					</Link>
				</div>
			</div>
		</section>
	);
}
