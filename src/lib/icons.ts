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
	LifeBuoy,
	MessageCircle,
	Music,
	Star,
	Users,
} from "lucide-react";

// ── CMS icon name → Lucide component mapping ─────────────────────────────────

export const ICON_MAP: Record<string, LucideIcon> = {
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
	"life-buoy": LifeBuoy,
	"message-circle": MessageCircle,
	compass: Compass,
	leaf: Leaf,
	"arrow-right": ArrowRight,
};

export const DEFAULT_ICON: LucideIcon = HelpCircle;

export function resolveIcon(name?: string): LucideIcon {
	if (!name) return DEFAULT_ICON;
	return ICON_MAP[name.toLowerCase()] ?? DEFAULT_ICON;
}
