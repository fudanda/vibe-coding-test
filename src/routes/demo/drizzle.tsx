import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
	Activity,
	ArrowRight,
	Database,
	FileCode2,
	ListChecks,
	type LucideIcon,
	Plus,
	RefreshCw,
	RotateCcw,
	Server,
	ShieldCheck,
	Sparkles,
} from "lucide-react";
import React from "react";

const getTodos = createServerFn({
	method: "GET",
}).handler(async () => {
	const { listTodos } = await import("#/db/todos");
	return await listTodos();
});

const createTodo = createServerFn({
	method: "POST",
})
	.validator(normalizeTodoInput)
	.handler(async ({ data }) => {
		const { createTodoItem } = await import("#/db/todos");
		return createTodoItem(data);
	});

const resetTodos = createServerFn({
	method: "POST",
}).handler(async () => {
	const { resetTodoItems } = await import("#/db/todos");
	return resetTodoItems();
});

export const Route = createFileRoute("/demo/drizzle")({
	component: DemoDrizzle,
	loader: async () => await getTodos(),
});

type TodoItem = {
	id: number;
	title: string;
	createdAt: Date | string | number | null;
};

type DatabaseStat = {
	label: string;
	value: string;
	hint: string;
	icon: LucideIcon;
	tone: "lagoon" | "indigo" | "amber";
};

const flowSteps = [
	["01", "Route Loader", "页面进入时读取 todos 表。"],
	["02", "Server Function", "新增、重置和刷新都穿过服务端边界。"],
	["03", "Drizzle ORM", "通过 better-sqlite3 执行本地 SQLite 查询。"],
];

const schemaRows = [
	["id", "integer primary key", "自增主键"],
	["title", "text not null", "Todo 标题"],
	["created_at", "integer timestamp", "默认 unixepoch()"],
];

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
});

function normalizeTodoInput(data: unknown) {
	const input = data as Partial<Record<"title", unknown>>;

	return {
		title: typeof input.title === "string" ? input.title : "",
	};
}

function formatTodoDate(value: TodoItem["createdAt"]) {
	if (!value) return "未记录";

	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return "未记录";

	return dateFormatter.format(date);
}

