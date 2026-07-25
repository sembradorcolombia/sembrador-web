import {
	type ColumnDef,
	type FilterFn,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import {
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	Download,
	Search,
} from "lucide-react";
import { useId, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { downloadCSV } from "@/lib/csv";
import type { ConsolidationRegistration } from "@/lib/services/consolidation";
import { Button } from "../ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";

const PAGE_SIZE = 20;

function formatDate(value: string | null) {
	return value ? new Date(value).toLocaleDateString("es-CO") : "—";
}

/**
 * Matches the query against email, name, lastname and mobile at once.
 *
 * TanStack calls the global filter once per filterable column, but this
 * evaluates the whole row, so `columnId` is intentionally unused — a row
 * passes as soon as any one of the four fields matches.
 */
const searchRegistrations: FilterFn<ConsolidationRegistration> = (
	row,
	_columnId,
	filterValue: string,
) => {
	const query = filterValue.trim().toLowerCase();
	if (!query) return true;

	const { email, name, lastname, mobile } = row.original;
	return [email, name, lastname, mobile].some((field) =>
		field?.toLowerCase().includes(query),
	);
};

interface SortableHeaderProps {
	label: string;
	// biome-ignore lint/suspicious/noExplicitAny: TanStack's Column generic is not worth threading through for a header button
	column: any;
}

function SortableHeader({ label, column }: SortableHeaderProps) {
	return (
		<Button
			variant="ghost"
			size="sm"
			className="-ml-3"
			onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
		>
			{label}
			<ArrowUpDown className="ml-1 h-3 w-3" />
		</Button>
	);
}

interface ConsolidationTableProps {
	registrations: ConsolidationRegistration[];
}

export function ConsolidationTable({ registrations }: ConsolidationTableProps) {
	const searchId = useId();
	const [sorting, setSorting] = useState<SortingState>([
		{ id: "created_at", desc: true },
	]);
	const [globalFilter, setGlobalFilter] = useState("");

	const columns = useMemo<ColumnDef<ConsolidationRegistration>[]>(
		() => [
			{
				id: "index",
				header: "#",
				cell: ({ row, table }) => {
					const pageIndex = table.getState().pagination.pageIndex;
					const pageSize = table.getState().pagination.pageSize;
					return pageIndex * pageSize + row.index + 1;
				},
				enableSorting: false,
			},
			{
				accessorKey: "name",
				header: ({ column }) => (
					<SortableHeader label="Nombre" column={column} />
				),
			},
			{
				accessorKey: "lastname",
				header: ({ column }) => (
					<SortableHeader label="Apellido" column={column} />
				),
			},
			{
				accessorKey: "email",
				header: ({ column }) => (
					<SortableHeader label="Email" column={column} />
				),
				cell: ({ row }) => (
					<span className="break-all">{row.getValue("email")}</span>
				),
			},
			{
				accessorKey: "mobile",
				header: ({ column }) => (
					<SortableHeader label="Celular" column={column} />
				),
			},
			{
				accessorKey: "next_step",
				header: ({ column }) => (
					<SortableHeader label="Conectar" column={column} />
				),
			},
			{
				accessorKey: "comment",
				header: "Comentario",
				enableSorting: false,
				cell: ({ row }) => {
					const comment = row.original.comment;
					if (!comment) return "—";
					return (
						<span className="block max-w-[16rem] truncate" title={comment}>
							{comment}
						</span>
					);
				},
			},
			{
				accessorKey: "created_at",
				header: ({ column }) => (
					<SortableHeader label="Fecha" column={column} />
				),
				cell: ({ row }) => formatDate(row.getValue("created_at")),
			},
		],
		[],
	);

	const table = useReactTable({
		data: registrations,
		columns,
		state: { sorting, globalFilter },
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: searchRegistrations,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: { pagination: { pageSize: PAGE_SIZE } },
	});

	const filteredCount = table.getFilteredRowModel().rows.length;

	const handleDownloadCSV = () => {
		// getSortedRowModel() is filtered then sorted, so the export follows the
		// active search and sort across every page — not just the visible one.
		const sortedRows = table.getSortedRowModel().rows;
		const headers = [
			"#",
			"Nombre",
			"Apellido",
			"Email",
			"Celular",
			"Conectar",
			"Comentario",
			"Fecha",
		];
		const rows = sortedRows.map((row, i) => [
			String(i + 1),
			row.original.name,
			row.original.lastname,
			row.original.email,
			row.original.mobile,
			row.original.next_step,
			row.original.comment ?? "",
			row.original.created_at
				? new Date(row.original.created_at).toLocaleDateString("es-CO")
				: "",
		]);
		const date = new Date().toISOString().slice(0, 10);
		downloadCSV(`consolidacion-registros-${date}.csv`, headers, rows);
	};

	if (registrations.length === 0) {
		return <p className="text-sm text-gray-500">No hay registros aun.</p>;
	}

	return (
		<div>
			<div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative w-full sm:max-w-xs">
					<label htmlFor={searchId} className="sr-only">
						Buscar por nombre, apellido, email o celular
					</label>
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<Input
						id={searchId}
						type="text"
						placeholder="Buscar nombre, email o celular..."
						value={globalFilter}
						onChange={(e) => setGlobalFilter(e.target.value)}
						className="pl-10"
					/>
				</div>

				<Button
					type="button"
					onClick={handleDownloadCSV}
					className="flex shrink-0 items-center gap-1.5 rounded-md bg-amber-400 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-amber-300 cursor-pointer"
				>
					<Download className="h-4 w-4" />
					Descargar CSV
				</Button>
			</div>

			{/* Table already wraps itself in an overflow-auto container, so the
			 * table scrolls horizontally within the card on narrow viewports
			 * without the page body scrolling. */}
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className="bg-gray-50">
							{headerGroup.headers.map((header) => (
								<TableHead
									key={header.id}
									className="whitespace-nowrap text-xs uppercase"
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No se encontraron resultados
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{table.getPageCount() > 1 && (
				<div className="mt-3 flex items-center justify-between text-sm text-gray-600">
					<span>
						Mostrando {table.getState().pagination.pageIndex * PAGE_SIZE + 1}–
						{Math.min(
							(table.getState().pagination.pageIndex + 1) * PAGE_SIZE,
							filteredCount,
						)}{" "}
						de {filteredCount}
					</span>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
							aria-label="Página anterior"
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<span>
							{table.getState().pagination.pageIndex + 1} /{" "}
							{table.getPageCount()}
						</span>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
							aria-label="Página siguiente"
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
