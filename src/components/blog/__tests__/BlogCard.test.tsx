import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", async (importOriginal) => {
	const actual =
		await importOriginal<typeof import("@tanstack/react-router")>();
	return {
		...actual,
		Link: ({
			children,
			to,
			params,
			...rest
		}: {
			children?: React.ReactNode;
			to: string;
			params?: Record<string, string>;
		} & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
			<a href={to} {...rest}>
				{children}
			</a>
		),
	};
});

vi.mock("@/lib/sanity", () => {
	const chain = {
		width: () => chain,
		height: () => chain,
		fit: () => chain,
		url: () => "mock-image-url",
	};
	return { sanityImageUrl: () => chain };
});

import { BlogCard } from "../BlogCard";

describe("BlogCard", () => {
	const mockPost = {
		_id: "post-1",
		title: "Test Post Title",
		slug: { current: "test-slug" },
		category: "sermon" as const,
		publishedAt: "2026-03-20T10:00:00Z",
		excerpt: "Test excerpt",
		featuredImage: {
			asset: { _id: "image-1", url: "https://example.com/image.jpg" },
			alt: "Test image",
		},
		author: {
			name: "John Doe",
			image: {
				asset: { _id: "avatar-1", url: "https://example.com/avatar.jpg" },
			},
		},
	};

	it("renders post title", () => {
		render(<BlogCard post={mockPost} />);
		expect(screen.getByText("Test Post Title")).toBeInTheDocument();
	});

	it("renders Sermón badge for sermon category", () => {
		render(<BlogCard post={mockPost} />);
		expect(screen.getByText("Sermón")).toBeInTheDocument();
	});

	it("renders Noticia badge for news category", () => {
		const newsPost = { ...mockPost, category: "news" as const };
		render(<BlogCard post={newsPost} />);
		expect(screen.getByText("Noticia")).toBeInTheDocument();
	});

	it("renders author name when present", () => {
		render(<BlogCard post={mockPost} />);
		expect(screen.getByText("John Doe")).toBeInTheDocument();
	});

	it("renders excerpt text", () => {
		render(<BlogCard post={mockPost} />);
		expect(screen.getByText("Test excerpt")).toBeInTheDocument();
	});

	it("renders link with correct href", () => {
		render(<BlogCard post={mockPost} />);
		// The Link should point to /blog/{slug}
		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("href", "/blog/$slug");
	});
});
