import type { RankingInfo } from "@tanstack/match-sorter-utils";
import { compareItems, rankItem } from "@tanstack/match-sorter-utils";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type {
	Column,
	ColumnDef,
	ColumnFiltersState,
	FilterFn,
	SortingFn,
} from "@tanstack/react-table";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	sortingFns,
	useReactTable,
} from "@tanstack/react-table";
import React from "react";
import type { Person } from "#/data/demo-table-data";
import { demoPersonStatuses } from "#/data/demo-table-data";
import {
	createDemoPerson,
	listDemoPeople,
	normalizeDemoPersonInput,
	resetDemoPeople,
} from "#/db/demo-people";

const getTablePeople = createServerFn({
	method: "GET",
}).handler(() => listDemoPeople());

const createTablePerson = createServerFn({
	method: "POST",
})
	.validator(normalizeDemoPersonInput)
	.handler(({ data }) => createDemoPerson(data));

const resetTablePeople = createServerFn({
	method: "POST",
}).handler(() => resetDemoPeople());

export const Route = createFileRoute("/demo/table")({
	component: TableDemo,
	loader: async () => await getTablePeople(),
});

declare module "@tanstack/react-table" {
	interface FilterFns {
		fuzzy: FilterFn<unknown>;
	}
	interface FilterMeta {
		itemRank: RankingInfo;
	}
}

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
const fuzzyFilter: FilterFn<Person> = (row, columnId, value, addMeta) => {
	// Rank the item
	const itemRank = rankItem(row.getValue(columnId), value);

	// Store the itemRank info
	addMeta({
		itemRank,
	});

	// Return if the item should be filtered in/out
	return itemRank.passed;
};

