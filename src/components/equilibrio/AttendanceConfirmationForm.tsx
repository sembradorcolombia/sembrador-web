import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	useConfirmAttendance,
	useSubscriptionsByToken,
} from "@/lib/hooks/useConfirmAttendance";

interface AttendanceConfirmationFormProps {
	token?: string;
}

export function AttendanceConfirmationForm({
	token,
}: AttendanceConfirmationFormProps) {
	const navigate = useNavigate();
	const {
		data: subscriptions,
		isLoading,
		isError,
	} = useSubscriptionsByToken(token);
	const mutation = useConfirmAttendance();
	const [selectedEventIds, setSelectedEventIds] = useState<Set<string>>(
		new Set(),
	);
	const [initialized, setInitialized] = useState(false);

	// Pre-select unconfirmed events once data loads
	if (subscriptions && !initialized) {
		const unconfirmed = subscriptions
			.filter((s) => !s.confirmedAt)
			.map((s) => s.eventId);
		setSelectedEventIds(new Set(unconfirmed));
		setInitialized(true);
	}

	if (!token) {
		return <InvalidLinkMessage />;
	}

	if (isLoading) {
		return <p className="text-white text-xl">Cargando...</p>;
	}

	if (isError) {
		return (
			<div className="text-center max-w-md">
				<h1 className="font-grotesk-wide-medium text-3xl text-white mb-4">
					Error
				</h1>
				<p className="text-white">
					Ocurrió un error al cargar tus inscripciones. Por favor intenta de
					nuevo.
				</p>
			</div>
		);
	}

	if (!subscriptions || subscriptions.length === 0) {
		return <InvalidLinkMessage />;
	}

	const allConfirmed = subscriptions.every((s) => s.confirmedAt);
	const unconfirmedSelected = subscriptions.filter(
		(s) => !s.confirmedAt && selectedEventIds.has(s.eventId),
	);

	const handleToggle = (eventId: string) => {
		setSelectedEventIds((prev) => {
			const next = new Set(prev);
			if (next.has(eventId)) {
				next.delete(eventId);
			} else {
				next.add(eventId);
			}
			return next;
		});
	};

	const handleSubmit = () => {
		if (!token || unconfirmedSelected.length === 0) return;
		mutation.mutate(
			{
				token,
				eventIds: unconfirmedSelected.map((s) => s.eventId),
			},
			{
				onSuccess: (result) => {
					if (result === "confirmed") {
						navigate({ to: "/equilibrio/asistencia-confirmada" });
					}
				},
			},
		);
	};

	return (
		<div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
			<h1 className="font-grotesk-wide-medium text-2xl text-secondary mb-2 text-center">
				Confirmar asistencia
			</h1>
			<p className="text-gray-600 text-sm text-center mb-6">
				Selecciona los eventos a los que asistirás
			</p>

			<div className="space-y-3 mb-6">
				{subscriptions.map((sub) => {
					const isConfirmed = !!sub.confirmedAt;
					const isChecked = isConfirmed || selectedEventIds.has(sub.eventId);

					return (
						<label
							key={sub.subscriptionId}
							className={`flex items-center gap-3 p-3 rounded-lg border ${
								isConfirmed
									? "border-green-200 bg-green-50"
									: "border-gray-200 hover:border-primary/50 cursor-pointer"
							}`}
						>
							<input
								type="checkbox"
								checked={isChecked}
								disabled={isConfirmed}
								onChange={() => handleToggle(sub.eventId)}
								className="h-4 w-4 shrink-0 rounded border-gray-300"
							/>
							<div className="flex-1 min-w-0">
								<span
									className={`block text-sm font-medium ${isConfirmed ? "text-green-700" : "text-gray-900"}`}
								>
									{sub.eventName}
								</span>
								{isConfirmed && (
									<span className="text-xs text-green-600">Ya confirmado</span>
								)}
							</div>
						</label>
					);
				})}
			</div>

			{mutation.isError && (
				<p className="text-sm text-red-600 mb-4 text-center">
					Ocurrió un error. Por favor intenta de nuevo.
				</p>
			)}

			{mutation.data === "not_found" && (
				<p className="text-sm text-red-600 mb-4 text-center">
					No se encontró la inscripción. Verifica tu enlace.
				</p>
			)}

			{mutation.data === "already_confirmed" && (
				<p className="text-sm text-amber-600 mb-4 text-center">
					Los eventos seleccionados ya fueron confirmados.
				</p>
			)}

			{!allConfirmed && (
				<Button
					type="button"
					onClick={handleSubmit}
					disabled={mutation.isPending || unconfirmedSelected.length === 0}
					className="w-full font-grotesk-wide-medium text-lg px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-md"
				>
					{mutation.isPending ? "Confirmando..." : "Confirmar asistencia"}
				</Button>
			)}

			{allConfirmed && (
				<p className="text-center text-green-700 font-grotesk-wide-medium">
					¡Ya confirmaste todos tus eventos!
				</p>
			)}
		</div>
	);
}

function InvalidLinkMessage() {
	return (
		<div className="text-center max-w-md">
			<h1 className="font-grotesk-wide-medium text-3xl text-white mb-4">
				Enlace inválido
			</h1>
			<p className="text-white">
				Este enlace no corresponde a ninguna inscripción. Verifica el enlace que
				recibiste.
			</p>
		</div>
	);
}
