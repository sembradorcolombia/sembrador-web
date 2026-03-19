import { useNavigate } from "@tanstack/react-router";
import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
	useSaveConnectionData,
	useSubscriptionByEmail,
} from "@/lib/hooks/useConnectionForm";
import { useCreateSubscription } from "@/lib/hooks/useCreateSubscription";
import { useEvents } from "@/lib/hooks/useEvents";
import { connectionDataSchema } from "@/lib/validations/connection";
import { subscriptionFormSchema } from "@/lib/validations/subscription";

interface ConnectionFormProps {
	seriesSlug: string;
}

export function ConnectionForm({ seriesSlug }: ConnectionFormProps) {
	const navigate = useNavigate();
	const lookupMutation = useSubscriptionByEmail();
	const saveMutation = useSaveConnectionData();
	const createSubscription = useCreateSubscription();
	const { data: events } = useEvents();
	const [email, setEmail] = useState("");
	const [wantToConnect, setWantToConnect] = useState<boolean | null>(null);
	const [prayerRequest, setPrayerRequest] = useState("");
	const [showRegisterForm, setShowRegisterForm] = useState(false);

	// Registration form fields
	const [regName, setRegName] = useState("");
	const [regEmail, setRegEmail] = useState("");
	const [regPhone, setRegPhone] = useState("");
	const [regEventId, setRegEventId] = useState("");
	const [regAcceptsPolicy, setRegAcceptsPolicy] = useState(false);
	const [regErrors, setRegErrors] = useState<Record<string, string>>({});
	const regNameId = useId();
	const regEmailId = useId();
	const regPhoneId = useId();
	const regEventFieldId = useId();
	const regPolicyId = useId();
	const prayerRequestId = useId();

	const subscription = lookupMutation.data;

	const handleSearch = (e: FormEvent) => {
		e.preventDefault();
		const trimmed = email.trim().toLowerCase();
		if (!trimmed) return;
		lookupMutation.mutate(trimmed);
	};

	const handleShowRegister = () => {
		setRegEmail(email.trim().toLowerCase());
		setShowRegisterForm(true);
	};

	const handleRegisterSubmit = async (e: FormEvent) => {
		e.preventDefault();

		const formData = {
			name: regName,
			email: regEmail,
			phone: regPhone,
			eventId: regEventId,
			acceptsDataPolicy: regAcceptsPolicy as true,
		};

		const result = subscriptionFormSchema.safeParse(formData);
		if (!result.success) {
			const errors: Record<string, string> = {};
			for (const issue of result.error.issues) {
				const field = issue.path[0]?.toString();
				if (field && !errors[field]) {
					errors[field] = issue.message;
				}
			}
			setRegErrors(errors);
			return;
		}

		setRegErrors({});

		try {
			await createSubscription.mutateAsync(result.data);
			// After successful registration, look up the subscription to get data for the interests step
			const searchEmail = regEmail.trim().toLowerCase();
			lookupMutation.mutate(searchEmail, {
				onSuccess: (lookupResult) => {
					if (lookupResult) {
						setShowRegisterForm(false);
					}
				},
			});
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Error al procesar inscripción",
			);
		}
	};

	const handleSubmit = () => {
		if (!subscription || wantToConnect === null) return;

		const formData = {
			wantToConnect,
			prayerRequest: prayerRequest.trim() || undefined,
		};
		const result = connectionDataSchema.safeParse(formData);

		if (!result.success) {
			toast.error("Datos inválidos");
			return;
		}

		saveMutation.mutate(
			{
				subscriptionId: subscription.subscriptionId,
				data: result.data,
			},
			{
				onSuccess: () => {
					navigate({
						to: "/eventos/$seriesSlug/conexion-exitosa",
						params: { seriesSlug },
					});
				},
				onError: (error) => {
					toast.error(
						error instanceof Error
							? error.message
							: "Error al procesar tu respuesta",
					);
				},
			},
		);
	};

	// Registration form step
	if (!subscription && showRegisterForm) {
		return (
			<div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
				<h1 className="font-grotesk-wide-medium text-2xl text-secondary mb-2 text-center">
					Registro
				</h1>
				<p className="text-gray-600 text-sm text-center mb-6">
					Completa tus datos para inscribirte
				</p>

				<form onSubmit={handleRegisterSubmit} className="space-y-4">
					<div>
						<Label htmlFor={regNameId}>Nombre completo</Label>
						<Input
							id={regNameId}
							value={regName}
							onChange={(e) => setRegName(e.target.value)}
							placeholder="Juan Pérez"
						/>
						{regErrors.name && (
							<p className="text-sm text-red-600 mt-1">{regErrors.name}</p>
						)}
					</div>

					<div>
						<Label htmlFor={regEmailId}>Correo electrónico</Label>
						<Input
							id={regEmailId}
							type="email"
							value={regEmail}
							onChange={(e) => setRegEmail(e.target.value)}
							placeholder="juan@ejemplo.com"
						/>
						{regErrors.email && (
							<p className="text-sm text-red-600 mt-1">{regErrors.email}</p>
						)}
					</div>

					<div>
						<Label htmlFor={regPhoneId}>Teléfono</Label>
						<Input
							id={regPhoneId}
							type="tel"
							value={regPhone}
							onChange={(e) => setRegPhone(e.target.value)}
							placeholder="3001234567"
						/>
						{regErrors.phone && (
							<p className="text-sm text-red-600 mt-1">{regErrors.phone}</p>
						)}
					</div>

					<div>
						<Label htmlFor={regEventFieldId}>Selecciona tu evento</Label>
						<Select
							id={regEventFieldId}
							value={regEventId}
							onChange={(e) => setRegEventId(e.target.value)}
						>
							<option value="">-- Selecciona un evento --</option>
							{events?.map((event) => {
								const slotsAvailable = event.maxCapacity - event.currentCount;
								const isFull = slotsAvailable <= 0;
								return (
									<option key={event.id} value={event.id} disabled={isFull}>
										{event.name} (
										{isFull ? "Lleno" : `${slotsAvailable} cupos disponibles`})
									</option>
								);
							})}
						</Select>
						{regErrors.eventId && (
							<p className="text-sm text-red-600 mt-1">{regErrors.eventId}</p>
						)}
					</div>

					<div>
						<div className="flex items-start gap-2">
							<input
								id={regPolicyId}
								type="checkbox"
								checked={regAcceptsPolicy}
								onChange={(e) => setRegAcceptsPolicy(e.target.checked)}
								className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300"
							/>
							<label htmlFor={regPolicyId} className="text-sm text-gray-700">
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
						{regErrors.acceptsDataPolicy && (
							<p className="text-sm text-red-600 mt-1">
								{regErrors.acceptsDataPolicy}
							</p>
						)}
					</div>

					<Button
						type="submit"
						disabled={createSubscription.isPending || lookupMutation.isPending}
						className="w-full font-grotesk-wide-medium text-lg px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-md"
					>
						{createSubscription.isPending || lookupMutation.isPending
							? "Procesando..."
							: "Inscribirse"}
					</Button>

					<button
						type="button"
						onClick={() => setShowRegisterForm(false)}
						className="w-full text-sm text-gray-500 hover:text-gray-700"
					>
						Volver a buscar
					</button>
				</form>
			</div>
		);
	}

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
						<div className="text-center space-y-3">
							<p className="text-sm text-gray-600">
								No encontramos una inscripción con este correo. ¿Deseas
								registrarte?
							</p>
							<Button
								type="button"
								onClick={handleShowRegister}
								variant="outline"
								className="w-full font-grotesk-wide-medium text-base px-4 py-2 border-primary text-primary hover:bg-primary/5"
							>
								Registrarme
							</Button>
						</div>
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

	// Connection response step
	const firstName = subscription.subscriberName.split(" ")[0];

	return (
		<div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8">
			<h1 className="font-grotesk-wide-medium text-2xl text-secondary mb-2 text-center">
				Hola, {firstName}
			</h1>
			<p className="text-gray-600 text-sm text-center mb-6">
				Nos gustaría conocer tu interés en conectar con nuestra comunidad.
			</p>

			<div className="space-y-6 mb-6">
				<div>
					<Label className="block mb-3 text-sm font-medium text-gray-900">
						¿Te gustaría conectar con nuestra iglesia?
					</Label>
					<div className="space-y-2">
						<label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer border-gray-200 hover:border-primary/50">
							<input
								type="radio"
								name="want_to_connect"
								value="true"
								checked={wantToConnect === true}
								onChange={() => setWantToConnect(true)}
								className="h-4 w-4 accent-primary"
							/>
							<span className="text-sm font-medium text-gray-900">Sí</span>
						</label>
						<label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer border-gray-200 hover:border-primary/50">
							<input
								type="radio"
								name="want_to_connect"
								value="false"
								checked={wantToConnect === false}
								onChange={() => setWantToConnect(false)}
								className="h-4 w-4 accent-primary"
							/>
							<span className="text-sm font-medium text-gray-900">No</span>
						</label>
					</div>
				</div>

				<div>
					<Label
						htmlFor={prayerRequestId}
						className="block mb-2 text-sm font-medium text-gray-900"
					>
						Petición de oración (opcional)
					</Label>
					<textarea
						id={prayerRequestId}
						value={prayerRequest}
						onChange={(e) => setPrayerRequest(e.target.value)}
						placeholder="Cuéntanos cómo podemos orar por ti..."
						className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
						rows={4}
					/>
				</div>
			</div>

			<Button
				type="button"
				onClick={handleSubmit}
				disabled={saveMutation.isPending || wantToConnect === null}
				className="w-full font-grotesk-wide-medium text-lg px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-md"
			>
				{saveMutation.isPending ? "Enviando..." : "Enviar"}
			</Button>
		</div>
	);
}
