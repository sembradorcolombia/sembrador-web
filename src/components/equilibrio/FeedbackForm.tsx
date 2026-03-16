import { useNavigate } from "@tanstack/react-router";
import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEvents } from "@/lib/hooks/useEvents";
import {
	useLookupSubscriber,
	useSaveFeedback,
} from "@/lib/hooks/useFeedbackForm";
import { INTEREST_TOPICS } from "@/lib/validations/connection";

export function FeedbackForm() {
	const navigate = useNavigate();
	const lookupMutation = useLookupSubscriber();
	const saveMutation = useSaveFeedback();
	const { data: events } = useEvents();
	const commentId = useId();

	const [email, setEmail] = useState("");
	const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
	const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
	const [comment, setComment] = useState("");
	const [wantsFutureContact, setWantsFutureContact] = useState(false);

	const subscriptions = lookupMutation.data;

	const handleSearch = (e: FormEvent) => {
		e.preventDefault();
		const trimmed = email.trim().toLowerCase();
		if (!trimmed) return;
		lookupMutation.mutate(trimmed);
	};

	const handleToggleEvent = (subscriptionId: string) => {
		setSelectedEvents((prev) => {
			const next = new Set(prev);
			if (next.has(subscriptionId)) {
				next.delete(subscriptionId);
			} else {
				next.add(subscriptionId);
			}
			return next;
		});
	};

	const handleToggleTopic = (topic: string) => {
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

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (!subscriptions || selectedEvents.size === 0) return;

		saveMutation.mutate(
			{
				eventSubscriptionIds: Array.from(selectedEvents),
				comment,
				topics: Array.from(selectedTopics),
				wantsFutureContact,
			},
			{
				onSuccess: () => {
					navigate({ to: "/equilibrio/feedback-exitoso" });
				},
				onError: (error) => {
					toast.error(
						error instanceof Error
							? error.message
							: "Error al enviar tu opinión",
					);
				},
			},
		);
	};

	// Step 1: Email lookup
	if (!subscriptions || subscriptions.length === 0) {
		return (
			<div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
				<h1 className="font-grotesk-wide-medium text-2xl text-secondary mb-2 text-center">
					Tu opinión
				</h1>
				<p className="text-gray-600 text-sm text-center mb-6">
					Ingresa tu correo electrónico para dejarnos tu opinión
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

					{lookupMutation.isSuccess &&
						(!lookupMutation.data || lookupMutation.data.length === 0) && (
							<p className="text-sm text-gray-600 text-center">
								Solo los asistentes registrados pueden dejar su opinión.
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

	// Step 2: Feedback form
	const firstName = subscriptions[0].subscriberName.split(" ")[0];
	const subscriberName = subscriptions[0].subscriberName;
	const subscriberPhone = subscriptions[0].phone;

	// Map event IDs to names using the events query
	const eventNameMap = new Map(events?.map((e) => [e.id, e.name]) ?? []);

	return (
		<div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
			<h1 className="font-grotesk-wide-medium text-2xl text-secondary mb-2 text-center">
				Hola, {firstName}
			</h1>
			<p className="text-gray-600 text-sm text-center mb-6">
				Nos encantaría conocer tu opinión sobre el evento
			</p>

			<form onSubmit={handleSubmit} className="space-y-5">
				<div>
					<Label>Nombre</Label>
					<Input value={subscriberName} readOnly className="bg-gray-50" />
				</div>

				<div>
					<Label>Teléfono</Label>
					<Input value={subscriberPhone} readOnly className="bg-gray-50" />
				</div>

				<div>
					<Label className="mb-2 block">¿De cuál evento quieres opinar?</Label>
					<div className="space-y-2">
						{subscriptions.map((sub) => {
							const isChecked = selectedEvents.has(sub.subscriptionId);
							const eventName = eventNameMap.get(sub.eventId) ?? "Evento";
							return (
								<label
									key={sub.subscriptionId}
									className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
										isChecked
											? "border-primary/50 bg-primary/5"
											: "border-gray-200 hover:border-primary/50"
									}`}
								>
									<input
										type="checkbox"
										checked={isChecked}
										onChange={() => handleToggleEvent(sub.subscriptionId)}
										className="h-4 w-4 shrink-0 rounded border-gray-300 accent-primary"
									/>
									<span className="text-sm font-medium text-gray-900">
										{eventName}
									</span>
								</label>
							);
						})}
					</div>
				</div>

				<div>
					<Label className="mb-2 block">
						¿Qué temas te interesan para un próximo evento?
					</Label>
					<div className="space-y-2">
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
										onChange={() => handleToggleTopic(topic)}
										className="h-4 w-4 shrink-0 rounded border-gray-300 accent-primary"
									/>
									<span className="text-sm font-medium text-gray-900">
										{topic}
									</span>
								</label>
							);
						})}
					</div>
				</div>

				<div>
					<Label htmlFor={commentId} className="mb-2 block">
						Comentarios
					</Label>
					<textarea
						id={commentId}
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						placeholder="Cuéntanos qué te pareció el evento..."
						rows={4}
						className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					/>
				</div>

				<div>
					<label className="flex items-start gap-3 cursor-pointer">
						<input
							type="checkbox"
							checked={wantsFutureContact}
							onChange={(e) => setWantsFutureContact(e.target.checked)}
							className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 accent-primary"
						/>
						<span className="text-sm text-gray-700">
							¿Deseas que te contactemos para futuros eventos?
						</span>
					</label>
				</div>

				{saveMutation.isError && (
					<p className="text-sm text-red-600 text-center">
						Ocurrió un error. Por favor intenta de nuevo.
					</p>
				)}

				<Button
					type="submit"
					disabled={saveMutation.isPending || selectedEvents.size === 0}
					className="w-full font-grotesk-wide-medium text-lg px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-md"
				>
					{saveMutation.isPending ? "Enviando..." : "Enviar opinión"}
				</Button>
			</form>
		</div>
	);
}
