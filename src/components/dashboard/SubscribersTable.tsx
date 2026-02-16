import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useState } from "react";
import { downloadCSV } from "@/lib/csv";
import type { EventSubscription } from "@/lib/services/dashboard";
import { Button } from "../ui/button";

const PAGE_SIZE = 20;

interface SubscribersTableProps {
	subscriptions: EventSubscription[];
	eventName: string;
}

export function SubscribersTable({
	subscriptions,
	eventName,
}: SubscribersTableProps) {
	const [page, setPage] = useState(0);
	const totalPages = Math.max(1, Math.ceil(subscriptions.length / PAGE_SIZE));
	const start = page * PAGE_SIZE;
	const pageSubscriptions = subscriptions.slice(start, start + PAGE_SIZE);

	const handleDownloadCSV = () => {
		const headers = ["#", "Nombre", "Email", "Teléfono", "Fecha"];
		const rows = subscriptions.map((sub, i) => [
			String(i + 1),
			sub.name,
			sub.email,
			sub.phone,
			sub.created_at
				? new Date(sub.created_at).toLocaleDateString("es-CO")
				: "",
		]);
		const date = new Date().toISOString().slice(0, 10);
		downloadCSV(
			`${eventName.toLowerCase().replaceAll(" ", "-")}-inscritos-${date}.csv`,
			headers,
			rows,
		);
	};

	if (subscriptions.length === 0) {
		return <p className="mt-4 text-sm text-gray-500">No hay inscritos aun.</p>;
	}

	return (
		<div className="mt-4 overflow-x-auto">
			<div className="mb-2 flex justify-end">
				<Button
					type="button"
					onClick={handleDownloadCSV}
					className="flex items-center gap-1.5 rounded-md bg-amber-400 px-3 py-1.5 mb-2 text-xs font-medium text-gray-700 hover:bg-amber-300 cursor-pointer"
				>
					<Download className="h-4 w-4" />
					Descargar CSV
				</Button>
			</div>
			<table className="w-full text-left text-sm">
				<thead className="bg-gray-50 text-xs uppercase text-gray-500">
					<tr>
						<th className="px-2 py-2 sm:px-4">#</th>
						<th className="px-2 py-2 sm:px-4">Nombre</th>
						<th className="px-2 py-2 sm:px-4">Email</th>
						<th className="hidden px-4 py-2 md:table-cell">Telefono</th>
						<th className="hidden px-4 py-2 md:table-cell">Fecha</th>
					</tr>
				</thead>
				<tbody>
					{pageSubscriptions.map((sub, i) => (
						<tr key={sub.id} className="border-b">
							<td className="px-2 py-2 sm:px-4">{start + i + 1}</td>
							<td className="px-2 py-2 sm:px-4">{sub.name}</td>
							<td className="break-all px-2 py-2 sm:px-4">{sub.email}</td>
							<td className="hidden px-4 py-2 md:table-cell">{sub.phone}</td>
							<td className="hidden px-4 py-2 md:table-cell">
								{sub.created_at
									? new Date(sub.created_at).toLocaleDateString("es-CO")
									: "—"}
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{totalPages > 1 && (
				<div className="mt-3 flex items-center justify-between text-sm text-gray-600">
					<span>
						Mostrando {start + 1}–
						{Math.min(start + PAGE_SIZE, subscriptions.length)} de{" "}
						{subscriptions.length}
					</span>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setPage((p) => p - 1)}
							disabled={page === 0}
							className="rounded p-1 hover:bg-gray-100 disabled:opacity-40"
						>
							<ChevronLeft className="h-4 w-4" />
						</button>
						<span>
							{page + 1} / {totalPages}
						</span>
						<button
							type="button"
							onClick={() => setPage((p) => p + 1)}
							disabled={page >= totalPages - 1}
							className="rounded p-1 hover:bg-gray-100 disabled:opacity-40"
						>
							<ChevronRight className="h-4 w-4" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
