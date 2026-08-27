import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { useId } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useCreateNocheParejasRegistration } from "@/lib/hooks/useCreateNocheParejasRegistration";
import { useNocheParejasEvent } from "@/lib/hooks/useNocheParejasEvent";
import { emailSchema } from "@/lib/validations/email";
import {
	lastnameFieldSchema,
	type NocheParejasFormData,
	nameFieldSchema,
	phoneFieldSchema,
	RELATIONSHIP_OPTIONS,
	relationshipFieldSchema,
} from "@/lib/validations/noche-parejas";

const inputClassName =
	"mt-0 h-10 rounded-lg border-0 bg-[#f2f2f2] px-3 text-sm text-[#222] placeholder:text-[#adadad] focus-visible:ring-[#c960a6]";
const labelClassName = "text-sm text-[#222] font-normal";

function firstError(errors: unknown): string | null {
	if (Array.isArray(errors) && errors.length > 0) {
		return errors.join(", ");
	}
	return null;
}

export function NocheParejasForm() {
	const registration = useCreateNocheParejasRegistration();
	const navigate = useNavigate();
	const { eventId, isLoading: isLoadingEvent } = useNocheParejasEvent();

	const nameId = useId();
	const lastnameId = useId();
	const emailId = useId();
	const phoneId = useId();
	const withConyugeId = useId();
	const conyugeNameId = useId();
	const conyugeLastnameId = useId();
	const conyugeEmailId = useId();
	const conyugePhoneId = useId();
	const relationshipId = useId();
	const dataPolicyId = useId();

	const form = useForm({
		defaultValues: {
			name: "",
			lastname: "",
			email: "",
			phone: "",
			withConyuge: false,
			conyugeName: "",
			conyugeLastname: "",
			conyugeEmail: "",
			conyugePhone: "",
			relationship: "",
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
				const { conyugeAlreadyRegistered } = await registration.mutateAsync({
					...value,
					eventId,
				});

				if (conyugeAlreadyRegistered) {
					toast.warning(
						"Tu cónyuge ya estaba inscrito; vinculamos la relación a su inscripción existente.",
					);
				}

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

	const isPending = registration.isPending || isLoadingEvent;
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
							const result = nameFieldSchema.safeParse(value);
							return result.success
								? undefined
								: (result.error.issues[0]?.message ??
										"El nombre debe tener al menos 2 caracteres");
						},
					}}
				>
					{(field) => (
						<div>
							<Label htmlFor={nameId} className={labelClassName}>
								Nombre:
							</Label>
							<Input
								id={nameId}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className={inputClassName}
								disabled={isPending}
							/>
							{firstError(field.state.meta.errors) && (
								<p className="text-sm text-red-700 mt-1">
									{firstError(field.state.meta.errors)}
								</p>
							)}
						</div>
					)}
				</form.Field>

				<form.Field
					name="lastname"
					validators={{
						onChange: ({ value }) => {
							const result = lastnameFieldSchema.safeParse(value);
							return result.success
								? undefined
								: (result.error.issues[0]?.message ??
										"El apellido debe tener al menos 2 caracteres");
						},
					}}
				>
					{(field) => (
						<div>
							<Label htmlFor={lastnameId} className={labelClassName}>
								Apellido:
							</Label>
							<Input
								id={lastnameId}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className={inputClassName}
								disabled={isPending}
							/>
							{firstError(field.state.meta.errors) && (
								<p className="text-sm text-red-700 mt-1">
									{firstError(field.state.meta.errors)}
								</p>
							)}
						</div>
					)}
				</form.Field>

				<form.Field
					name="email"
					validators={{
						onChange: ({ value }) => {
							const result = emailSchema.safeParse(value);
							return result.success
								? undefined
								: (result.error.issues[0]?.message ??
										"Correo electrónico inválido");
						},
					}}
				>
					{(field) => (
						<div>
							<Label htmlFor={emailId} className={labelClassName}>
								Email:
							</Label>
							<Input
								id={emailId}
								type="email"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className={inputClassName}
								disabled={isPending}
							/>
							{firstError(field.state.meta.errors) && (
								<p className="text-sm text-red-700 mt-1">
									{firstError(field.state.meta.errors)}
								</p>
							)}
						</div>
					)}
				</form.Field>

				<form.Field
					name="phone"
					validators={{
						onChange: ({ value }) => {
							const result = phoneFieldSchema.safeParse(value);
							return result.success
								? undefined
								: (result.error.issues[0]?.message ??
										"El teléfono debe tener 10 dígitos");
						},
					}}
				>
					{(field) => (
						<div>
							<Label htmlFor={phoneId} className={labelClassName}>
								Teléfono:
							</Label>
							<Input
								id={phoneId}
								type="tel"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								className={inputClassName}
								placeholder="3001234567"
								disabled={isPending}
							/>
							{firstError(field.state.meta.errors) && (
								<p className="text-sm text-red-700 mt-1">
									{firstError(field.state.meta.errors)}
								</p>
							)}
						</div>
					)}
				</form.Field>
			</div>

			<div className="mt-4">
				<form.Field name="withConyuge">
					{(field) => (
						<div className="flex items-start gap-2">
							<input
								id={withConyugeId}
								type="checkbox"
								checked={field.state.value === true}
								onChange={(e) =>
									field.handleChange(
										e.target.checked as unknown as typeof field.state.value,
									)
								}
								className="mt-1 h-4 w-4 shrink-0 rounded border-[#adadad] bg-white text-[#c960a6] focus:ring-[#c960a6]"
								disabled={isPending}
							/>
							<label
								htmlFor={withConyugeId}
								className="text-sm text-[#222] leading-snug"
							>
								Quiero registrar también a mi cónyuge
							</label>
						</div>
					)}
				</form.Field>
			</div>

			<form.Subscribe selector={(state) => state.values.withConyuge}>
				{(withConyuge) =>
					withConyuge ? (
						<div className="mt-4">
							<p className="mb-2 text-sm font-semibold leading-[1.2] text-[#222]">
								Datos del cónyuge
							</p>

							<div className="space-y-3">
								<form.Field
									name="conyugeName"
									validators={{
										onChange: ({ value, fieldApi }) => {
											if (!fieldApi.form.getFieldValue("withConyuge"))
												return undefined;
											const result = nameFieldSchema.safeParse(value);
											return result.success
												? undefined
												: (result.error.issues[0]?.message ??
														"El nombre debe tener al menos 2 caracteres");
										},
									}}
								>
									{(field) => (
										<div>
											<Label htmlFor={conyugeNameId} className={labelClassName}>
												Nombre del cónyuge:
											</Label>
											<Input
												id={conyugeNameId}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												className={inputClassName}
												disabled={isPending}
											/>
											{firstError(field.state.meta.errors) && (
												<p className="text-sm text-red-700 mt-1">
													{firstError(field.state.meta.errors)}
												</p>
											)}
										</div>
									)}
								</form.Field>

								<form.Field
									name="conyugeLastname"
									validators={{
										onChange: ({ value, fieldApi }) => {
											if (!fieldApi.form.getFieldValue("withConyuge"))
												return undefined;
											const result = lastnameFieldSchema.safeParse(value);
											return result.success
												? undefined
												: (result.error.issues[0]?.message ??
														"El apellido debe tener al menos 2 caracteres");
										},
									}}
								>
									{(field) => (
										<div>
											<Label
												htmlFor={conyugeLastnameId}
												className={labelClassName}
											>
												Apellido del cónyuge:
											</Label>
											<Input
												id={conyugeLastnameId}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												className={inputClassName}
												disabled={isPending}
											/>
											{firstError(field.state.meta.errors) && (
												<p className="text-sm text-red-700 mt-1">
													{firstError(field.state.meta.errors)}
												</p>
											)}
										</div>
									)}
								</form.Field>

								<form.Field
									name="conyugeEmail"
									validators={{
										onChange: ({ value, fieldApi }) => {
											if (!fieldApi.form.getFieldValue("withConyuge"))
												return undefined;
											const result = emailSchema.safeParse(value);
											return result.success
												? undefined
												: (result.error.issues[0]?.message ??
														"Correo electrónico inválido");
										},
									}}
								>
									{(field) => (
										<div>
											<Label
												htmlFor={conyugeEmailId}
												className={labelClassName}
											>
												Email del cónyuge:
											</Label>
											<Input
												id={conyugeEmailId}
												type="email"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												className={inputClassName}
												disabled={isPending}
											/>
											{firstError(field.state.meta.errors) && (
												<p className="text-sm text-red-700 mt-1">
													{firstError(field.state.meta.errors)}
												</p>
											)}
										</div>
									)}
								</form.Field>

								<form.Field
									name="conyugePhone"
									validators={{
										onChange: ({ value, fieldApi }) => {
											if (!fieldApi.form.getFieldValue("withConyuge"))
												return undefined;
											const result = phoneFieldSchema.safeParse(value);
											return result.success
												? undefined
												: (result.error.issues[0]?.message ??
														"El teléfono debe tener 10 dígitos");
										},
									}}
								>
									{(field) => (
										<div>
											<Label
												htmlFor={conyugePhoneId}
												className={labelClassName}
											>
												Teléfono del cónyuge:
											</Label>
											<Input
												id={conyugePhoneId}
												type="tel"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												className={inputClassName}
												placeholder="3001234567"
												disabled={isPending}
											/>
											{firstError(field.state.meta.errors) && (
												<p className="text-sm text-red-700 mt-1">
													{firstError(field.state.meta.errors)}
												</p>
											)}
										</div>
									)}
								</form.Field>

								<form.Field
									name="relationship"
									validators={{
										onChange: ({ value, fieldApi }) => {
											if (!fieldApi.form.getFieldValue("withConyuge"))
												return undefined;
											const result = relationshipFieldSchema.safeParse(value);
											return result.success
												? undefined
												: (result.error.issues[0]?.message ??
														"Debes seleccionar una opción");
										},
									}}
								>
									{(field) => (
										<div>
											<Label
												htmlFor={relationshipId}
												className={labelClassName}
											>
												Relación:
											</Label>
											<Select
												id={relationshipId}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) =>
													field.handleChange(
														e.target.value as typeof field.state.value,
													)
												}
												className="mt-0 h-10 rounded-lg border-0 bg-[#f2f2f2] px-3 text-sm text-[#222] focus-visible:ring-[#c960a6]"
												disabled={isPending}
											>
												<option value="">-- Selecciona una opción --</option>
												{RELATIONSHIP_OPTIONS.map((option) => (
													<option key={option} value={option}>
														{option}
													</option>
												))}
											</Select>
											{firstError(field.state.meta.errors) && (
												<p className="text-sm text-red-700 mt-1">
													{firstError(field.state.meta.errors)}
												</p>
											)}
										</div>
									)}
								</form.Field>
							</div>
						</div>
					) : null
				}
			</form.Subscribe>

			<div className="mt-4">
				<form.Field
					name="acceptsDataPolicy"
					validators={{
						onChange: ({ value }) =>
							value === true
								? undefined
								: "Debes aceptar la política de tratamiento de datos",
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
							{firstError(field.state.meta.errors) && (
								<p className="text-sm text-red-700 mt-1">
									{firstError(field.state.meta.errors)}
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
					{registration.isPending ? "Registrando..." : "Registrarse"}
				</Button>
			</div>
		</form>
	);
}
