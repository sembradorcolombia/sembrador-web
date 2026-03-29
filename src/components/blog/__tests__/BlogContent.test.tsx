import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	AudioPlayer,
	BlogContent,
	ScriptureReferences,
	VideoEmbed,
} from "../BlogContent";

describe("ScriptureReferences", () => {
	it("renders each scripture reference", () => {
		const references = ["John 3:16", "Romans 12:1-2", "Psalm 23"];
		render(<ScriptureReferences references={references} />);

		expect(screen.getByText("John 3:16")).toBeInTheDocument();
		expect(screen.getByText("Romans 12:1-2")).toBeInTheDocument();
		expect(screen.getByText("Psalm 23")).toBeInTheDocument();
	});

	it("renders nothing when references list is empty", () => {
		const { container } = render(<ScriptureReferences references={[]} />);
		expect(container.firstChild).toBeNull();
	});

	it("shows heading for scripture references", () => {
		const references = ["John 3:16"];
		render(<ScriptureReferences references={references} />);
		expect(screen.getByText("Referencias bíblicas")).toBeInTheDocument();
	});
});

describe("AudioPlayer", () => {
	it("renders audio element with correct src", () => {
		const url = "https://example.com/sermon.mp3";
		const { container } = render(<AudioPlayer url={url} />);

		const sourceElement = container.querySelector("audio source");
		expect(sourceElement).toHaveAttribute("src", url);
	});

	it("renders player label", () => {
		render(<AudioPlayer url="https://example.com/sermon.mp3" />);
		expect(screen.getByText("Audio del sermón")).toBeInTheDocument();
	});
});

describe("VideoEmbed", () => {
	it("renders YouTube iframe for youtube.com URLs", () => {
		const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
		render(<VideoEmbed url={url} />);

		const iframe = screen.getByTitle("Video del sermón");
		expect(iframe).toHaveAttribute(
			"src",
			expect.stringContaining("youtube.com/embed/dQw4w9WgXcQ"),
		);
	});

	it("renders YouTube iframe for youtu.be short URLs", () => {
		const url = "https://youtu.be/dQw4w9WgXcQ";
		render(<VideoEmbed url={url} />);

		const iframe = screen.getByTitle("Video del sermón");
		expect(iframe).toHaveAttribute(
			"src",
			expect.stringContaining("youtube.com/embed/dQw4w9WgXcQ"),
		);
	});

	it("renders Vimeo iframe for vimeo.com URLs", () => {
		const url = "https://vimeo.com/123456789";
		render(<VideoEmbed url={url} />);

		const iframe = screen.getByTitle("Video del sermón");
		expect(iframe).toHaveAttribute(
			"src",
			expect.stringContaining("player.vimeo.com/video/123456789"),
		);
	});

	it("renders video fallback for non-YouTube/Vimeo URLs", () => {
		const url = "https://example.com/sermon.mp4";
		const { container } = render(<VideoEmbed url={url} />);

		const video = container.querySelector("video");
		expect(video).toBeInTheDocument();
		const sourceElement = video?.querySelector("source");
		expect(sourceElement).toHaveAttribute("src", url);
	});
});

describe("BlogContent", () => {
	it("renders portable text body", () => {
		const body = [
			{
				_type: "block",
				_key: "1",
				style: "normal",
				children: [{ _type: "span", _key: "1", text: "Test content" }],
			},
		];

		render(<BlogContent body={body} />);
		expect(screen.getByText("Test content")).toBeInTheDocument();
	});

	it("renders empty div when body is empty", () => {
		const { container } = render(<BlogContent body={[]} />);
		expect(container.querySelector(".prose-blog")).toBeInTheDocument();
	});
});
