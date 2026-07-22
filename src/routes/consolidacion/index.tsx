import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ConsolidationForm } from "@/components/forms/ConsolidationForm";
import { SeoHead } from "@/components/SeoHead";
import { NEXT_STEP_OPTIONS } from "@/lib/validations/consolidation";

const consolidationSearchSchema = z.object({
	paso: z.enum(NEXT_STEP_OPTIONS).optional().catch(undefined),
});

export const Route = createFileRoute("/consolidacion/")({
	validateSearch: consolidationSearchSchema,
	component: ConsolidacionPage,
});

function ConsolidacionPage() {
	const { paso } = Route.useSearch();

	return (
		<main className="bg-white min-h-screen">
			<SeoHead
				title="Consolidación"
				description="Regístrate para dar tu siguiente paso en El Sembrador: Comunidades misionales, Discipulado 1:1 o Consejería."
			/>

			{/* Header */}
			<div className="bg-secondary py-16 px-4">
				<div className="max-w-4xl mx-auto text-center">
					<h1 className="font-grotesk-compact-black text-4xl md:text-5xl text-white mb-4 uppercase">
						Consolidación
					</h1>
					<p className="text-white/80 text-lg">
						Déjanos tus datos y te acompañaremos en tu siguiente paso
					</p>
				</div>
			</div>

			{/* Form */}
			<div className="max-w-6xl mx-auto px-4 py-16">
				<ConsolidationForm defaultNextStep={paso} />
			</div>
		</main>
	);
}
