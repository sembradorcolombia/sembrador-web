import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useId } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateDesayunoRegistration } from "@/lib/hooks/useCreateDesayunoRegistration";
import {
	type DesayunoFormData,
	desayunoFormSchema,
} from "@/lib/validations/desayuno";

export function DesayunoForm() {
	const createRegistration = useCreateDesayunoRegistration();
	const navigate = useNavigate();
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
		} as unknown as DesayunoFormData,
		onSubmit: async ({ value }) => {
			try {
				await createRegistration.mutateAsync(value);
				navigate({ to: "/desayuno/registro-exitoso" });
			} catch (error) {
				toast.error(
					error instanceof Error
						? error.message
						: "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
				);
			}
		},
	});

	return (
		<div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
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
							const result = desayunoFormSchema.shape.name.safeParse(value);
							if (result.success) return undefined;
							return (
								result.error.issues[0]?.message ??
								"El nombre debe tener al menos 2 caracteres"
							);
						},
					}}
				>
					{(field) => (
						<div className="mb-4">
							<Label htmlFor={nameId}>Nombre</Label>
							<Input
								id={nameId}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Juan"
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
					name="lastname"
					validators={{
						onChange: ({ value }) => {
							const result = desayunoFormSchema.shape.lastname.safeParse(value);
							if (result.success) return undefined;
							return (
								result.error.issues[0]?.message ??
								"El apellido debe tener al menos 2 caracteres"
							);
						},
					}}
				>
					{(field) => (
						<div className="mb-4">
							<Label htmlFor={lastnameId}>Apellido</Label>
							<Input
								id={lastnameId}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Pérez"
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
							const result = desayunoFormSchema.shape.email.safeParse(value);
							if (result.success) return undefined;
							return (
								result.error.issues[0]?.message ?? "Correo electrónico inválido"
							);
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
							const result = desayunoFormSchema.shape.phone.safeParse(value);
							if (result.success) return undefined;
							return (
								result.error.issues[0]?.message ??
								"El teléfono debe tener 10 dígitos"
							);
						},
					}}
				>
					{(field) => (
						<div className="mb-4">
							<Label htmlFor={phoneId}>Celular</Label>
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
						<div className="mb-6">
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
									className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300"
								/>
								<label htmlFor={dataPolicyId} className="text-sm text-gray-700">
									Autorizo el tratamiento de mis datos personales conforme a la{" "}
									<a
										href="/politica-de-datos"
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 underline hover:text-blue-800"
									>
										Política de tratamiento de datos
									</a>
								</label>
							</div>
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
					disabled={createRegistration.isPending}
					className="w-full font-grotesk-wide-medium text-lg px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-md"
				>
					{createRegistration.isPending ? "Procesando..." : "Registrarme"}
				</Button>
			</form>
		</div>
	);
}
