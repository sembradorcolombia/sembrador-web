/**
 * Unit tests for SeoHead component.
 *
 * React 19 natively hoists <title> and <meta> tags to document.head.
 * Full meta tag verification is best covered by E2E tests.
 *
 * Here we verify:
 * 1. The component renders without throwing errors.
 * 2. SeoHead does not inject any body content (it is head-only).
 * 3. All supported prop combinations are accepted without TypeScript errors.
 */
import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SeoHead } from "../SeoHead";

function renderSeoHead(props: Parameters<typeof SeoHead>[0] = {}) {
	act(() => {
		render(<SeoHead {...props} />);
	});
}

describe("SeoHead", () => {
	it("renders without throwing when no props are provided", () => {
		expect(() => renderSeoHead()).not.toThrow();
	});

	it("renders without throwing with only a title", () => {
		expect(() => renderSeoHead({ title: "Blog" })).not.toThrow();
	});

	it("renders without throwing with fullTitle", () => {
		expect(() =>
			renderSeoHead({ fullTitle: "El Sembrador — Iglesia en Medellín" }),
		).not.toThrow();
	});

	it("renders without throwing with all props provided", () => {
		expect(() =>
			renderSeoHead({
				title: "Post",
				description: "A description",
				image: "https://cdn.example.com/img.jpg",
				type: "article",
			}),
		).not.toThrow();
	});

	it("renders without throwing with type 'website'", () => {
		expect(() =>
			renderSeoHead({ title: "Home", type: "website" }),
		).not.toThrow();
	});

	it("injects no visible content into the document body", () => {
		let container: HTMLElement | undefined;
		act(() => {
			const result = render(<SeoHead title="Invisible" />);
			container = result.container;
		});
		// SeoHead is head-only; it should produce no DOM nodes in the body
		expect(container?.firstChild).toBeNull();
	});

	it("does not render any text accessible from screen queries", () => {
		renderSeoHead({ title: "No Body", description: "desc" });
		expect(screen.queryByText("No Body")).toBeNull();
		expect(screen.queryByText("desc")).toBeNull();
	});
});
