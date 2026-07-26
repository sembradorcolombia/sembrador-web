import type { CmsCoreItem } from "@/lib/types/cms";

interface CoreItemsSectionProps {
	title: string;
	items?: CmsCoreItem[];
}

/** Renders the core values or core beliefs as a grid of cards. */
export function CoreItemsSection({ title, items }: CoreItemsSectionProps) {
	if (!items?.length) return null;

	return (
		<section className="border-t border-gray-100 pt-12">
			<h2 className="font-grotesk-compact-black text-2xl text-gray-900 mb-6">
				{title}
			</h2>
			<ul className="grid gap-6 sm:grid-cols-2">
				{items.map((item) => (
					<li
						key={item.title}
						className="rounded-xl bg-gray-50 p-5 border border-gray-100"
					>
						<h3 className="font-grotesk-wide-medium text-lg text-gray-900">
							{item.title}
						</h3>
						{item.description && (
							<p className="mt-2 text-gray-700 leading-relaxed">
								{item.description}
							</p>
						)}
					</li>
				))}
			</ul>
		</section>
	);
}
