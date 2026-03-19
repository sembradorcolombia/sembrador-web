import type { LinkProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Instagram, Youtube } from "lucide-react";

interface FooterLink {
	label: string;
	to: LinkProps["to"];
}

const FOOTER_NAV_LINKS: FooterLink[] = [
	{ label: "Inicio", to: "/" },
	{ label: "Blog", to: "/blog" as LinkProps["to"] },
	{ label: "Acerca", to: "/acerca" as LinkProps["to"] },
	{ label: "Eventos", to: "/eventos" as LinkProps["to"] },
	{ label: "Siguientes Pasos", to: "/siguientes-pasos" as LinkProps["to"] },
	{ label: "Dar", to: "/dar" as LinkProps["to"] },
];

const SOCIAL_LINKS = [
	{
		label: "Instagram",
		href: "https://www.instagram.com/elsembradorcolombia",
		icon: Instagram,
	},
	{
		label: "YouTube",
		href: "https://www.youtube.com/@elsembradorcolombia",
		icon: Youtube,
	},
];

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gray-900 text-gray-300">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
					{/* Church info */}
					<div>
						<img
							src="/header-logo.svg"
							alt="El Sembrador"
							className="mb-4 h-8 brightness-0 invert"
						/>
						<p className="text-sm leading-relaxed text-gray-400">
							Iglesia El Sembrador Colombia
						</p>
					</div>

					{/* Quick links */}
					<div>
						<h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
							Navegación
						</h3>
						<ul className="space-y-2">
							{FOOTER_NAV_LINKS.map((link) => (
								<li key={link.label}>
									<Link
										to={link.to}
										className="text-sm text-gray-400 transition-colors hover:text-white"
									>
										{link.label}
									</Link>
								</li>
							))}
							<li>
								<Link
									to="/politica-de-datos"
									className="text-sm text-gray-400 transition-colors hover:text-white"
								>
									Política de datos
								</Link>
							</li>
						</ul>
					</div>

					{/* Social links */}
					<div>
						<h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
							Síguenos
						</h3>
						<div className="flex gap-4">
							{SOCIAL_LINKS.map((social) => (
								<a
									key={social.label}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
									aria-label={social.label}
								>
									<social.icon size={20} />
								</a>
							))}
						</div>
					</div>
				</div>

				{/* Copyright */}
				<div className="mt-8 border-t border-gray-800 pt-8 text-center">
					<p className="text-sm text-gray-500">
						&copy; {currentYear} Iglesia El Sembrador Colombia. Todos los
						derechos reservados.
					</p>
				</div>
			</div>
		</footer>
	);
}