function DemoDrizzle() {
	const router = useRouter();
	const todos = Route.useLoaderData();
	const [actionError, setActionError] = React.useState("");
	const [isCreating, setIsCreating] = React.useState(false);
	const [isResetting, setIsResetting] = React.useState(false);
	const [isRefreshing, setIsRefreshing] = React.useState(false);

	const latestTodo = todos[0];
	const databaseStats: DatabaseStat[] = [
		{
			label: "Todo 记录",
			value: String(todos.length).padStart(2, "0"),
			hint: "todos",
			icon: ListChecks,
			tone: "lagoon",
		},
		{
			label: "最新写入",
			value: latestTodo ? `#${latestTodo.id}` : "--",
			hint: latestTodo ? formatTodoDate(latestTodo.createdAt) : "等待种子",
			icon: Activity,
			tone: "indigo",
		},
		{
			label: "数据入口",
			value: "3",
			hint: "loader / create / reset",
			icon: Sparkles,
			tone: "amber",
		},
	];

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setActionError("");

		const form = e.currentTarget;
		const formData = new FormData(form);
		const title = String(formData.get("title") ?? "").trim();

		if (!title) {
			setActionError("请输入 Todo 标题。");
			return;
		}

		setIsCreating(true);
		try {
			await createTodo({ data: { title } });
			form.reset();
			await router.invalidate();
		} catch (error) {
			console.error("Failed to create todo:", error);
			setActionError("新增 Todo 失败，请检查 SQLite 连接和 server function。");
		} finally {
			setIsCreating(false);
		}
	};

	const handleRefresh = async () => {
		setActionError("");
		setIsRefreshing(true);
		try {
			await router.invalidate();
		} catch (error) {
			console.error("Failed to refresh todos:", error);
			setActionError("刷新数据库记录失败。");
		} finally {
			setIsRefreshing(false);
		}
	};

	const handleReset = async () => {
		setActionError("");
		setIsResetting(true);
		try {
			await resetTodos();
			await router.invalidate();
		} catch (error) {
			console.error("Failed to reset todos:", error);
			setActionError("重置演示数据失败，请检查 SQLite 写入权限。");
		} finally {
			setIsResetting(false);
		}
	};

	return (
		<main className="db-console-shell px-4 py-10 sm:px-6 lg:px-8">
			<section className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6">
				<header className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
					<div className="db-hero-panel">
						<div className="mb-6 flex flex-wrap items-center gap-3">
							<span className="db-icon-node">
								<Database className="h-5 w-5" aria-hidden="true" />
							</span>
							<p className="island-kicker m-0">Drizzle Database Console</p>
							<span className="db-live-chip">
								<span className="db-live-dot" />
								SQLite live
							</span>
						</div>
						<h1 className="display-title max-w-3xl text-4xl leading-tight sm:text-5xl">
							数据库示例工作台
						</h1>
						<p className="mt-4 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
							本页通过 TanStack Start server function 访问 Drizzle ORM，
							实时读取和写入本地 SQLite 的 <code>todos</code> 表。
						</p>
						<div className="db-command-strip mt-6">
							<span>DATABASE_URL</span>
							<strong>dev.db</strong>
							<ArrowRight className="h-4 w-4" aria-hidden="true" />
							<span>todos</span>
						</div>
					</div>

					<aside className="db-flow-panel" aria-labelledby="db-flow-title">
						<div className="mb-5 flex items-start justify-between gap-4">
							<div>
								<p className="island-kicker mb-2">Data Path</p>
								<h2
									id="db-flow-title"
									className="text-xl font-extrabold text-[var(--sea-ink)]"
								>
									读写链路
								</h2>
							</div>
							<Server
								className="h-6 w-6 text-[var(--indigo)]"
								aria-hidden="true"
							/>
						</div>
						<div className="space-y-3">
							{flowSteps.map(([step, title, desc]) => (
								<div className="db-flow-step" key={step}>
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

				<div className="grid gap-4 md:grid-cols-3">
					{databaseStats.map((stat) => (
						<DatabaseStatCard key={stat.label} stat={stat} />
					))}
				</div>

				{actionError ? (
					<div className="db-error-message" role="alert">
						{actionError}
					</div>
				) : null}

				<div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
					<section
						className="db-mutation-panel"
						aria-labelledby="db-write-title"
					>
						<div className="mb-5 flex items-start justify-between gap-4">
							<div>
								<p className="island-kicker mb-2">Mutation</p>
								<h2
									id="db-write-title"
									className="text-2xl font-extrabold text-[var(--sea-ink)]"
								>
									写入 Todo
								</h2>
							</div>
							<ShieldCheck
								className="h-6 w-6 text-[var(--lagoon-deep)]"
								aria-hidden="true"
							/>
						</div>
						<form onSubmit={handleSubmit} className="space-y-3">
							<label className="db-input-label" htmlFor="todo-title">
								Todo 标题
							</label>
							<div className="db-input-row">
								<input
									id="todo-title"
									type="text"
									name="title"
									placeholder="例如：补齐数据库验证证据"
									className="db-input"
									autoComplete="off"
								/>
								<button
									type="submit"
									className="db-action-button"
									disabled={isCreating}
								>
									<Plus className="h-4 w-4" aria-hidden="true" />
									{isCreating ? "写入中" : "写入"}
								</button>
							</div>
						</form>

						<div className="mt-5 flex flex-wrap gap-2">
							<button
								type="button"
								className="db-action-button db-action-secondary"
								onClick={handleRefresh}
								disabled={isRefreshing}
							>
								<RefreshCw
									className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
									aria-hidden="true"
								/>
								重新读取
							</button>
							<button
								type="button"
								className="db-action-button db-action-secondary"
								onClick={handleReset}
								disabled={isResetting}
							>
								<RotateCcw
									className={`h-4 w-4 ${isResetting ? "animate-spin" : ""}`}
									aria-hidden="true"
								/>
								{isResetting ? "重置中" : "重置样例"}
							</button>
						</div>

						<div className="db-schema-panel mt-5">
							<div className="mb-4 flex items-center gap-2">
								<FileCode2 className="h-4 w-4" aria-hidden="true" />
								<h3 className="font-extrabold text-[var(--sea-ink)]">
									todos schema
								</h3>
							</div>
							<div className="space-y-2">
								{schemaRows.map(([field, type, desc]) => (
									<div className="db-schema-row" key={field}>
										<code>{field}</code>
										<span>{type}</span>
										<strong>{desc}</strong>
									</div>
								))}
							</div>
						</div>
					</section>

					<section
						className="db-records-panel"
						aria-labelledby="db-record-title"
					>
						<div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
							<div>
								<p className="island-kicker mb-2">Records</p>
								<h2
									id="db-record-title"
									className="text-2xl font-extrabold text-[var(--sea-ink)]"
								>
									真实数据库记录
								</h2>
							</div>
							<span className="db-live-chip">{todos.length} 条记录</span>
						</div>

						<ul className="db-record-list">
							{todos.map((todo) => (
								<li key={todo.id} className="db-record-row">
									<span className="db-record-id">#{todo.id}</span>
									<div className="min-w-0">
										<p className="truncate font-extrabold text-[var(--sea-ink)]">
											{todo.title}
										</p>
										<p className="mt-1 text-sm font-bold text-[var(--sea-ink-soft)]">
											写入时间：{formatTodoDate(todo.createdAt)}
										</p>
									</div>
								</li>
							))}
							{todos.length === 0 ? (
								<li className="db-empty-row">暂无记录，先写入一条 Todo。</li>
							) : null}
						</ul>
					</section>
				</div>
			</section>
		</main>
	);
}

function DatabaseStatCard({ stat }: { stat: DatabaseStat }) {
	const Icon = stat.icon;

	return (
		<div className={`db-stat-card db-stat-${stat.tone}`}>
			<div className="flex items-center justify-between gap-3">
				<span className="db-stat-icon">
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
