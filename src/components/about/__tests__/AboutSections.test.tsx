import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { PortableTextBlock } from "@/lib/types/cms";
import { AboutDescription } from "../AboutDescription";
import { CoreItemsSection } from "../CoreItemsSection";
import { VisionMission } from "../VisionMission";

function block(text: string, marks: string[] = []): PortableTextBlock {
	return {
		_type: "block",
		_key: "b1",
		style: "normal",
		children: [{ _type: "span", _key: "s1", text, marks }],
		markDefs: [],
	};
}

function bulletBlock(text: string, key: string): PortableTextBlock {
	return {
		_type: "block",
		_key: key,
		style: "normal",
		listItem: "bullet",
		level: 1,
		children: [{ _type: "span", _key: `${key}s`, text, marks: [] }],
		markDefs: [],
	};
}

describe("AboutDescription", () => {
	it("renders the Portable Text description", () => {
		render(<AboutDescription description={[block("Somos una iglesia")]} />);

		expect(screen.getByText("Somos una iglesia")).toBeInTheDocument();
	});

	it("preserves inline formatting", () => {
		render(
			<AboutDescription description={[block("En Medellín", ["strong"])]} />,
		);

		expect(screen.getByText("En Medellín").tagName).toBe("STRONG");
	});

	it("shows fallback text when there is no description", () => {
		render(<AboutDescription />);

		expect(
			screen.getByText(/comunidad de fe comprometida con el evangelio/),
		).toBeInTheDocument();
	});
});

describe("VisionMission", () => {
	it("renders both sections when populated", () => {
		render(<VisionMission vision="Nuestra visión" mission="Nuestra misión" />);

		expect(screen.getByRole("heading", { name: "Visión" })).toBeInTheDocument();
		expect(screen.getByText("Nuestra visión")).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "Misión" })).toBeInTheDocument();
		expect(screen.getByText("Nuestra misión")).toBeInTheDocument();
	});

	it("omits the mission section when absent", () => {
		render(<VisionMission vision="Nuestra visión" />);

		expect(
			screen.queryByRole("heading", { name: "Misión" }),
		).not.toBeInTheDocument();
	});

	it("renders nothing when both are absent", () => {
		const { container } = render(<VisionMission />);

		expect(container).toBeEmptyDOMElement();
	});
});

describe("CoreItemsSection", () => {
	it("renders every item with its description", () => {
		render(
			<CoreItemsSection
				title="Nuestros valores"
				items={[
					{ title: "Fe", description: [block("Confiamos en Dios")] },
					{ title: "Comunidad" },
				]}
			/>,
		);

		expect(
			screen.getByRole("heading", { name: "Nuestros valores" }),
		).toBeInTheDocument();
		expect(screen.getByText("Fe")).toBeInTheDocument();
		expect(screen.getByText("Confiamos en Dios")).toBeInTheDocument();
		expect(screen.getByText("Comunidad")).toBeInTheDocument();
	});

	it("renders bulleted descriptions as a real list", () => {
		render(
			<CoreItemsSection
				title="En qué creemos"
				items={[
					{
						title: "La Iglesia",
						description: [
							bulletBlock("Bautismo", "b1"),
							bulletBlock("Cena del Señor", "b2"),
						],
					},
				]}
			/>,
		);

		const items = screen.getAllByRole("listitem");
		expect(items.map((li) => li.textContent)).toContain("Bautismo");
		expect(items.map((li) => li.textContent)).toContain("Cena del Señor");
	});

	it("preserves inline formatting in descriptions", () => {
		render(
			<CoreItemsSection
				title="Nuestros valores"
				items={[{ title: "Fe", description: [block("Confiamos", ["strong"])] }]}
			/>,
		);

		expect(screen.getByText("Confiamos").tagName).toBe("STRONG");
	});

	it("is omitted when there are no items", () => {
		const { container } = render(
			<CoreItemsSection title="Nuestros valores" items={[]} />,
		);

		expect(container).toBeEmptyDOMElement();
	});
});
