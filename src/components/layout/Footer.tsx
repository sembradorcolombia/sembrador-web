import type { LinkProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
	Facebook,
	Instagram,
	Mail,
	MapPin,
	Music2,
	Phone,
	Youtube,
} from "lucide-react";
import { useSiteSettings } from "@/lib/hooks/useSiteSettings";

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

const PLATFORM_ICONS: Record<string, LucideIcon> = {
	instagram: Instagram,
	youtube: Youtube,
	facebook: Facebook,
	tiktok: Music2,
};

const FALLBACK_TAGLINE = "Iglesia El Sembrador Colombia";

export function Footer() {
	const currentYear = new Date().getFullYear();
	const { data: siteSettings } = useSiteSettings();

	const tagline = siteSettings?.footerTagline ?? FALLBACK_TAGLINE;
	const socialLinks = siteSettings?.socialLinks ?? [];
	const address = siteSettings?.address;
	const contactPhone = siteSettings?.contactPhone;
	const contactEmail = siteSettings?.contactEmail;

	const hasContactInfo = address || contactPhone || contactEmail;

	return (
		<footer className="bg-gray-900 text-gray-300">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-4">
					{/* Church info */}
					<div>
						<img
							src="/brand/logo-el-sembrador-hw.svg"
							alt="El Sembrador"
							className="mb-4 h-10"
						/>
						<p className="text-sm leading-relaxed text-gray-400">{tagline}</p>
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

					{/* Contact info */}
					{hasContactInfo && (
						<div>
							<h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
								Contacto
							</h3>
							<ul className="space-y-2">
								{address && (
									<li className="flex items-start gap-2 text-sm text-gray-400">
										<MapPin size={15} className="mt-0.5 shrink-0" />
										<span>{address}</span>
									</li>
								)}
								{contactPhone && (
									<li className="flex items-center gap-2 text-sm text-gray-400">
										<Phone size={15} className="shrink-0" />
										<a
											href={`tel:${contactPhone}`}
											className="transition-colors hover:text-white"
										>
											{contactPhone}
										</a>
									</li>
								)}
								{contactEmail && (
									<li className="flex items-center gap-2 text-sm text-gray-400">
										<Mail size={15} className="shrink-0" />
										<a
											href={`mailto:${contactEmail}`}
											className="transition-colors hover:text-white"
										>
											{contactEmail}
										</a>
									</li>
								)}
							</ul>
						</div>
					)}

					{/* Social links */}
					<div>
						<h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
							Síguenos
						</h3>
						<div className="flex gap-4">
							{socialLinks.map((social) => {
								const Icon = PLATFORM_ICONS[social.platform.toLowerCase()];
								if (!Icon) return null;
								return (
									<a
										key={social.platform}
										href={social.url}
										target="_blank"
										rel="noopener noreferrer"
										className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
										aria-label={social.platform}
									>
										<Icon size={20} />
									</a>
								);
							})}
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
