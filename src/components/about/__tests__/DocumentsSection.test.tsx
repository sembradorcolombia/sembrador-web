import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("lucide-react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("lucide-react")>();
	return { ...actual, FileText: () => <svg data-testid="icon" /> };
});

import { DocumentsSection } from "../DocumentsSection";

const documents = [
	{
		title: "Confesión de fe",
		description: "Nuestra confesión completa",
		fileUrl: "https://cdn.example.com/confesion.pdf",
	},
	{ title: "Estatutos", fileUrl: "https://cdn.example.com/estatutos.pdf" },
];

describe("DocumentsSection", () => {
	it("lists each document with a link to its file", () => {
		render(<DocumentsSection documents={documents} />);

		expect(
			screen.getByRole("heading", { name: "Documentos" }),
		).toBeInTheDocument();

		const link = screen.getByRole("link", { name: /Confesión de fe/ });
		expect(link).toHaveAttribute(
			"href",
			"https://cdn.example.com/confesion.pdf",
		);
		expect(link).toHaveAttribute("target", "_blank");
		expect(link).toHaveAttribute("rel", "noopener noreferrer");
		expect(screen.getByRole("link", { name: /Estatutos/ })).toBeInTheDocument();
	});

	it("shows the description when present", () => {
		render(<DocumentsSection documents={documents} />);

		expect(screen.getByText("Nuestra confesión completa")).toBeInTheDocument();
	});

	it("is omitted when there are no documents", () => {
		const { container } = render(<DocumentsSection documents={[]} />);

		expect(container).toBeEmptyDOMElement();
	});

	it("skips entries whose file asset did not resolve", () => {
		const { container } = render(
			<DocumentsSection documents={[{ title: "Sin archivo" }]} />,
		);

		expect(container).toBeEmptyDOMElement();
	});
});
