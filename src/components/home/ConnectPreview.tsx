import type { LinkProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { previewGridClass } from "@/lib/grid";
import { useConnectSteps } from "@/lib/hooks/useConnectSteps";
import { resolveIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

function StepIcon({ name }: { name?: string }) {
	const Icon = resolveIcon(name);
	return (
		<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
			<Icon size={24} aria-hidden="true" />
		</div>
	);
}

const SKELETON_COUNT = 3;
const MAX_STEPS = 4;

function StepCardSkeleton() {
	return (
		<div className="animate-pulse rounded-xl bg-white p-6 shadow-sm">
			<div className="h-12 w-12 rounded-full bg-gray-200" />
			<div className="mt-4 h-5 w-3/4 rounded bg-gray-200" />
			<div className="mt-2 space-y-2">
				<div className="h-3 rounded bg-gray-200" />
				<div className="h-3 w-5/6 rounded bg-gray-200" />
			</div>
		</div>
	);
}

export function ConnectPreview() {
	const { data: steps, isLoading } = useConnectSteps();

	// Hide section entirely when there are no steps and not loading
	if (!isLoading && (!steps || steps.length === 0)) {
		return null;
	}

	const visibleSteps = steps?.slice(0, MAX_STEPS) ?? [];

	return (
		<section className="bg-gray-50 py-16 sm:py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex items-end justify-between">
					<div>
						<h2 className="text-3xl font-bold tracking-tight text-gray-900">
							Conectar
						</h2>
						<p className="mt-2 text-gray-600">
							Descubre cómo puedes crecer y conectar
						</p>
					</div>
					<Link
						to={"/conectar" as LinkProps["to"]}
						className="hidden text-sm font-semibold text-primary transition-colors hover:text-primary-dark sm:block"
					>
						Ver más &rarr;
					</Link>
				</div>

				<div
					className={cn(
						"mt-10 grid gap-6",
						previewGridClass(
							isLoading ? SKELETON_COUNT : visibleSteps.length,
							MAX_STEPS,
						),
					)}
				>
					{isLoading
						? Array.from({ length: SKELETON_COUNT }, (_, i) => (
								<StepCardSkeleton key={`connect-skeleton-${i + 1}`} />
							))
						: visibleSteps.map((step) => (
								<article
									key={step._id}
									className="group flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
								>
									<StepIcon name={step.icon} />
									<h3 className="mb-2 font-grotesk-compact-black text-xl text-gray-900">
										{step.title}
									</h3>
									<p className="mb-6 flex-1 text-sm leading-relaxed text-gray-600">
										{step.description}
									</p>
									{step.ctaLink && (
										<a
											href={step.ctaLink}
											className="inline-flex items-center gap-2 text-sm font-medium text-green-700 transition-colors hover:text-green-900"
										>
											{step.ctaText || "Más información"}
											<ArrowRight
												size={16}
												className="transition-transform group-hover:translate-x-1"
											/>
										</a>
									)}
								</article>
							))}
				</div>

				{/* Mobile "Ver más" link */}
				<div className="mt-8 text-center sm:hidden">
					<Link
						to={"/conectar" as LinkProps["to"]}
						className="text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
					>
						Ver más &rarr;
					</Link>
				</div>
			</div>
		</section>
	);
}
