import type { RankingInfo } from "@tanstack/match-sorter-utils";
import { compareItems, rankItem } from "@tanstack/match-sorter-utils";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type {
	Column,
	ColumnDef,
	ColumnFiltersState,
	FilterFn,
	OnChangeFn,
	PaginationState,
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
import {
	Activity,
	ArrowDownUp,
	ChevronFirst,
	ChevronLast,
	ChevronLeft,
	ChevronRight,
	Database,
	ListFilter,
	type LucideIcon,
	RefreshCw,
	RotateCcw,
	Search,
	Server,
	Sparkles,
	Table2,
	UserPlus,
} from "lucide-react";
import React from "react";
import {
	type DemoPersonSeed,
	type DemoPersonStatus,
	demoPersonStatuses,
	type Person,
} from "#/data/demo-table-data";

const getTablePeople = createServerFn({
	method: "GET",
}).handler(async () => {
	const { listDemoPeople } = await import("#/db/demo-people");
	return listDemoPeople();
});

const createTablePerson = createServerFn({
	method: "POST",
})
	.validator(normalizeTablePersonInput)
	.handler(async ({ data }) => {
		const { createDemoPerson } = await import("#/db/demo-people");
		return createDemoPerson(data);
	});

const resetTablePeople = createServerFn({
	method: "POST",
}).handler(async () => {
	const { resetDemoPeople } = await import("#/db/demo-people");
	return resetDemoPeople();
});

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

type TableStat = {
	label: string;
	value: string;
	hint: string;
	icon: LucideIcon;
	tone: "lagoon" | "indigo" | "amber" | "coral";
};

const numberFormatter = new Intl.NumberFormat("zh-CN");

const statusMeta: Record<
	Person["status"],
	{ label: string; className: string }
> = {
	complicated: {
		label: "需跟进",
		className: "table-status-complicated",
	},
	relationship: {
		label: "稳定",
		className: "table-status-relationship",
	},
	single: {
		label: "新线索",
		className: "table-status-single",
	},
};

const filterPlaceholders: Record<string, string> = {
	age: "年龄",
	firstName: "名",
	fullName: "全名",
	id: "ID",
	lastName: "姓",
	progress: "进度",
	status: "状态",
	visits: "访问",
};

const pipelineSteps = [
	["01", "Route Loader", "进入页面时读取 SQLite 表格数据。"],
	["02", "Server Function", "新增、重置和重新读取都经过服务端边界。"],
	["03", "TanStack Table", "在客户端完成搜索、过滤、排序和分页。"],
];

function normalizeTablePersonInput(data: unknown): DemoPersonSeed {
	const input = data as Partial<Record<keyof DemoPersonSeed, unknown>>;

	return {
		firstName: normalizeText(input.firstName, "Ada"),
		lastName: normalizeText(input.lastName, "Lovelace"),
		age: normalizeNumber(input.age, 18, 99, 32),
		visits: normalizeNumber(input.visits, 0, 9999, 100),
		progress: normalizeNumber(input.progress, 0, 100, 50),
		status: normalizeStatus(input.status),
	};
}

function normalizeText(value: unknown, fallback: string) {
	if (typeof value !== "string") return fallback;

	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed.slice(0, 60) : fallback;
}

function normalizeNumber(
	value: unknown,
	min: number,
	max: number,
	fallback: number,
) {
	const parsed =
		typeof value === "number" ? value : Number.parseInt(String(value), 10);

	if (!Number.isFinite(parsed)) return fallback;

	return Math.min(Math.max(parsed, min), max);
}

function normalizeStatus(value: unknown): DemoPersonStatus {
	return demoPersonStatuses.includes(value as DemoPersonStatus)
		? (value as DemoPersonStatus)
		: "single";
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
	const [pagination, setPagination] = React.useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const handleColumnFiltersChange = React.useCallback<
		OnChangeFn<ColumnFiltersState>
	>((updater) => {
		setColumnFilters(updater);
		setPagination((current) => ({ ...current, pageIndex: 0 }));
	}, []);

	const columns = React.useMemo<ColumnDef<Person>[]>(
		() => [
			{
				accessorKey: "id",
				filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
				header: "ID",
				cell: (info) => (
					<span className="table-row-id">#{String(info.getValue())}</span>
				),
			},
			{
				accessorKey: "firstName",
				cell: (info) => info.getValue(),
				filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column - case sensitive
				header: "名",
			},
			{
				accessorFn: (row) => row.lastName,
				id: "lastName",
				cell: (info) => info.getValue(),
				header: () => <span>姓</span>,
				filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
			},
			{
				accessorFn: (row) => `${row.firstName} ${row.lastName}`,
				id: "fullName",
				header: "全名",
				cell: (info) => (
					<span className="font-extrabold text-[var(--sea-ink)]">
						{String(info.getValue())}
					</span>
				),
				filterFn: "fuzzy", //using our custom fuzzy filter function
				// filterFn: fuzzyFilter, //or just define with the function
				sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
			},
			{
				accessorKey: "age",
				header: "年龄",
				cell: (info) => `${info.getValue()} 岁`,
			},
			{
				accessorKey: "visits",
				header: "访问",
				cell: (info) => numberFormatter.format(Number(info.getValue())),
			},
			{
				accessorKey: "progress",
				header: "进度",
				cell: (info) => {
					const value = Number(info.getValue());
					return (
						<div className="table-progress-cell">
							<div className="table-progress-track">
								<span style={{ width: `${value}%` }} />
							</div>
							<strong>{value}%</strong>
						</div>
					);
				},
			},
			{
				accessorKey: "status",
				header: "状态",
				cell: (info) => {
					const value = info.getValue() as Person["status"];
					const meta = statusMeta[value];
					return (
						<span className={`table-status-pill ${meta.className}`}>
							{meta.label}
						</span>
					);
				},
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
			pagination,
		},
		onColumnFiltersChange: handleColumnFiltersChange,
		onGlobalFilterChange: setGlobalFilter,
		onPaginationChange: setPagination,
		autoResetPageIndex: false,
		globalFilterFn: "fuzzy", //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(), //client side filtering
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		debugTable: false,
		debugHeaders: false,
		debugColumns: false,
	});

	const filteredRows = table.getFilteredRowModel().rows.length;
	const averageProgress =
		data.length > 0
			? Math.round(
					data.reduce((total, person) => total + person.progress, 0) /
						data.length,
				)
			: 0;
	const totalVisits = data.reduce((total, person) => total + person.visits, 0);
	const activeFilters = columnFilters.length + (globalFilter ? 1 : 0);
	const pageCount = Math.max(table.getPageCount(), 1);
	const canPreviousPage = pagination.pageIndex > 0;
	const canNextPage = pagination.pageIndex < pageCount - 1;
	const tableStats: TableStat[] = [
		{
			label: "数据库记录",
			value: String(data.length).padStart(2, "0"),
			hint: "demo_people",
			icon: Database,
			tone: "lagoon",
		},
		{
			label: "当前结果",
			value: String(filteredRows).padStart(2, "0"),
			hint: `${activeFilters} 个过滤条件`,
			icon: ListFilter,
			tone: "indigo",
		},
		{
			label: "平均进度",
			value: `${averageProgress}%`,
			hint: "当前数据集",
			icon: Activity,
			tone: "amber",
		},
		{
			label: "访问合计",
			value: numberFormatter.format(totalVisits),
			hint: "visits",
			icon: Sparkles,
			tone: "coral",
		},
	];
	const handleGlobalFilterChange = React.useCallback(
		(value: string | number) => {
			setGlobalFilter(String(value));
			setPagination((current) => ({ ...current, pageIndex: 0 }));
		},
		[],
	);
	const goToPage = React.useCallback(
		(pageIndex: number) => {
			const maxPageIndex = Math.max(pageCount - 1, 0);
			setPagination((current) => ({
				...current,
				pageIndex: Math.min(Math.max(pageIndex, 0), maxPageIndex),
			}));
		},
		[pageCount],
	);
	const updatePageSize = React.useCallback((pageSize: number) => {
		setPagination({
			pageIndex: 0,
			pageSize,
		});
	}, []);

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
			goToPage(0);
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
		<main className="table-console-shell px-4 py-10 sm:px-6 lg:px-8">
			<section className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6">
				<header className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
					<div className="table-hero-panel">
						<div className="mb-6 flex flex-wrap items-center gap-3">
							<span className="table-icon-node">
								<Table2 className="h-5 w-5" aria-hidden="true" />
							</span>
							<p className="island-kicker m-0">TanStack Table Workbench</p>
							<span className="table-live-chip">
								<span className="table-live-dot" />
								SQLite live
							</span>
						</div>
						<h1 className="display-title max-w-3xl text-4xl leading-tight sm:text-5xl">
							真实数据库表格示例
						</h1>
						<p className="mt-4 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
							从 SQLite 的 <code>demo_people</code> 表读取真实数据，通过
							TanStack Table 展示搜索、列过滤、排序、分页、新增和重置流程。
						</p>
						<div className="table-search-box mt-6">
							<Search className="h-4 w-4" aria-hidden="true" />
							<label className="sr-only" htmlFor="table-global-search">
								搜索所有列
							</label>
							<DebouncedInput
								id="table-global-search"
								value={globalFilter ?? ""}
								onChange={handleGlobalFilterChange}
								placeholder="搜索姓名、状态、访问或任意列..."
							/>
						</div>
					</div>

					<aside
						className="table-flow-panel"
						aria-labelledby="table-flow-title"
					>
						<div className="mb-5 flex items-start justify-between gap-4">
							<div>
								<p className="island-kicker mb-2">Data Path</p>
								<h2
									id="table-flow-title"
									className="text-xl font-extrabold text-[var(--sea-ink)]"
								>
									表格链路
								</h2>
							</div>
							<Server
								className="h-6 w-6 text-[var(--indigo)]"
								aria-hidden="true"
							/>
						</div>
						<div className="space-y-3">
							{pipelineSteps.map(([step, title, desc]) => (
								<div className="table-pipeline-step" key={step}>
									<span>{step}</span>
									<div>
										<p className="font-extrabold text-[var(--sea-ink)]">
											{title}
										</p>
										<p className="mt-1 text-sm leading-6 text-[var(--sea-ink-soft)]">
											{desc}
										</p>
									</div>
								</div>
							))}
						</div>
					</aside>
				</header>

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					{tableStats.map((stat) => (
						<TableStatCard key={stat.label} stat={stat} />
					))}
				</div>

				<form onSubmit={handleCreatePerson} className="table-form-panel">
					<div className="flex flex-col gap-2 md:col-span-6">
						<p className="island-kicker m-0">Mutation</p>
						<h2 className="text-2xl font-extrabold text-[var(--sea-ink)]">
							新增一条数据库记录
						</h2>
					</div>
					<input
						name="firstName"
						className="table-input"
						placeholder="名"
						required
					/>
					<input
						name="lastName"
						className="table-input"
						placeholder="姓"
						required
					/>
					<input
						name="age"
						type="number"
						min="18"
						max="99"
						defaultValue="32"
						className="table-input"
						aria-label="年龄"
					/>
					<input
						name="visits"
						type="number"
						min="0"
						max="9999"
						defaultValue="100"
						className="table-input"
						aria-label="访问次数"
					/>
					<input
						name="progress"
						type="number"
						min="0"
						max="100"
						defaultValue="50"
						className="table-input"
						aria-label="进度百分比"
					/>
					<select name="status" className="table-select" aria-label="状态">
						{demoPersonStatuses.map((status) => (
							<option key={status} value={status}>
								{statusMeta[status].label}
							</option>
						))}
					</select>
					<div className="flex flex-wrap gap-2 md:col-span-6">
						<button
							type="submit"
							className="table-action-button"
							disabled={isCreating}
						>
							<UserPlus className="h-4 w-4" aria-hidden="true" />
							{isCreating ? "新增中" : "新增记录"}
						</button>
						<button
							type="button"
							className="table-action-button table-action-secondary"
							onClick={handleReloadPeople}
						>
							<RefreshCw className="h-4 w-4" aria-hidden="true" />
							重新读取接口
						</button>
						<button
							type="button"
							className="table-action-button table-action-secondary"
							onClick={handleResetPeople}
							disabled={isResetting}
						>
							<RotateCcw
								className={`h-4 w-4 ${isResetting ? "animate-spin" : ""}`}
								aria-hidden="true"
							/>
							{isResetting ? "重置中" : "重置样例"}
						</button>
					</div>
				</form>

				{actionError ? (
					<div className="table-error-message" role="alert">
						{actionError}
					</div>
				) : null}

				<section
					className="table-data-panel"
					aria-labelledby="table-data-title"
				>
					<div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
						<div>
							<p className="island-kicker mb-2">Data Grid</p>
							<h2
								id="table-data-title"
								className="text-2xl font-extrabold text-[var(--sea-ink)]"
							>
								数据库记录
							</h2>
						</div>
						<div className="table-result-chip">
							{filteredRows} / {data.length} 条记录
						</div>
					</div>

					<div className="table-data-shell">
						<table className="table-data-grid">
							<thead>
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map((header) => {
											return (
												<th key={header.id} colSpan={header.colSpan}>
													{header.isPlaceholder ? null : (
														<>
															<button
																type="button"
																className="table-sort-button"
																onClick={header.column.getToggleSortingHandler()}
																disabled={!header.column.getCanSort()}
															>
																<span>
																	{flexRender(
																		header.column.columnDef.header,
																		header.getContext(),
																	)}
																</span>
																{header.column.getCanSort() ? (
																	<ArrowDownUp
																		className="h-3.5 w-3.5"
																		aria-hidden="true"
																	/>
																) : null}
																<span className="sr-only">
																	{header.column.getIsSorted()
																		? `当前排序：${header.column.getIsSorted()}`
																		: "未排序"}
																</span>
															</button>
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
										<tr key={row.id}>
											{row.getVisibleCells().map((cell) => {
												return (
													<td key={cell.id}>
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
										<td colSpan={columns.length} className="table-empty-cell">
											没有匹配的数据库记录
										</td>
									</tr>
								) : null}
							</tbody>
						</table>
					</div>
				</section>

				<div className="table-pagination-panel">
					<div className="flex flex-wrap items-center gap-2">
						<button
							type="button"
							className="table-icon-button"
							onClick={() => goToPage(0)}
							disabled={!canPreviousPage}
							aria-label="第一页"
						>
							<ChevronFirst className="h-4 w-4" aria-hidden="true" />
						</button>
						<button
							type="button"
							className="table-icon-button"
							onClick={() => goToPage(pagination.pageIndex - 1)}
							disabled={!canPreviousPage}
							aria-label="上一页"
						>
							<ChevronLeft className="h-4 w-4" aria-hidden="true" />
						</button>
						<button
							type="button"
							className="table-icon-button"
							onClick={() => goToPage(pagination.pageIndex + 1)}
							disabled={!canNextPage}
							aria-label="下一页"
						>
							<ChevronRight className="h-4 w-4" aria-hidden="true" />
						</button>
						<button
							type="button"
							className="table-icon-button"
							onClick={() => goToPage(pageCount - 1)}
							disabled={!canNextPage}
							aria-label="最后一页"
						>
							<ChevronLast className="h-4 w-4" aria-hidden="true" />
						</button>
					</div>
					<div className="flex flex-wrap items-center gap-3 text-sm font-bold text-[var(--sea-ink-soft)]">
						<span>
							第 {pagination.pageIndex + 1} / {pageCount} 页
						</span>
						<label className="table-page-jump">
							跳转
							<input
								type="number"
								min="1"
								max={pageCount}
								value={pagination.pageIndex + 1}
								onChange={(e) => {
									const page = e.target.value ? Number(e.target.value) - 1 : 0;
									goToPage(page);
								}}
							/>
						</label>
						<select
							value={pagination.pageSize}
							onChange={(e) => {
								updatePageSize(Number(e.target.value));
							}}
							className="table-select table-select-fit"
							aria-label="每页条数"
						>
							{[10, 20, 30, 40, 50].map((pageSize) => (
								<option key={pageSize} value={pageSize}>
									每页 {pageSize}
								</option>
							))}
						</select>
					</div>
				</div>

				<details className="table-debug-panel">
					<summary>查看当前筛选状态 JSON</summary>
					<pre>
						{JSON.stringify(
							{
								columnFilters: table.getState().columnFilters,
								globalFilter: table.getState().globalFilter,
							},
							null,
							2,
						)}
					</pre>
				</details>
			</section>
		</main>
	);
}

function TableStatCard({ stat }: { stat: TableStat }) {
	const Icon = stat.icon;

	return (
		<div className={`table-stat-card table-stat-${stat.tone}`}>
			<div className="flex items-center justify-between gap-3">
				<span className="table-stat-icon">
					<Icon className="h-5 w-5" aria-hidden="true" />
				</span>
				<span className="text-xs font-extrabold text-[var(--sea-ink-soft)]">
					{stat.hint}
				</span>
			</div>
			<p className="mt-5 text-sm font-bold text-[var(--sea-ink-soft)]">
				{stat.label}
			</p>
			<p className="mt-2 text-3xl font-extrabold text-[var(--sea-ink)]">
				{stat.value}
			</p>
		</div>
	);
}

function Filter({ column }: { column: Column<Person, unknown> }) {
	const columnFilterValue = column.getFilterValue();
	const placeholder = filterPlaceholders[column.id] ?? "过滤";

	return (
		<DebouncedInput
			type="text"
			value={(columnFilterValue ?? "") as string}
			onChange={(value) => column.setFilterValue(value)}
			placeholder={placeholder}
			className="table-filter-input"
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
	const onChangeRef = React.useRef(onChange);
	const hasMountedRef = React.useRef(false);

	React.useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	React.useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	React.useEffect(() => {
		if (!hasMountedRef.current) {
			hasMountedRef.current = true;
			return;
		}

		const timeout = setTimeout(() => {
			onChangeRef.current(value);
		}, debounce);

		return () => clearTimeout(timeout);
	}, [debounce, value]);

	return (
		<input
			{...props}
			value={value}
			onChange={(e) => setValue(e.target.value)}
		/>
	);
}
