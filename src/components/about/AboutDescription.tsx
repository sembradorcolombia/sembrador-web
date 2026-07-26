import { BlogContent } from "@/components/blog/BlogContent";
import type { PortableTextBlock } from "@/lib/types/cms";

const FALLBACK_DESCRIPTION =
	"El Sembrador es una comunidad de fe comprometida con el evangelio de Jesucristo. Nos reunimos para adorar, crecer y servir juntos.";

interface AboutDescriptionProps {
	description?: PortableTextBlock[];
}

export function AboutDescription({ description }: AboutDescriptionProps) {
	const hasContent = Boolean(description?.length);

	return (
		<section>
			<h2 className="font-grotesk-compact-black text-2xl text-gray-900 mb-4">
				Quiénes somos
			</h2>
			{hasContent && description ? (
				<BlogContent body={description} />
			) : (
				<p className="text-gray-500 italic">{FALLBACK_DESCRIPTION}</p>
			)}
		</section>
	);
}
