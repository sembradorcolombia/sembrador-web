function escapeCSVField(field: string): string {
	const firstChar = field.charAt(0);
	if (
		firstChar === "=" ||
		firstChar === "+" ||
		firstChar === "-" ||
		firstChar === "@"
	) {
		field = `'${field}`;
	}
	if (field.includes(",") || field.includes('"') || field.includes("\n")) {
		return `"${field.replace(/"/g, '""')}"`;
	}
	return field;
}

export function downloadCSV(
	filename: string,
	headers: string[],
	rows: string[][],
): void {
	const csvContent = [
		headers.map(escapeCSVField).join(","),
		...rows.map((row) => row.map(escapeCSVField).join(",")),
	].join("\n");

	const blob = new Blob([`\uFEFF${csvContent}`], {
		type: "text/csv;charset=utf-8;",
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}
