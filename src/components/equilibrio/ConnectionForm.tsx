import { useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	useSaveInterests,
	useSubscriptionByEmail,
} from "@/lib/hooks/useConnectionForm";
import { INTEREST_TOPICS } from "@/lib/validations/connection";

export function ConnectionForm() {
	const navigate = useNavigate();
	const lookupMutation = useSubscriptionByEmail();
	const saveMutation = useSaveInterests();
	const [email, setEmail] = useState("");
	const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());

	const subscription = lookupMutation.data;

	const handleSearch = (e: FormEvent) => {
		e.preventDefault();
		const trimmed = email.trim().toLowerCase();
		if (!trimmed) return;
		lookupMutation.mutate(trimmed, {
			onSuccess: (result) => {
				if (result?.existingTopics.length) {
					setSelectedTopics(new Set(result.existingTopics));
				}
			},
		});
	};

	const handleToggle = (topic: string) => {
		setSelectedTopics((prev) => {
			const next = new Set(prev);
			if (next.has(topic)) {
				next.delete(topic);
			} else {
				next.add(topic);
			}
			return next;
		});
	};

	const handleSubmit = () => {
		if (!subscription || selectedTopics.size === 0) return;
		saveMutation.mutate(
			{
				eventSubscriptionId: subscription.subscriptionId,
				topics: Array.from(selectedTopics),
			},
			{
				onSuccess: () => {
					navigate({ to: "/equilibrio/conexion-exitosa" });
				},
			},
		);
	};

	// Email search step
	if (!subscription) {
		return (
			<div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
				<h1 className="font-grotesk-wide-medium text-2xl text-secondary mb-2 text-center">
					Conexión
				</h1>
				<p className="text-gray-600 text-sm text-center mb-6">
					Ingresa tu correo electrónico para continuar
				</p>

				<form onSubmit={handleSearch} className="space-y-4">
					<Input
						type="email"
						placeholder="tu@correo.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>

					{lookupMutation.isError && (
						<p className="text-sm text-red-600 text-center">
							Ocurrió un error. Por favor intenta de nuevo.
						</p>
					)}

					{lookupMutation.isSuccess && !lookupMutation.data && (
						<p className="text-sm text-red-600 text-center">
							No encontramos una inscripción con este correo.
						</p>
					)}

					<Button
						type="submit"
						disabled={lookupMutation.isPending}
						className="w-full font-grotesk-wide-medium text-lg px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-md"
					>
						{lookupMutation.isPending ? "Buscando..." : "Buscar"}
					</Button>
				</form>
			</div>
		);
	}

	// Topics selection step
	const firstName = subscription.subscriberName.split(" ")[0];

	return (
		<div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
			<h1 className="font-grotesk-wide-medium text-2xl text-secondary mb-2 text-center">
				Hola, {firstName}
			</h1>
			<p className="text-gray-600 text-sm text-center mb-6">
				Nos gustaría conocer qué otros temas te interesan para un próximo
				evento:
			</p>

			<div className="space-y-3 mb-6">
				{INTEREST_TOPICS.map((topic) => {
					const isChecked = selectedTopics.has(topic);

					return (
						<label
							key={topic}
							className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
								isChecked
									? "border-primary/50 bg-primary/5"
									: "border-gray-200 hover:border-primary/50"
							}`}
						>
							<input
								type="checkbox"
								checked={isChecked}
								onChange={() => handleToggle(topic)}
								className="h-4 w-4 shrink-0 rounded border-gray-300 accent-primary"
							/>
							<span className="text-sm font-medium text-gray-900">{topic}</span>
						</label>
					);
				})}
			</div>

			{saveMutation.isError && (
				<p className="text-sm text-red-600 mb-4 text-center">
					Ocurrió un error. Por favor intenta de nuevo.
				</p>
			)}

			<Button
				type="button"
				onClick={handleSubmit}
				disabled={saveMutation.isPending || selectedTopics.size === 0}
				className="w-full font-grotesk-wide-medium text-lg px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-md"
			>
				{saveMutation.isPending ? "Enviando..." : "Enviar"}
			</Button>
		</div>
	);
}
