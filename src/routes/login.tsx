import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { SeoHead } from "@/components/SeoHead";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, verifyAdminSession } from "@/lib/services/auth";

/**
 * `expired` is set by the route guards when a session is rejected. It is
 * user-visible and user-settable, which is fine — it carries no authority and
 * reveals nothing, it only decides whether a notice renders.
 */
const loginSearchSchema = z.object({
	expired: z.boolean().optional(),
});

export const Route = createFileRoute("/login")({
	validateSearch: loginSearchSchema,
	beforeLoad: async () => {
		// Same server-validated check as /dashboard: a stale stored session must
		// not bounce the visitor to a dashboard that will bounce them back.
		if ((await verifyAdminSession()) === "admin") {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: LoginPage,
});

function LoginPage() {
	const navigate = useNavigate();
	const { expired } = Route.useSearch();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const emailId = useId();
	const passwordId = useId();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			await signIn(email, password);
			navigate({ to: "/dashboard" });
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Error al iniciar sesión",
			);
			setIsSubmitting(false);
		}
	};

	return (
		<main className="flex min-h-screen items-center justify-center bg-gray-50">
			<SeoHead title="Iniciar sesión" />
			<div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-md">
				<h1 className="mb-6 text-center text-2xl font-bold">Admin</h1>
				{expired && (
					<Alert variant="error" className="mb-4 text-sm">
						Tu sesión expiró, vuelve a iniciar sesión
					</Alert>
				)}
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor={emailId}>Correo electrónico</Label>
						<Input
							id={emailId}
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor={passwordId}>Contraseña</Label>
						<Input
							id={passwordId}
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<Button type="submit" disabled={isSubmitting} className="w-full">
						{isSubmitting ? "Ingresando..." : "Ingresar"}
					</Button>
				</form>
			</div>
		</main>
	);
}
