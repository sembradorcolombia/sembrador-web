import type { SanityImageSource } from "@sanity/image-url";
import { useLeadership } from "@/lib/hooks/useLeadership";
import { sanityImageUrl } from "@/lib/sanity";

// ── Image URL helper ─────────────────────────────────────────────────────────

function portraitImg(source: SanityImageSource) {
	return sanityImageUrl(source).width(400).height(400).fit("crop").url();
}

export function LeadershipSection() {
	const { data: leaders, isLoading, isError } = useLeadership();

	if (isLoading) {
		return (
			<section className="border-t border-gray-100 pt-12">
				<h2 className="font-grotesk-compact-black text-2xl text-gray-900 mb-6">
					Nuestro liderazgo
				</h2>
				<p className="text-gray-500">Cargando liderazgo...</p>
			</section>
		);
	}

	// A failure here must not take down the rest of /acerca.
	if (isError) {
		return (
			<section className="border-t border-gray-100 pt-12">
				<h2 className="font-grotesk-compact-black text-2xl text-gray-900 mb-6">
					Nuestro liderazgo
				</h2>
				<p className="text-gray-500">
					No pudimos cargar el liderazgo en este momento.
				</p>
			</section>
		);
	}

	if (!leaders?.length) return null;

	return (
		<section className="border-t border-gray-100 pt-12">
			<h2 className="font-grotesk-compact-black text-2xl text-gray-900 mb-6">
				Nuestro liderazgo
			</h2>
			<ul className="grid gap-8 sm:grid-cols-2">
				{leaders.map((leader) => (
					<li key={leader._id} className="flex flex-col items-start gap-4">
						{leader.image?.asset && (
							<img
								src={portraitImg(leader.image.asset)}
								alt={leader.image.alt || leader.name}
								className="w-24 h-24 rounded-full object-cover"
								loading="lazy"
							/>
						)}
						<div>
							<h3 className="font-grotesk-wide-medium text-lg text-gray-900">
								{leader.name}
							</h3>
							{leader.leadershipTitle && (
								<p className="text-sm text-green-700">
									{leader.leadershipTitle}
								</p>
							)}
							{leader.bio && (
								<p className="mt-2 text-gray-700 leading-relaxed">
									{leader.bio}
								</p>
							)}
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}
