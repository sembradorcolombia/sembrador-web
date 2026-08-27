import { createFileRoute } from "@tanstack/react-router";
import { NocheParejasForm } from "@/components/forms/NocheParejasForm";
import { NocheParejasLayout } from "@/components/layout/NocheParejasLayout";
import { SeoHead } from "@/components/SeoHead";

export const Route = createFileRoute("/noche-parejas/")({
	component: NocheParejasLandingPage,
});

function NocheParejasLandingPage() {
	return (
		<NocheParejasLayout>
			<SeoHead
				title="Noche de Parejas"
				description="Inscríbete a la Cena para Parejas de El Sembrador. Viernes 18 de septiembre a las 7:00 p.m."
			/>

			<NocheParejasForm />
		</NocheParejasLayout>
	);
}
