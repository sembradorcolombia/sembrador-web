import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("lucide-react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("lucide-react")>();
	const IconStub = () => <svg data-testid="icon" />;
	return {
		...actual,
		Heart: IconStub,
		Users: IconStub,
		BookOpen: IconStub,
		Church: IconStub,
		Music: IconStub,
		Coffee: IconStub,
		Home: IconStub,
		Calendar: IconStub,
		Gift: IconStub,
		Star: IconStub,
		Hand: IconStub,
		HandHeart: IconStub,
		MessageCircle: IconStub,
		Compass: IconStub,
		Leaf: IconStub,
		ArrowRight: IconStub,
		HelpCircle: IconStub,
	};
});

import { StepCard } from "../StepCard";

describe("StepCard", () => {
	const mockStep = {
		_id: "step-1",
		title: "Join our community",
		description: "Come visit us on Sunday",
		icon: "heart",
		ctaText: "Learn more",
		ctaLink: "/contact",
		order: 1,
	};

	it("renders title and description", () => {
		render(<StepCard step={mockStep} />);
		expect(screen.getByText("Join our community")).toBeInTheDocument();
		expect(screen.getByText("Come visit us on Sunday")).toBeInTheDocument();
	});

	it("renders CTA text", () => {
		render(<StepCard step={mockStep} />);
		expect(screen.getByText("Learn more")).toBeInTheDocument();
	});

	it("renders icon", () => {
		render(<StepCard step={mockStep} />);
		const icons = screen.getAllByTestId("icon");
		expect(icons.length).toBeGreaterThan(0);
	});

	it("renders external link with target and rel attributes", () => {
		const externalStep = {
			...mockStep,
			ctaLink: "https://example.com",
		};
		render(<StepCard step={externalStep} />);

		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("target", "_blank");
		expect(link).toHaveAttribute("rel", "noopener noreferrer");
	});

	it("renders internal link without target attribute", () => {
		render(<StepCard step={mockStep} />);

		const link = screen.getByRole("link");
		expect(link).not.toHaveAttribute("target");
		expect(link).not.toHaveAttribute("rel");
	});

	it("handles external http URLs", () => {
		const httpStep = {
			...mockStep,
			ctaLink: "http://example.com",
		};
		render(<StepCard step={httpStep} />);

		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("target", "_blank");
	});

	it("handles mailto links as external", () => {
		const mailtoStep = {
			...mockStep,
			ctaLink: "mailto:info@example.com",
		};
		render(<StepCard step={mailtoStep} />);

		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("target", "_blank");
	});

	it("falls back to default icon for unknown icon name", () => {
		const unknownIconStep = {
			...mockStep,
			icon: "nonexistent-icon",
		};
		render(<StepCard step={unknownIconStep} />);
		const icons = screen.getAllByTestId("icon");
		expect(icons.length).toBeGreaterThan(0);
	});

	it("uses default icon when icon is not provided", () => {
		const noIconStep = {
			...mockStep,
			icon: undefined,
		};
		render(<StepCard step={noIconStep} />);
		const icons = screen.getAllByTestId("icon");
		expect(icons.length).toBeGreaterThan(0);
	});
});
