import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { useId } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateSubscription } from "@/lib/hooks/useCreateSubscription";
import { useNocheParejasEvent } from "@/lib/hooks/useNocheParejasEvent";
import {
	type NocheParejasFormData,
	nocheParejasFormSchema,
} from "@/lib/validations/noche-parejas";

export function NocheParejasForm() {
	const createSubscription = useCreateSubscription();
	const navigate = useNavigate();
	const { eventId, isLoading: isLoadingEvent } = useNocheParejasEvent();

	const nameId = useId();
	const lastnameId = useId();
	const emailId = useId();
	const phoneId = useId();
	const dataPolicyId = useId();

	const form = useForm({
		defaultValues: {
			name: "",
			lastname: "",
			email: "",
			phone: "",
			acceptsDataPolicy: false,
		} as unknown as NocheParejasFormData,
		onSubmit: async ({ value }) => {
			if (!eventId) {
				toast.error(
					"No se encontró el evento. Por favor recarga la página e intenta de nuevo.",
				);
				return;
			}

			try {
				await createSubscription.mutateAsync({
					name: `${value.name} ${value.lastname}`.trim(),
					email: value.email,
					phone: value.phone,
					eventId,
					acceptsDataPolicy: value.acceptsDataPolicy,
				});
				navigate({ to: "/noche-parejas/registro-exitoso" });
			} catch (error) {
				toast.error(
					error instanceof Error
						? error.message
						: "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
				);
			}
		},
	});

	const isPending = createSubscription.isPending || isLoadingEvent;
	const submitDisabled = isPending || !eventId;

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className="w-full"
		>
			<div className="space-y-3">
				<form.Field
					name="name"
					validators={{
						onChange: ({ value }) => {
							const result = nocheParejasFormSchema.shape.name.safeParse(value);
							if (result.success) return undefined;
							return (
								result.error.issues[0]?.message ??
								"El nombre debe tener al menos 2 caracteres"
							);
						},
					}}
				>
					{(field) => (
						<div>
							<Label
								htmlFor={nameId}
								className="text-sm text-[#222] font-normal"
							>
								Nombre:
							</Label>
							<Input
								id={nameId}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="mt-0 h-10 rounded-lg border-0 bg-[#f2f2f2] px-3 text-sm text-[#222] placeholder:text-[#adadad] focus-visible:ring-[#c960a6]"
								disabled={isPending}
							/>
							{field.state.meta.errors &&
								field.state.meta.errors.length > 0 && (
									<p className="text-sm text-red-700 mt-1">
										{Array.isArray(field.state.meta.errors)
											? field.state.meta.errors.join(", ")
											: field.state.meta.errors}
									</p>
								)}
						</div>
					)}
				</form.Field>

				<form.Field
					name="lastname"
					validators={{
						onChange: ({ value }) => {
							const result =
								nocheParejasFormSchema.shape.lastname.safeParse(value);
							if (result.success) return undefined;
							return (
								result.error.issues[0]?.message ??
								"El apellido debe tener al menos 2 caracteres"
							);
						},
					}}
				>
					{(field) => (
						<div>
							<Label
								htmlFor={lastnameId}
								className="text-sm text-[#222] font-normal"
							>
								Apellido:
							</Label>
							<Input
								id={lastnameId}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="mt-0 h-10 rounded-lg border-0 bg-[#f2f2f2] px-3 text-sm text-[#222] placeholder:text-[#adadad] focus-visible:ring-[#c960a6]"
								disabled={isPending}
							/>
							{field.state.meta.errors &&
								field.state.meta.errors.length > 0 && (
									<p className="text-sm text-red-700 mt-1">
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
							const result =
								nocheParejasFormSchema.shape.email.safeParse(value);
							if (result.success) return undefined;
							return (
								result.error.issues[0]?.message ?? "Correo electrónico inválido"
							);
						},
					}}
				>
					{(field) => (
						<div>
							<Label
								htmlFor={emailId}
								className="text-sm text-[#222] font-normal"
							>
								Email:
							</Label>
							<Input
								id={emailId}
								type="email"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="mt-0 h-10 rounded-lg border-0 bg-[#f2f2f2] px-3 text-sm text-[#222] placeholder:text-[#adadad] focus-visible:ring-[#c960a6]"
								disabled={isPending}
							/>
							{field.state.meta.errors &&
								field.state.meta.errors.length > 0 && (
									<p className="text-sm text-red-700 mt-1">
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
							const result =
								nocheParejasFormSchema.shape.phone.safeParse(value);
							if (result.success) return undefined;
							return (
								result.error.issues[0]?.message ??
								"El teléfono debe tener 10 dígitos"
							);
						},
					}}
				>
					{(field) => (
						<div>
							<Label
								htmlFor={phoneId}
								className="text-sm text-[#222] font-normal"
							>
								Teléfono:
							</Label>
							<Input
								id={phoneId}
								type="tel"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className="mt-0 h-10 rounded-lg border-0 bg-[#f2f2f2] px-3 text-sm text-[#222] placeholder:text-[#adadad] focus-visible:ring-[#c960a6]"
								placeholder="3001234567"
								disabled={isPending}
							/>
							{field.state.meta.errors &&
								field.state.meta.errors.length > 0 && (
									<p className="text-sm text-red-700 mt-1">
										{Array.isArray(field.state.meta.errors)
											? field.state.meta.errors.join(", ")
											: field.state.meta.errors}
									</p>
								)}
						</div>
					)}
				</form.Field>
			</div>

			<p className="mt-4 text-sm leading-[1.2] text-[#222]">
				* Solo es necesario que se registre uno de los conyuges
			</p>

			<div className="mt-2">
				<form.Field
					name="acceptsDataPolicy"
					validators={{
						onChange: ({ value }) => {
							if (value !== true) {
								return "Debes aceptar la política de tratamiento de datos";
							}
							return undefined;
						},
					}}
				>
					{(field) => (
						<div>
							<div className="flex items-start gap-2">
								<input
									id={dataPolicyId}
									type="checkbox"
									checked={field.state.value === true}
									onBlur={field.handleBlur}
									onChange={(e) =>
										field.handleChange(
											e.target.checked as unknown as typeof field.state.value,
										)
									}
									className="mt-1 h-4 w-4 shrink-0 rounded border-[#adadad] bg-white text-[#c960a6] focus:ring-[#c960a6]"
									disabled={isPending}
								/>
								<label
									htmlFor={dataPolicyId}
									className="text-sm text-[#222] leading-snug"
								>
									Autorizo el tratamiento de mis datos personales conforme a la{" "}
									<Link
										to="/politica-de-datos"
										target="_blank"
										rel="noopener noreferrer"
										className="underline hover:text-[#c960a6]"
									>
										Política de tratamiento de datos
									</Link>
									.
								</label>
							</div>
							{field.state.meta.errors &&
								field.state.meta.errors.length > 0 && (
									<p className="text-sm text-red-700 mt-1">
										{Array.isArray(field.state.meta.errors)
											? field.state.meta.errors.join(", ")
											: field.state.meta.errors}
									</p>
								)}
						</div>
					)}
				</form.Field>
			</div>

			<div className="mt-8 flex justify-center">
				<Button
					type="submit"
					disabled={submitDisabled}
					className="h-[71px] w-full rounded-3xl bg-[#c960a6] px-4 text-[32px] font-bold uppercase tracking-wide text-white hover:bg-[#b05090] disabled:opacity-60 lg:w-[349px]"
				>
					{createSubscription.isPending ? "Registrando..." : "Registrarse"}
				</Button>
			</div>
		</form>
	);
}
