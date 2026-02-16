import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { downloadCSV } from "../csv";

describe("downloadCSV", () => {
	let mockClick: ReturnType<typeof vi.fn>;
	let mockAnchor: Partial<HTMLAnchorElement>;

	beforeEach(() => {
		mockClick = vi.fn();
		mockAnchor = { href: "", download: "", click: mockClick };

		vi.spyOn(document, "createElement").mockReturnValue(
			mockAnchor as HTMLAnchorElement,
		);
		vi.stubGlobal(
			"URL",
			Object.assign(globalThis.URL, {
				createObjectURL: vi.fn(() => "blob:mock-url"),
				revokeObjectURL: vi.fn(),
			}),
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it("generates correct CSV content with BOM", () => {
		const blobSpy = vi.fn();
		vi.stubGlobal(
			"Blob",
			class MockBlob {
				constructor(parts: string[], options: BlobPropertyBag) {
					blobSpy(parts, options);
				}
			},
		);

		downloadCSV("test.csv", ["Name", "Email"], [["Ana", "ana@test.com"]]);

		expect(blobSpy).toHaveBeenCalledWith(
			["\uFEFFName,Email\nAna,ana@test.com"],
			{ type: "text/csv;charset=utf-8;" },
		);
	});

	it("escapes fields containing commas", () => {
		const blobSpy = vi.fn();
		vi.stubGlobal(
			"Blob",
			class MockBlob {
				constructor(parts: string[]) {
					blobSpy(parts);
				}
			},
		);

		downloadCSV("test.csv", ["A"], [["hello, world"]]);

		const csv = blobSpy.mock.calls[0][0][0] as string;
		expect(csv).toContain('"hello, world"');
	});

	it("escapes fields containing double quotes", () => {
		const blobSpy = vi.fn();
		vi.stubGlobal(
			"Blob",
			class MockBlob {
				constructor(parts: string[]) {
					blobSpy(parts);
				}
			},
		);

		downloadCSV("test.csv", ["A"], [['say "hi"']]);

		const csv = blobSpy.mock.calls[0][0][0] as string;
		expect(csv).toContain('"say ""hi"""');
	});

	it("escapes fields containing newlines", () => {
		const blobSpy = vi.fn();
		vi.stubGlobal(
			"Blob",
			class MockBlob {
				constructor(parts: string[]) {
					blobSpy(parts);
				}
			},
		);

		downloadCSV("test.csv", ["A"], [["line1\nline2"]]);

		const csv = blobSpy.mock.calls[0][0][0] as string;
		expect(csv).toContain('"line1\nline2"');
	});

	it("sets the correct filename on the download link", () => {
		downloadCSV("mi-archivo.csv", ["A"], [["1"]]);

		expect(mockAnchor.download).toBe("mi-archivo.csv");
	});

	it("triggers a click on the anchor element", () => {
		downloadCSV("test.csv", ["A"], [["1"]]);

		expect(mockClick).toHaveBeenCalledOnce();
	});

	it("revokes the object URL after download", () => {
		downloadCSV("test.csv", ["A"], [["1"]]);

		expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
	});
});
