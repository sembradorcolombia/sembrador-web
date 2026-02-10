import { useForm } from "@tanstack/react-form";
import { useId, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useCreateSubscription } from "@/lib/hooks/useCreateSubscription";
import type { Event } from "@/lib/services/events";
import {
	type SubscriptionFormData,
	subscriptionFormSchema,
} from "@/lib/validations/subscription";

interface SubscriptionFormProps {
	events: Event[];
}

export function SubscriptionForm({ events }: SubscriptionFormProps) {
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const createSubscription = useCreateSubscription();
	const nameId = useId();
	const emailId = useId();
	const phoneId = useId();
	const eventId = useId();

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			eventId: "",
		} as SubscriptionFormData,
		onSubmit: async ({ value }) => {
			setSubmitSuccess(false);
			try {
				await createSubscription.mutateAsync(value);
				setSubmitSuccess(true);
				form.reset();
			} catch (_error) {
				// Error is handled by mutation state
			}
		},
	});

	return (
		<div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
			{submitSuccess && (
				<Alert variant="success" className="mb-4">
					¡Inscripción exitosa! Te esperamos en el evento.
				</Alert>
			)}

			{createSubscription.isError && (
				<Alert variant="error" className="mb-4">
					{createSubscription.error?.message ?? "Error al procesar inscripción"}
				</Alert>
			)}

			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<form.Field
					name="name"
					validators={{
						onChange: ({ value }) => {
							try {
								subscriptionFormSchema.shape.name.parse(value);
								return undefined;
							} catch (error) {
								return "El nombre debe tener al menos 2 caracteres";
							}
						},
					}}
				>
					{(field) => (
						<div className="mb-4">
							<Label htmlFor={nameId}>Nombre completo</Label>
							<Input
								id={nameId}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Juan Pérez"
							/>
							{field.state.meta.errors &&
								field.state.meta.errors.length > 0 && (
									<p className="text-sm text-red-600 mt-1">
										{Array.isArray(field.state.meta.errors)
											? field.state.meta.errors.join(", ")
											: field.state.meta.errors}
									</p>
								)}
						</div>
					)}
				</form.Field>

				<form.Field
					name="email"
					validators={{
						onChange: ({ value }) => {
							try {
								subscriptionFormSchema.shape.email.parse(value);
								return undefined;
							} catch (error) {
								return "Correo electrónico inválido";
							}
						},
					}}
				>
					{(field) => (
						<div className="mb-4">
							<Label htmlFor={emailId}>Correo electrónico</Label>
							<Input
								id={emailId}
								type="email"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="juan@ejemplo.com"
							/>
							{field.state.meta.errors &&
								field.state.meta.errors.length > 0 && (
									<p className="text-sm text-red-600 mt-1">
										{Array.isArray(field.state.meta.errors)
											? field.state.meta.errors.join(", ")
											: field.state.meta.errors}
									</p>
								)}
						</div>
					)}
				</form.Field>

				<form.Field
					name="phone"
					validators={{
						onChange: ({ value }) => {
							try {
								subscriptionFormSchema.shape.phone.parse(value);
								return undefined;
							} catch (error) {
								return "El teléfono debe tener 10 dígitos";
							}
						},
					}}
				>
					{(field) => (
						<div className="mb-4">
							<Label htmlFor={phoneId}>Teléfono</Label>
							<Input
								id={phoneId}
								type="tel"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="3001234567"
							/>
							{field.state.meta.errors &&
								field.state.meta.errors.length > 0 && (
									<p className="text-sm text-red-600 mt-1">
										{Array.isArray(field.state.meta.errors)
											? field.state.meta.errors.join(", ")
											: field.state.meta.errors}
									</p>
								)}
						</div>
					)}
				</form.Field>

				<form.Field
					name="eventId"
					validators={{
						onChange: ({ value }) => {
							try {
								subscriptionFormSchema.shape.eventId.parse(value);
								return undefined;
							} catch (error) {
								return "Debes seleccionar un evento";
							}
						},
					}}
				>
					{(field) => (
						<div className="mb-6">
							<Label htmlFor={eventId}>Selecciona tu evento</Label>
							<Select
								id={eventId}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							>
								<option value="">-- Selecciona un evento --</option>
								{events.map((event) => {
									const slotsAvailable = event.maxCapacity - event.currentCount;
									const isFull = slotsAvailable <= 0;
									return (
										<option key={event.id} value={event.id} disabled={isFull}>
											{event.name} (
											{isFull ? "Lleno" : `${slotsAvailable} cupos disponibles`}
											)
										</option>
									);
								})}
							</Select>
							{field.state.meta.errors &&
								field.state.meta.errors.length > 0 && (
									<p className="text-sm text-red-600 mt-1">
										{Array.isArray(field.state.meta.errors)
											? field.state.meta.errors.join(", ")
											: field.state.meta.errors}
									</p>
								)}
						</div>
					)}
				</form.Field>

				<Button
					type="submit"
					disabled={createSubscription.isPending}
					className="w-full"
				>
					{createSubscription.isPending ? "Procesando..." : "Inscribirse"}
				</Button>
			</form>
		</div>
	);
}
