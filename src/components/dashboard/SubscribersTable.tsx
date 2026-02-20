import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import {
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	Copy,
	Download,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { downloadCSV } from "@/lib/csv";
import type { EventSubscription } from "@/lib/services/dashboard";
import { Button } from "../ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";

const CONFIRMATION_BASE_URL =
	"https://elsembradorcolombia.org/equilibrio/confirmar-asistencia";

const PAGE_SIZE = 20;

function formatDate(value: string | null) {
	return value ? new Date(value).toLocaleDateString("es-CO") : "—";
}

const columns: ColumnDef<EventSubscription>[] = [
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
			<Button
				variant="ghost"
				size="sm"
				className="-ml-3"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Nombre
				<ArrowUpDown className="ml-1 h-3 w-3" />
			</Button>
		),
	},
	{
		accessorKey: "email",
		header: ({ column }) => (
			<Button
				variant="ghost"
				size="sm"
				className="-ml-3"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Email
				<ArrowUpDown className="ml-1 h-3 w-3" />
			</Button>
		),
		cell: ({ row }) => (
			<span className="break-all">{row.getValue("email")}</span>
		),
	},
	{
		accessorKey: "phone",
		header: "Teléfono",
		enableSorting: false,
		meta: { hiddenOnMobile: true },
	},
	{
		accessorKey: "created_at",
		header: ({ column }) => (
			<Button
				variant="ghost"
				size="sm"
				className="-ml-3"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Fecha
				<ArrowUpDown className="ml-1 h-3 w-3" />
			</Button>
		),
		cell: ({ row }) => formatDate(row.getValue("created_at")),
		meta: { hiddenOnMobile: true },
	},
	{
		accessorKey: "confirmed_at",
		header: ({ column }) => (
			<Button
				variant="ghost"
				size="sm"
				className="-ml-3"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Confirmado
				<ArrowUpDown className="ml-1 h-3 w-3" />
			</Button>
		),
		cell: ({ row }) => formatDate(row.getValue("confirmed_at")),
		meta: { hiddenOnMobile: true },
	},
	{
		id: "actions",
		header: "Enlace",
		enableSorting: false,
		meta: { hiddenOnMobile: true },
		cell: ({ row }) => (
			<button
				type="button"
				onClick={() => {
					const url = `${CONFIRMATION_BASE_URL}?token=${row.original.confirmation_token}`;
					navigator.clipboard.writeText(url);
					toast.success("Enlace copiado");
				}}
				className="rounded p-1 hover:bg-gray-100"
				title="Copiar enlace de confirmación"
			>
				<Copy className="h-4 w-4 text-gray-500" />
			</button>
		),
	},
];

interface SubscribersTableProps {
	subscriptions: EventSubscription[];
	eventName: string;
}

export function SubscribersTable({
	subscriptions,
	eventName,
}: SubscribersTableProps) {
	const [sorting, setSorting] = useState<SortingState>([
		{ id: "created_at", desc: true },
	]);

	const table = useReactTable({
		data: subscriptions,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: { pagination: { pageSize: PAGE_SIZE } },
	});

	const handleDownloadCSV = () => {
		const sortedRows = table.getSortedRowModel().rows;
		const headers = ["#", "Nombre", "Email", "Teléfono", "Fecha", "Confirmado"];
		const rows = sortedRows.map((row, i) => [
			String(i + 1),
			row.original.name,
			row.original.email,
			row.original.phone,
			row.original.created_at
				? new Date(row.original.created_at).toLocaleDateString("es-CO")
				: "",
			row.original.confirmed_at
				? new Date(row.original.confirmed_at).toLocaleDateString("es-CO")
				: "",
		]);
		const date = new Date().toISOString().slice(0, 10);
		downloadCSV(
			`${eventName.toLowerCase().replaceAll(" ", "-")}-inscritos-${date}.csv`,
			headers,
			rows,
		);
	};

	if (subscriptions.length === 0) {
		return <p className="mt-4 text-sm text-gray-500">No hay inscritos aun.</p>;
	}

	return (
		<div className="mt-4">
			<div className="mb-2 flex justify-end">
				<Button
					type="button"
					onClick={handleDownloadCSV}
					className="flex items-center gap-1.5 rounded-md bg-amber-400 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-amber-300 cursor-pointer"
				>
					<Download className="h-4 w-4" />
					Descargar CSV
				</Button>
			</div>

			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className="bg-gray-50">
							{headerGroup.headers.map((header) => (
								<TableHead
									key={header.id}
									className={
										(
											header.column.columnDef.meta as {
												hiddenOnMobile?: boolean;
											}
										)?.hiddenOnMobile
											? "hidden text-xs uppercase md:table-cell"
											: "text-xs uppercase"
									}
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
									<TableCell
										key={cell.id}
										className={
											(
												cell.column.columnDef.meta as {
													hiddenOnMobile?: boolean;
												}
											)?.hiddenOnMobile
												? "hidden md:table-cell"
												: undefined
										}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No hay resultados.
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
							table.getFilteredRowModel().rows.length,
						)}{" "}
						de {table.getFilteredRowModel().rows.length}
					</span>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
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
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
