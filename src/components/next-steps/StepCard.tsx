import type { LucideIcon } from "lucide-react";
import {
	ArrowRight,
	BookOpen,
	Calendar,
	Church,
	Coffee,
	Compass,
	Gift,
	Hand,
	HandHeart,
	Heart,
	HelpCircle,
	Home,
	Leaf,
	MessageCircle,
	Music,
	Star,
	Users,
} from "lucide-react";
import type { CmsNextStep } from "@/lib/types/cms";
import { cn } from "@/lib/utils";

// ── Icon mapping ─────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
	heart: Heart,
	users: Users,
	"book-open": BookOpen,
	church: Church,
	music: Music,
	coffee: Coffee,
	home: Home,
	calendar: Calendar,
	gift: Gift,
	star: Star,
	hand: Hand,
	"hand-heart": HandHeart,
	"message-circle": MessageCircle,
	compass: Compass,
	leaf: Leaf,
	"arrow-right": ArrowRight,
};

const DEFAULT_ICON: LucideIcon = HelpCircle;

function resolveIcon(name?: string): LucideIcon {
	if (!name) return DEFAULT_ICON;
	return ICON_MAP[name.toLowerCase()] ?? DEFAULT_ICON;
}

// ── Component ────────────────────────────────────────────────────────────────

interface StepCardProps {
	step: CmsNextStep;
	className?: string;
}

export function StepCard({ step, className }: StepCardProps) {
	const Icon = resolveIcon(step.icon);

	const isExternal =
		step.ctaLink.startsWith("http://") ||
		step.ctaLink.startsWith("https://") ||
		step.ctaLink.startsWith("mailto:");

	return (
		<div
			className={cn(
				"flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6",
				className,
			)}
		>
			{/* Icon */}
			<div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-700">
				<Icon size={24} />
			</div>

			{/* Title */}
			<h3 className="font-grotesk-compact-black text-xl text-gray-900 mb-2">
				{step.title}
			</h3>

			{/* Description */}
			<p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6">
				{step.description}
			</p>

			{/* CTA */}
			{isExternal ? (
				<a
					href={step.ctaLink}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-900 transition-colors group"
				>
					{step.ctaText}
					<ArrowRight
						size={16}
						className="group-hover:translate-x-1 transition-transform"
					/>
				</a>
			) : (
				<a
					href={step.ctaLink}
					className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-900 transition-colors group"
				>
					{step.ctaText}
					<ArrowRight
						size={16}
						className="group-hover:translate-x-1 transition-transform"
					/>
				</a>
			)}
		</div>
	);
}
