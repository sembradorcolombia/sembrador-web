import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import logo from "@/assets/images/logo-hw.svg";
import couplePhoto from "@/assets/images/noche-parejas-couple.webp";
import titleGraphic from "@/assets/images/noche-parejas-title.webp";

interface NocheParejasLayoutProps {
	children: ReactNode;
	showTitleGraphic?: boolean;
}

export function NocheParejasLayout({
	children,
	showTitleGraphic = true,
}: NocheParejasLayoutProps) {
	return (
		<div className="min-h-screen w-full overflow-x-hidden bg-[#e2a9f1]">
			<header className="relative z-10 flex justify-center px-6 pt-7 lg:absolute lg:left-0 lg:top-0 lg:justify-start lg:px-[min(8.4vw,161px)] lg:pt-9">
				<Link to="/" aria-label="El Sembrador — Inicio">
					<img
						src={logo}
						alt="El Sembrador"
						className="h-auto w-[270px] max-w-[70vw]"
						loading="eager"
						decoding="async"
					/>
				</Link>
			</header>

			<main className="mx-auto flex w-full max-w-[1920px] flex-col lg:min-h-screen lg:flex-row">
				<section className="order-1 flex justify-center px-4 pt-4 lg:order-2 lg:w-[48%] lg:items-end lg:justify-end lg:px-0 lg:pt-[8.7%]">
					<img
						src={couplePhoto}
						alt="Pareja abrazándose"
						className="h-auto w-full max-w-[348px] object-contain lg:max-h-[calc(100vh-2rem)] lg:max-w-[793px] lg:w-[85%]"
						loading="eager"
						decoding="async"
					/>
				</section>

				<section className="order-2 flex w-full flex-col items-center px-4 pb-10 pt-2 lg:order-1 lg:w-[52%] lg:items-start lg:justify-start lg:pb-12 lg:pl-[min(17vw,323px)] lg:pr-4 lg:pt-28">
					<div className="w-full max-w-[361px] lg:max-w-[629px]">
						{showTitleGraphic && (
							<div className="mb-4 w-full lg:mb-5">
								<img
									src={titleGraphic}
									alt="Un amor que sobrevive a la caída — Génesis 3:14-21"
									className="h-auto w-full"
									loading="eager"
									decoding="async"
								/>
							</div>
						)}

						<div className="mb-6 flex w-full flex-col items-center gap-4 text-center lg:mb-8 lg:flex-row lg:items-start lg:justify-between lg:gap-0 lg:text-left">
							<p className="text-[28px] font-bold uppercase leading-[1.2] text-[#30251f]">
								<span className="lg:hidden">Cena para parejas</span>
								<span className="hidden lg:inline">
									Cena para
									<br />
									parejas
								</span>
							</p>
							<p className="text-[28px] font-bold uppercase leading-[1.2] text-[#30251f] lg:text-right">
								Viernes
								<br />
								SEP. 18 7:00PM
							</p>
						</div>

						{children}
					</div>
				</section>
			</main>
		</div>
	);
}
