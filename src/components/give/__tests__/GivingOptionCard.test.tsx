import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/sanity", () => {
	const chain = {
		width: () => chain,
		height: () => chain,
		fit: () => chain,
		url: () => "mock-qr-url",
	};
	return { sanityImageUrl: () => chain };
});

import { GivingOptionCard } from "../GivingOptionCard";

describe("GivingOptionCard", () => {
	const mockOption = {
		_id: "option-1",
		title: "Bank Transfer",
		description: "Transfer to our bank account",
		type: "bank" as const,
		details: "Account: 12345678\nBank: Example Bank",
		qrCodeImage: {
			_type: "image" as const,
			asset: { _id: "qr-1", url: "https://example.com/qr.png" },
		},
		order: 1,
	};

	it("renders title and description", () => {
		render(<GivingOptionCard option={mockOption} />);
		expect(screen.getByText("Bank Transfer")).toBeInTheDocument();
		expect(
			screen.getByText("Transfer to our bank account"),
		).toBeInTheDocument();
	});

	it("renders Banco badge for bank type", () => {
		render(<GivingOptionCard option={mockOption} />);
		expect(screen.getByText("Banco")).toBeInTheDocument();
	});

	it("renders Nequi badge for nequi type", () => {
		const nequiOption = { ...mockOption, type: "nequi" as const };
		render(<GivingOptionCard option={nequiOption} />);
		expect(screen.getByText("Nequi")).toBeInTheDocument();
	});

	it("renders Daviplata badge for daviplata type", () => {
		const daviplataOption = { ...mockOption, type: "daviplata" as const };
		render(<GivingOptionCard option={daviplataOption} />);
		expect(screen.getByText("Daviplata")).toBeInTheDocument();
	});

	it("renders details text in code block when present", () => {
		render(<GivingOptionCard option={mockOption} />);
		expect(screen.getByText(/Account: 12345678/)).toBeInTheDocument();
		expect(screen.getByText(/Bank: Example Bank/)).toBeInTheDocument();
	});

	it("does not render details block when details is absent", () => {
		const noDetailsOption = { ...mockOption, details: undefined };
		const { container } = render(<GivingOptionCard option={noDetailsOption} />);

		const detailsBlocks = container.querySelectorAll(".bg-gray-50");
		expect(detailsBlocks.length).toBe(0);
	});

	it("renders QR code image when qrCodeImage is present", () => {
		render(<GivingOptionCard option={mockOption} />);
		const img = screen.getByAltText(/Código QR para/);
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute("src", "mock-qr-url");
	});

	it("does not render QR code image when qrCodeImage is absent", () => {
		const noQrOption = { ...mockOption, qrCodeImage: undefined };
		render(<GivingOptionCard option={noQrOption} />);
		const img = screen.queryByAltText(/Código QR para/);
		expect(img).not.toBeInTheDocument();
	});

	it("renders Otro badge for other type", () => {
		const otherOption = { ...mockOption, type: "other" as const };
		render(<GivingOptionCard option={otherOption} />);
		expect(screen.getByText("Otro")).toBeInTheDocument();
	});

	// ── Zoom behaviour ──────────────────────────────────────────────────────

	it("renders the QR thumbnail as an interactive button when qrCodeImage is present", () => {
		render(<GivingOptionCard option={mockOption} />);
		const btn = screen.getByRole("button", { name: /Ampliar código QR de/i });
		expect(btn).toBeInTheDocument();
	});

	it("does not render a zoom button when qrCodeImage is absent", () => {
		const noQrOption = { ...mockOption, qrCodeImage: undefined };
		render(<GivingOptionCard option={noQrOption} />);
		const btn = screen.queryByRole("button", { name: /Ampliar código QR/i });
		expect(btn).not.toBeInTheDocument();
	});

	it("opens the zoom dialog with the enlarged image when the QR button is clicked", async () => {
		const user = userEvent.setup();
		render(<GivingOptionCard option={mockOption} />);

		const btn = screen.getByRole("button", { name: /Ampliar código QR de/i });
		await user.click(btn);

		// Dialog title should appear
		expect(screen.getByText(/Código QR — Bank Transfer/i)).toBeInTheDocument();

		// Enlarged image should be in the dialog
		const largeImg = screen.getByAltText(/Código QR ampliado para/i);
		expect(largeImg).toBeInTheDocument();
		expect(largeImg).toHaveAttribute("src", "mock-qr-url");
	});

	it("closes the zoom dialog when the Cerrar button is activated", async () => {
		const user = userEvent.setup();
		render(<GivingOptionCard option={mockOption} />);

		await user.click(
			screen.getByRole("button", { name: /Ampliar código QR de/i }),
		);
		expect(screen.getByText(/Código QR — Bank Transfer/i)).toBeInTheDocument();

		const closeBtn = screen.getByRole("button", { name: /Cerrar/i });
		await user.click(closeBtn);

		expect(
			screen.queryByText(/Código QR — Bank Transfer/i),
		).not.toBeInTheDocument();
	});

	it("closes the zoom dialog when Escape is pressed", async () => {
		const user = userEvent.setup();
		render(<GivingOptionCard option={mockOption} />);

		await user.click(
			screen.getByRole("button", { name: /Ampliar código QR de/i }),
		);
		expect(screen.getByText(/Código QR — Bank Transfer/i)).toBeInTheDocument();

		await user.keyboard("{Escape}");

		expect(
			screen.queryByText(/Código QR — Bank Transfer/i),
		).not.toBeInTheDocument();
	});
});
