import type { EventSubscription } from "@/lib/services/dashboard";

interface SubscribersTableProps {
	subscriptions: EventSubscription[];
}

export function SubscribersTable({ subscriptions }: SubscribersTableProps) {
	if (subscriptions.length === 0) {
		return <p className="mt-4 text-sm text-gray-500">No hay inscritos aun.</p>;
	}

	return (
		<div className="mt-4 overflow-x-auto">
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
					{subscriptions.map((sub, i) => (
						<tr key={sub.id} className="border-b">
							<td className="px-2 py-2 sm:px-4">{i + 1}</td>
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
		</div>
	);
}
