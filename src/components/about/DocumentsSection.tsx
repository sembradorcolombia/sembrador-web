import { FileText } from "lucide-react";
import type { CmsAboutDocument } from "@/lib/types/cms";

interface DocumentsSectionProps {
	documents?: CmsAboutDocument[];
}

export function DocumentsSection({ documents }: DocumentsSectionProps) {
	const available = documents?.filter((doc) => Boolean(doc.fileUrl));
	if (!available?.length) return null;

	return (
		<section className="border-t border-gray-100 pt-12">
			<h2 className="font-grotesk-compact-black text-2xl text-gray-900 mb-6">
				Documentos
			</h2>
			<ul className="space-y-3">
				{available.map((doc) => (
					<li key={doc.title}>
						<a
							href={doc.fileUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
						>
							<span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-green-100 text-green-700">
								<FileText size={20} aria-hidden="true" />
							</span>
							<span className="min-w-0">
								<span className="block font-medium text-gray-900">
									{doc.title}
									<span className="ml-2 text-xs uppercase tracking-wide text-gray-500">
										PDF
									</span>
								</span>
								{doc.description && (
									<span className="mt-1 block text-sm text-gray-600">
										{doc.description}
									</span>
								)}
							</span>
						</a>
					</li>
				))}
			</ul>
		</section>
	);
}