// Define a custom fuzzy sort function that will sort by rank if the row has ranking information
const fuzzySort: SortingFn<Person> = (rowA, rowB, columnId) => {
	let dir = 0;
	const rowARank = rowA.columnFiltersMeta[columnId]?.itemRank;
	const rowBRank = rowB.columnFiltersMeta[columnId]?.itemRank;

	// Only sort by rank if the column has ranking information
	if (rowARank && rowBRank) {
		dir = compareItems(rowARank, rowBRank);
	}

	// Provide an alphanumeric fallback for when the item ranks are equal
	return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

function TableDemo() {
	const router = useRouter();
	const data = Route.useLoaderData();
	const [actionError, setActionError] = React.useState("");
	const [isCreating, setIsCreating] = React.useState(false);
	const [isResetting, setIsResetting] = React.useState(false);

	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [globalFilter, setGlobalFilter] = React.useState("");

	const columns = React.useMemo<ColumnDef<Person>[]>(
		() => [
			{
				accessorKey: "id",
				filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
				header: "ID",
			},
			{
				accessorKey: "firstName",
				cell: (info) => info.getValue(),
				filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column - case sensitive
				header: "First Name",
			},
			{
				accessorFn: (row) => row.lastName,
				id: "lastName",
				cell: (info) => info.getValue(),
				header: () => <span>Last Name</span>,
				filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
			},
			{
				accessorFn: (row) => `${row.firstName} ${row.lastName}`,
				id: "fullName",
				header: "Full Name",
				cell: (info) => info.getValue(),
				filterFn: "fuzzy", //using our custom fuzzy filter function
				// filterFn: fuzzyFilter, //or just define with the function
				sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
			},
			{
				accessorKey: "age",
				header: "Age",
			},
			{
				accessorKey: "visits",
				header: "Visits",
			},
			{
				accessorKey: "progress",
				header: "Progress",
				cell: (info) => `${info.getValue()}%`,
			},
			{
				accessorKey: "status",
				header: "Status",
			},
		],
		[],
	);

	const table = useReactTable({
		data,
		columns,
		filterFns: {
			fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
		},
		state: {
			columnFilters,
			globalFilter,
		},
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: "fuzzy", //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(), //client side filtering
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		debugTable: false,
		debugHeaders: false,
		debugColumns: false,
	});

	const handleCreatePerson = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setActionError("");
		setIsCreating(true);

		const form = e.currentTarget;
		const formData = new FormData(form);

		try {
			await createTablePerson({
				data: {
					firstName: String(formData.get("firstName") ?? ""),
					lastName: String(formData.get("lastName") ?? ""),
					age: String(formData.get("age") ?? ""),
					visits: String(formData.get("visits") ?? ""),
					progress: String(formData.get("progress") ?? ""),
					status: String(formData.get("status") ?? ""),
				},
			});
			form.reset();
			await router.invalidate();
		} catch (error) {
			console.error("Failed to create demo person:", error);
			setActionError("新增记录失败，请检查数据库接口。");
		} finally {
			setIsCreating(false);
		}
	};

	const handleResetPeople = async () => {
		setActionError("");
		setIsResetting(true);

		try {
			await resetTablePeople();
			table.setPageIndex(0);
			await router.invalidate();
		} catch (error) {
			console.error("Failed to reset demo people:", error);
			setActionError("重置样例数据失败，请检查数据库接口。");
		} finally {
			setIsResetting(false);
		}
	};

	const handleReloadPeople = async () => {
		setActionError("");
		await router.invalidate();
	};

	return (
		<main className="demo-page demo-page-wide">
			<div>
				<p className="island-kicker mb-2">TanStack Table + SQLite API</p>
				<h1 className="demo-title mb-6">真实数据库表格示例</h1>
				<p className="demo-muted mb-6 max-w-3xl">
					表格数据来自 SQLite 的 <code>demo_people</code> 表，页面通过 TanStack
					Start server function 读取、新增和重置记录。
				</p>
				<DebouncedInput
					value={globalFilter ?? ""}
					onChange={(value) => setGlobalFilter(String(value))}
					className="demo-input"
					placeholder="搜索所有列..."
				/>
			</div>
			<div className="h-4" />
			<form
				onSubmit={handleCreatePerson}
				className="demo-panel grid gap-3 md:grid-cols-6"
			>
				<input
					name="firstName"
					className="demo-input"
					placeholder="First name"
					required
				/>
				<input
					name="lastName"
					className="demo-input"
					placeholder="Last name"
					required
				/>
				<input
					name="age"
					type="number"
					min="18"
					max="99"
					defaultValue="32"
					className="demo-input"
					aria-label="Age"
				/>
				<input
					name="visits"
					type="number"
					min="0"
					max="9999"
					defaultValue="100"
					className="demo-input"
					aria-label="Visits"
				/>
				<input
					name="progress"
					type="number"
					min="0"
					max="100"
					defaultValue="50"
					className="demo-input"
					aria-label="Progress"
				/>
				<select name="status" className="demo-select">
					{demoPersonStatuses.map((status) => (
						<option key={status} value={status}>
							{status}
						</option>
					))}
				</select>
				<div className="flex gap-2 md:col-span-6">
					<button type="submit" className="demo-button" disabled={isCreating}>
						{isCreating ? "新增中..." : "新增记录"}
					</button>
					<button
						type="button"
						className="demo-button demo-button-secondary"
						onClick={handleReloadPeople}
					>
						重新读取接口
					</button>
					<button
						type="button"
						className="demo-button demo-button-secondary"
						onClick={handleResetPeople}
						disabled={isResetting}
					>
						{isResetting ? "重置中..." : "重置数据库样例"}
					</button>
				</div>
			</form>
			{actionError ? (
				<p className="demo-muted mt-3 text-sm text-red-500">{actionError}</p>
			) : null}
			<div className="h-4" />
			<div className="demo-table-shell">
				<table className="demo-table text-sm">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<th
											key={header.id}
											colSpan={header.colSpan}
											className="px-4 py-3 text-left"
										>
											{header.isPlaceholder ? null : (
												<>
													<div
														{...{
															className: header.column.getCanSort()
																? "cursor-pointer select-none transition-colors hover:text-[var(--lagoon-deep)]"
																: "",
															onClick: header.column.getToggleSortingHandler(),
														}}
													>
														{flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
														{{
															asc: " 🔼",
															desc: " 🔽",
														}[header.column.getIsSorted() as string] ?? null}
													</div>
													{header.column.getCanFilter() ? (
														<div className="mt-2">
															<Filter column={header.column} />
														</div>
													) : null}
												</>
											)}
										</th>
									);
								})}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => {
							return (
								<tr key={row.id} className="transition-colors">
									{row.getVisibleCells().map((cell) => {
										return (
											<td key={cell.id} className="px-4 py-3">
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</td>
										);
									})}
								</tr>
							);
						})}
						{table.getRowModel().rows.length === 0 ? (
							<tr>
								<td
									colSpan={columns.length}
									className="px-4 py-8 text-center demo-muted"
								>
									没有匹配的数据库记录
								</td>
							</tr>
						) : null}
					</tbody>
				</table>
			</div>
			<div className="h-4" />
			<div className="demo-muted flex flex-wrap items-center gap-2">
				<button
					type="button"
					className="demo-button demo-button-secondary"
					onClick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					{"<<"}
				</button>
				<button
					type="button"
					className="demo-button demo-button-secondary"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					{"<"}
				</button>
				<button
					type="button"
					className="demo-button demo-button-secondary"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					{">"}
				</button>
				<button
					type="button"
					className="demo-button demo-button-secondary"
					onClick={() => table.setPageIndex(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}
				>
					{">>"}
				</button>
				<span className="flex items-center gap-1">
					<div>Page</div>
					<strong>
						{table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</strong>
				</span>
				<span className="flex items-center gap-1">
					| Go to page:
					<input
						type="number"
						defaultValue={table.getState().pagination.pageIndex + 1}
						onChange={(e) => {
							const page = e.target.value ? Number(e.target.value) - 1 : 0;
							table.setPageIndex(page);
						}}
						className="demo-input demo-input-fit py-1"
					/>
				</span>
				<select
					value={table.getState().pagination.pageSize}
					onChange={(e) => {
						table.setPageSize(Number(e.target.value));
					}}
					className="demo-select demo-input-fit py-1"
				>
					{[10, 20, 30, 40, 50].map((pageSize) => (
						<option key={pageSize} value={pageSize}>
							每页 {pageSize}
						</option>
					))}
				</select>
			</div>
			<div className="demo-muted mt-4">
				{table.getPrePaginationRowModel().rows.length} 条数据库记录
			</div>
			<pre className="demo-code-block mt-4 overflow-auto">
				{JSON.stringify(
					{
						columnFilters: table.getState().columnFilters,
						globalFilter: table.getState().globalFilter,
					},
					null,
					2,
				)}
			</pre>
		</main>
	);
}

function Filter({ column }: { column: Column<Person, unknown> }) {
	const columnFilterValue = column.getFilterValue();

	return (
		<DebouncedInput
			type="text"
			value={(columnFilterValue ?? "") as string}
			onChange={(value) => column.setFilterValue(value)}
			placeholder={`Search...`}
			className="demo-input py-1"
		/>
	);
}

// A typical debounced input react component
function DebouncedInput({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}: {
	value: string | number;
	onChange: (value: string | number) => void;
	debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
	const [value, setValue] = React.useState(initialValue);

	React.useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
	}, [debounce, onChange, value]);

	return (
		<input
			{...props}
			value={value}
			onChange={(e) => setValue(e.target.value)}
		/>
	);
}
