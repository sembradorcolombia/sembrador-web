import type { LinkProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export function GivePreview() {
	return (
		<section className="bg-secondary py-16 sm:py-20">
			<div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
				<Heart size={40} className="mx-auto text-white/80" strokeWidth={1.5} />
				<h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
					Dar
				</h2>
				<p className="mt-4 text-lg text-white/85">
					Tu generosidad hace posible nuestra misión. Cada aporte nos permite
					seguir impactando vidas y construyendo comunidad en Medellín.
				</p>
				<Link
					to={"/dar" as LinkProps["to"]}
					className="mt-8 inline-block rounded-lg bg-white px-8 py-3 text-lg font-semibold text-secondary transition-colors hover:bg-gray-100"
				>
					Conoce cómo dar
				</Link>
			</div>
		</section>
	);
}
