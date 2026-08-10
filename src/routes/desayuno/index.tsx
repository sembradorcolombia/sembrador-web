import { createFileRoute } from "@tanstack/react-router";
import { DesayunoForm } from "@/components/forms/DesayunoForm";
import { SeoHead } from "@/components/SeoHead";

export const Route = createFileRoute("/desayuno/")({
	component: DesayunoPage,
});

function DesayunoPage() {
	return (
		<main className="bg-white min-h-screen">
			<SeoHead
				title="Desayuno"
				description="Regístrate para el desayuno de El Sembrador. Déjanos tus datos y te esperamos."
			/>

			<div className="bg-secondary py-16 px-4">
				<div className="max-w-4xl mx-auto text-center">
					<h1 className="font-grotesk-compact-black text-4xl md:text-5xl text-white mb-4 uppercase">
						Desayuno
					</h1>
					<p className="text-white/80 text-lg">
						Déjanos tus datos y te esperamos en el desayuno
					</p>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-4 py-16">
				<DesayunoForm />
			</div>
		</main>
	);
}
