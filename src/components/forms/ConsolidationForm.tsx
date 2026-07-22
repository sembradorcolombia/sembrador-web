import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useId } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useCreateConsolidationRegistration } from "@/lib/hooks/useCreateConsolidationRegistration";
import {
	type ConsolidationFormData,
	consolidationFormSchema,
	NEXT_STEP_OPTIONS,
} from "@/lib/validations/consolidation";

interface ConsolidationFormProps {
	defaultNextStep?: string;
}

export function ConsolidationForm({ defaultNextStep }: ConsolidationFormProps) {
	const createRegistration = useCreateConsolidationRegistration();
	const navigate = useNavigate();
	const nameId = useId();
	const lastnameId = useId();
	const mobileId = useId();
	const emailId = useId();
	const nextStepId = useId();
	const commentId = useId();
	const dataPolicyId = useId();

	const form = useForm({
		defaultValues: {
			name: "",
			lastname: "",
			mobile: "",
			email: "",
			nextStep: defaultNextStep || "",
			comment: "",
			acceptsDataPolicy: false,
		} as unknown as ConsolidationFormData,
		onSubmit: async ({ value }) => {
			try {
				await createRegistration.mutateAsync(value);
				navigate({ to: "/consolidacion/registro-exitoso" });
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
							const result =
								consolidationFormSchema.shape.name.safeParse(value);
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
							const result =
								consolidationFormSchema.shape.lastname.safeParse(value);
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
					name="mobile"
					validators={{
						onChange: ({ value }) => {
							const result =
								consolidationFormSchema.shape.mobile.safeParse(value);
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
							<Label htmlFor={mobileId}>Celular</Label>
							<Input
								id={mobileId}
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
					name="email"
					validators={{
						onChange: ({ value }) => {
							const result =
								consolidationFormSchema.shape.email.safeParse(value);
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
					name="nextStep"
					validators={{
						onChange: ({ value }) => {
							const result =
								consolidationFormSchema.shape.nextStep.safeParse(value);
							if (result.success) return undefined;
							return (
								result.error.issues[0]?.message ?? "Debes seleccionar un paso"
							);
						},
					}}
				>
					{(field) => (
						<div className="mb-4">
							<Label htmlFor={nextStepId}>Paso a seguir</Label>
							<Select
								id={nextStepId}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(e.target.value as typeof field.state.value)
								}
							>
								<option value="">-- Selecciona un paso --</option>
								{NEXT_STEP_OPTIONS.map((option) => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
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

				<form.Field
					name="comment"
					validators={{
						onChange: ({ value }) => {
							const result =
								consolidationFormSchema.shape.comment.safeParse(value);
							if (result.success) return undefined;
							return (
								result.error.issues[0]?.message ??
								"El comentario no puede tener más de 500 caracteres"
							);
						},
					}}
				>
					{(field) => (
						<div className="mb-6">
							<Label htmlFor={commentId}>Comentario (opcional)</Label>
							<textarea
								id={commentId}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Cuéntanos brevemente cómo podemos ayudarte"
								rows={4}
								className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
