import { Loader2, Search } from "lucide-react";
import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { useUpdateAttendance } from "@/lib/hooks/useUpdateAttendance";
import type { EventWithSubscriptions } from "@/lib/services/dashboard";

interface SubscriberSearchProps {
	data: EventWithSubscriptions[];
}

export function SubscriberSearch({ data }: SubscriberSearchProps) {
	const searchId = useId();
	const [query, setQuery] = useState("");
	const attendanceMutation = useUpdateAttendance();

	const results =
		query.length >= 3
			? data.flatMap((event) =>
					event.subscriptions
						.filter((sub) =>
							sub.email.toLowerCase().includes(query.toLowerCase()),
						)
						.map((sub) => ({ ...sub, eventName: event.name })),
				)
			: [];

	return (
		<div className="rounded-lg bg-white p-6 shadow">
			<label
				htmlFor={searchId}
				className="mb-2 block text-sm font-medium text-gray-700"
			>
				Buscar inscrito por email
			</label>
			<div className="relative">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
				<Input
					id={searchId}
					type="text"
					placeholder="Escribe un email..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="pl-10"
				/>
			</div>

			{query.length >= 3 && (
				<div className="mt-4">
					{results.length === 0 ? (
						<p className="text-sm text-gray-500">
							No se encontraron resultados
						</p>
					) : (
						<ul className="divide-y text-sm">
							{results.map((r) => {
								const isPending =
									attendanceMutation.isPending &&
									attendanceMutation.variables?.subscriptionId === r.id;
								return (
									<li
										key={`${r.id}-${r.event_id}`}
										className="flex items-center gap-2 py-2"
									>
										<span className="flex items-center">
											{isPending ? (
												<Loader2 className="h-4 w-4 animate-spin text-gray-400" />
											) : (
												<input
													type="checkbox"
													checked={r.attended}
													onChange={() =>
														attendanceMutation.mutate({
															subscriptionId: r.id,
															attended: !r.attended,
														})
													}
													className="h-4 w-4 cursor-pointer accent-amber-500"
													title="Marcar asistencia"
												/>
											)}
										</span>
										<span className="font-medium">{r.name}</span>
										{" — "}
										<span className="text-gray-600">{r.email}</span>
										{" — "}
										<span className="text-gray-600">{r.phone}</span>
										<span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
											{r.eventName}
										</span>
									</li>
								);
							})}
						</ul>
					)}
				</div>
			)}
		</div>
	);
}
