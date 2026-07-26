import type { PortableTextBlock } from "./types/cms";

/**
 * Flattens the first text block of a Portable Text value into plain text.
 * Used for previews and summaries, not for full rendering — use
 * `@portabletext/react` for that.
 */
export function portableTextToPlain(blocks?: PortableTextBlock[]): string {
	const firstBlock = blocks?.find(
		(block) => block._type === "block" && Array.isArray(block.children),
	);
	if (!firstBlock) return "";

	return (firstBlock.children as { text?: string }[])
		.map((child) => child.text ?? "")
		.join("")
		.trim();
}
