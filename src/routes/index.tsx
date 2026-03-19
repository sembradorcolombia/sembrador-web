import { createFileRoute } from "@tanstack/react-router";
import { Helmet } from "react-helmet-async";
import { AboutPreview } from "@/components/home/AboutPreview";
import { BlogPreview } from "@/components/home/BlogPreview";
import { EventsPreview } from "@/components/home/EventsPreview";
import { GivePreview } from "@/components/home/GivePreview";
import { HeroSection } from "@/components/home/HeroSection";
import { NextStepsPreview } from "@/components/home/NextStepsPreview";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	return (
		<>
			<Helmet>
				<title>El Sembrador - Iglesia en Medellín</title>
				<meta
					name="description"
					content="El Sembrador es una iglesia en Medellín comprometida con compartir el amor de Dios y construir comunidad. Eventos, blog, y más."
				/>
			</Helmet>

			<main>
				<HeroSection />
				<AboutPreview />
				<EventsPreview />
				<BlogPreview />
				<NextStepsPreview />
				<GivePreview />
			</main>
		</>
	);
}
