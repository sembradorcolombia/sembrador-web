import { createFileRoute } from "@tanstack/react-router";
import { AboutPreview } from "@/components/home/AboutPreview";
import { BlogPreview } from "@/components/home/BlogPreview";
import { EventsPreview } from "@/components/home/EventsPreview";
import { GivePreview } from "@/components/home/GivePreview";
import { HeroSection } from "@/components/home/HeroSection";
import { NextStepsPreview } from "@/components/home/NextStepsPreview";
import { SeoHead } from "@/components/SeoHead";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	return (
		<>
			<SeoHead fullTitle="El Sembrador Colombia" />

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
