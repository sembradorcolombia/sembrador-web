import type { LinkProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

interface NavItem {
	label: string;
	to: LinkProps["to"];
}

// Routes like /blog, /acerca, etc. will be added in future changes.
// Using LinkProps["to"] keeps this forward-compatible with the route tree.
const NAV_ITEMS: NavItem[] = [
	{ label: "Inicio", to: "/" },
	{ label: "Blog", to: "/blog" as LinkProps["to"] },
	{ label: "Acerca", to: "/acerca" as LinkProps["to"] },
	{ label: "Eventos", to: "/eventos" as LinkProps["to"] },
	{ label: "Siguientes Pasos", to: "/siguientes-pasos" as LinkProps["to"] },
	{ label: "Dar", to: "/dar" as LinkProps["to"] },
];

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	// Close mobile menu on escape key
	useEffect(() => {
		if (!isOpen) return;

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") setIsOpen(false);
		}

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen]);

	// Prevent body scroll when mobile menu is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	return (
		<nav aria-label="Navegación principal" className="bg-white shadow-sm">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<Link to="/" className="flex shrink-0 items-center">
						<img
							src="/brand/logo-el-sembrador-h.svg"
							alt="El Sembrador"
							className="h-10"
						/>
					</Link>

					{/* Desktop navigation */}
					<div className="hidden items-center gap-1 md:flex">
						{NAV_ITEMS.map((item) => (
							<Link
								key={item.to}
								to={item.to}
								className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
								activeProps={{
									className:
										"rounded-md px-3 py-2 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 hover:text-primary-dark transition-colors",
								}}
								activeOptions={{
									exact: item.to === "/",
								}}
							>
								{item.label}
							</Link>
						))}
					</div>

					{/* Mobile hamburger button */}
					<button
						type="button"
						onClick={() => setIsOpen(true)}
						className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden"
						aria-label="Abrir menú de navegación"
					>
						<Menu size={24} />
					</button>
				</div>
			</div>

			{/* Mobile menu overlay */}
			{isOpen && (
				<button
					type="button"
					className="fixed inset-0 z-40 bg-black/50 md:hidden"
					onClick={() => setIsOpen(false)}
					aria-label="Cerrar menú"
				/>
			)}

			{/* Mobile slide-in panel */}
			<div
				className={`fixed top-0 right-0 z-50 flex h-full w-72 flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				{/* Panel header */}
				<div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
					<span className="text-lg font-semibold text-gray-900">Menú</span>
					<button
						type="button"
						onClick={() => setIsOpen(false)}
						className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
						aria-label="Cerrar menú de navegación"
					>
						<X size={24} />
					</button>
				</div>

				{/* Panel navigation links */}
				<div className="flex-1 overflow-y-auto px-2 py-4">
					{NAV_ITEMS.map((item) => (
						<Link
							key={item.to}
							to={item.to}
							onClick={() => setIsOpen(false)}
							className="block rounded-md px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
							activeProps={{
								className:
									"block rounded-md px-4 py-3 text-base font-medium text-primary bg-primary/5 hover:bg-primary/10 hover:text-primary-dark transition-colors",
							}}
							activeOptions={{
								exact: item.to === "/",
							}}
						>
							{item.label}
						</Link>
					))}
				</div>
			</div>
		</nav>
	);
}
