import type { SanityImageSource } from "@sanity/image-url";
import { sanityImageUrl } from "@/lib/sanity";
import type { CmsGivingOption } from "@/lib/types/cms";
import { cn } from "@/lib/utils";

// ── Type badge labels ────────────────────────────────────────────────────────

const TYPE_LABELS: Record<CmsGivingOption["type"], string> = {
	bank: "Banco",
	nequi: "Nequi",
	daviplata: "Daviplata",
	other: "Otro",
};

const TYPE_COLORS: Record<CmsGivingOption["type"], string> = {
	bank: "bg-blue-100 text-blue-800",
	nequi: "bg-purple-100 text-purple-800",
	daviplata: "bg-orange-100 text-orange-800",
	other: "bg-gray-100 text-gray-800",
};

// ── Image helpers ────────────────────────────────────────────────────────────

function qrImg(source: SanityImageSource) {
	return sanityImageUrl(source).width(240).height(240).fit("clip").url();
}

// ── Component ────────────────────────────────────────────────────────────────

interface GivingOptionCardProps {
	option: CmsGivingOption;
	className?: string;
}

export function GivingOptionCard({ option, className }: GivingOptionCardProps) {
	const qrUrl = option.qrCodeImage ? qrImg(option.qrCodeImage.asset) : null;

	return (
		<div
			className={cn(
				"bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6",
				className,
			)}
		>
			{/* Header: type badge + title */}
			<div className="flex items-start justify-between gap-4 mb-3">
				<h3 className="font-grotesk-compact-black text-xl text-gray-900">
					{option.title}
				</h3>
				<span
					className={cn(
						"shrink-0 text-xs font-medium px-2.5 py-1 rounded-full",
						TYPE_COLORS[option.type],
					)}
				>
					{TYPE_LABELS[option.type]}
				</span>
			</div>

			{/* Description */}
			<p className="text-gray-600 text-sm leading-relaxed mb-4">
				{option.description}
			</p>

			{/* Details (account numbers, instructions, etc.) */}
			{option.details && (
				<div className="bg-gray-50 rounded-lg p-4 mb-4">
					<p className="text-sm text-gray-700 whitespace-pre-line font-mono leading-relaxed">
						{option.details}
					</p>
				</div>
			)}

			{/* QR Code image */}
			{qrUrl && (
				<div className="flex justify-center mt-4">
					<img
						src={qrUrl}
						alt={`Código QR para ${option.title}`}
						className="w-40 h-40 object-contain rounded-lg border border-gray-100"
					/>
				</div>
			)}
		</div>
	);
}
