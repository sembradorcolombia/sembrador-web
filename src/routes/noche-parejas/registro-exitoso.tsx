import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { NocheParejasLayout } from "@/components/layout/NocheParejasLayout";
import { SeoHead } from "@/components/SeoHead";

export const Route = createFileRoute("/noche-parejas/registro-exitoso")({
	component: NocheParejasRegistroExitosoPage,
});

function NocheParejasRegistroExitosoPage() {
	useEffect(() => {
		if (typeof window.fbq === "function") {
			window.fbq("trackCustom", "NocheParejasSuccess");
		}
	}, []);

	return (
		<NocheParejasLayout>
			<SeoHead
				title="Registro exitoso — Noche de Parejas"
				description="Tu registro a la Cena para Parejas de El Sembrador fue exitoso."
			/>

			<div className="flex min-h-[371px] items-center justify-center rounded-lg bg-white/30 px-6 py-10 lg:min-h-[321px]">
				<div className="text-center">
					<p className="text-[32px] font-bold leading-[1.2] text-[#222]">
						Muchas gracias por registrarte
					</p>
					<p className="mt-1 text-2xl font-normal leading-[1.2] text-[#222]">
						nos vemos en una noche especial
					</p>
				</div>
			</div>

			<div className="mt-8 flex justify-center lg:mt-12">
				<Link
					to="/"
					className="inline-flex h-[71px] w-full items-center justify-center rounded-3xl bg-[#c960a6] px-4 text-[32px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#b05090] lg:w-[349px]"
				>
					Ir al inicio
				</Link>
			</div>
		</NocheParejasLayout>
	);
}
