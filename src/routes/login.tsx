import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useId, useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/services/auth";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
	beforeLoad: async () => {
		const {
			data: { session },
		} = await supabase.auth.getSession();
		if (session?.user?.app_metadata?.is_admin) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: LoginPage,
});

function LoginPage() {
	const navigate = useNavigate();
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
			<Helmet>
				<title>Iniciar sesión — El Sembrador</title>
			</Helmet>
			<div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-md">
				<h1 className="mb-6 text-center text-2xl font-bold">Admin</h1>
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
