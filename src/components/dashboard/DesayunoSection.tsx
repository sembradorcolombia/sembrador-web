import { useDesayunoRegistrations } from "@/lib/hooks/useDesayunoRegistrations";
import { DesayunoTable } from "./DesayunoTable";

export function DesayunoSection() {
	const { data, isLoading, isError } = useDesayunoRegistrations();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-24">
				<p className="text-gray-500">Cargando...</p>
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className="flex items-center justify-center py-24">
				<p className="text-red-600">Error al cargar los registros.</p>
			</div>
		);
	}

	return (
		<div className="rounded-lg bg-white p-4 shadow sm:p-6">
			<div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
				<h2 className="text-lg font-bold">Desayuno</h2>
				<span className="text-sm text-gray-600">
					{data.length} {data.length === 1 ? "registro" : "registros"}
				</span>
			</div>

			<DesayunoTable registrations={data} />
		</div>
	);
}
