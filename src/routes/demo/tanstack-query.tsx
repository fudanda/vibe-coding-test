import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
	Activity,
	AlertTriangle,
	CheckCircle2,
	Clock3,
	Database,
	type LucideIcon,
	RefreshCw,
	Server,
	Sparkles,
} from "lucide-react";
import { listTodos } from "#/db/todos";

const getQueryTodos = createServerFn({
	method: "GET",
}).handler(async () => {
	return await listTodos();
});

export const Route = createFileRoute("/demo/tanstack-query")({
	component: TanStackQueryDemo,
});

type QueryStat = {
	label: string;
	value: string;
	hint: string;
	icon: LucideIcon;
	tone: "lagoon" | "indigo" | "amber";
};

const pipelineSteps = [
	["01", "React Query", "管理查询状态、缓存和重新请求。"],
	["02", "Server Function", "把浏览器请求收束到服务端边界。"],
	["03", "SQLite todos", "读取本地真实数据库演示记录。"],
];

function TanStackQueryDemo() {
	const {
		data,
		dataUpdatedAt,
		error,
		isError,
		isFetching,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["query-demo", "todos"],
		queryFn: () => getQueryTodos(),
	});

	const todos = data ?? [];
	const latestId =
		todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) : 0;
	const updatedAt =
		dataUpdatedAt > 0
			? new Date(dataUpdatedAt).toLocaleTimeString("zh-CN", {
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
				})
			: "等待查询";
	const queryState = isLoading
		? "正在查询"
		: isError
			? "查询异常"
			: isFetching
				? "正在同步"
				: "已同步";
	const queryStats: QueryStat[] = [
		{
			label: "结果数量",
			value: String(todos.length).padStart(2, "0"),
			hint: "SQLite todos",
			icon: Database,
			tone: "lagoon",
		},
		{
			label: "最新编号",
			value: latestId > 0 ? `#${latestId}` : "--",
			hint: "按数据库记录",
			icon: Activity,
			tone: "indigo",
		},
		{
			label: "最近同步",
			value: updatedAt,
			hint: queryState,
			icon: Clock3,
			tone: "amber",
		},
	];

	return (
		<main className="query-console-shell px-4 py-10 sm:px-6 lg:px-8">
			<section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6">
				<header className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
					<div className="query-hero-panel">
						<div className="mb-6 flex flex-wrap items-center gap-3">
							<span className="query-icon-node">
								<Database className="h-5 w-5" aria-hidden="true" />
							</span>
							<p className="island-kicker m-0">TanStack Query Console</p>
							<span className="query-status-chip">
								<span className="query-live-dot" />
								{queryState}
							</span>
						</div>
						<h1 className="display-title max-w-3xl text-4xl leading-tight sm:text-5xl">
							真实数据库查询示例
						</h1>
						<p className="mt-4 max-w-2xl text-base leading-8 text-[var(--sea-ink-soft)]">
							用 React Query 触发 Server Function，实时读取 SQLite 的
							<code className="mx-1">todos</code>
							表。这个页面展示的是查询状态、数据链路和真实结果流。
						</p>
						<div className="mt-6 flex flex-wrap gap-2">
							<span className="query-token">query-demo / todos</span>
							<span className="query-token">GET server function</span>
							<span className="query-token">SQLite live data</span>
						</div>
					</div>

					<aside
						className="query-status-panel"
						aria-labelledby="query-control-title"
					>
						<div className="flex items-start justify-between gap-4">
							<div>
								<p className="island-kicker mb-2">Control</p>
								<h2
									id="query-control-title"
									className="text-xl font-extrabold text-[var(--sea-ink)]"
								>
									查询控制
								</h2>
							</div>
							<Sparkles
								className="h-6 w-6 text-[var(--indigo)]"
								aria-hidden="true"
							/>
						</div>
						<p className="mt-3 text-sm leading-6 text-[var(--sea-ink-soft)]">
							刷新只重新请求当前 query key，不会修改数据库内容。
						</p>
						<button
							type="button"
							className="query-refresh-button mt-6"
							onClick={() => void refetch()}
							disabled={isFetching}
						>
							<RefreshCw
								className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
								aria-hidden="true"
							/>
							{isFetching ? "正在同步" : "重新查询"}
						</button>
					</aside>
				</header>

				<div className="grid gap-4 md:grid-cols-3">
					{queryStats.map((stat) => (
						<QueryStatCard key={stat.label} stat={stat} />
					))}
				</div>

				<div className="grid gap-6 lg:grid-cols-[1fr_360px]">
					<section className="query-results-panel">
						<div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<p className="island-kicker mb-2">Result Stream</p>
								<h2 className="text-2xl font-extrabold text-[var(--sea-ink)]">
									查询结果
								</h2>
							</div>
							<span className="query-count-badge">{todos.length} 条记录</span>
						</div>

						{isLoading ? (
							<QueryStateMessage
								icon={Activity}
								title="正在查询数据库"
								desc="React Query 正在等待 Server Function 返回结果。"
							/>
						) : null}

						{isError ? (
							<QueryStateMessage
								icon={AlertTriangle}
								title="查询失败"
								desc={error instanceof Error ? error.message : "未知错误"}
								tone="danger"
							/>
						) : null}

						{!isLoading && !isError && todos.length === 0 ? (
							<QueryStateMessage
								icon={Database}
								title="数据库暂无 Todo 记录"
								desc="当前查询成功，但 todos 表还没有可展示的数据。"
							/>
						) : null}

						<ul className="space-y-3">
							{todos.map((todo, index) => (
								<li key={todo.id} className="query-result-row">
									<div className="flex min-w-0 items-center gap-3">
										<span className="query-row-index">
											{String(index + 1).padStart(2, "0")}
										</span>
										<div className="min-w-0">
											<p className="truncate text-base font-extrabold text-[var(--sea-ink)]">
												{todo.title}
											</p>
											<p className="mt-1 text-xs font-bold uppercase text-[var(--sea-ink-soft)]">
												SQLite row id {todo.id}
											</p>
										</div>
									</div>
									<CheckCircle2
										className="h-5 w-5 shrink-0 text-[var(--lagoon-deep)]"
										aria-hidden="true"
									/>
								</li>
							))}
						</ul>
					</section>

					<aside
						className="query-source-panel"
						aria-labelledby="query-path-title"
					>
						<p className="island-kicker mb-3">Data Path</p>
						<h2
							id="query-path-title"
							className="mb-5 text-xl font-extrabold text-[var(--sea-ink)]"
						>
							查询链路
						</h2>
						<div className="space-y-3">
							{pipelineSteps.map(([step, title, desc]) => (
								<div className="query-pipeline-step" key={step}>
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
						<div className="query-command-panel mt-5">
							<div className="mb-3 flex items-center gap-2">
								<Server className="h-4 w-4" aria-hidden="true" />
								<span>source</span>
							</div>
							<code>src/db/todos.ts</code>
						</div>
					</aside>
				</div>
			</section>
		</main>
	);
}

function QueryStatCard({ stat }: { stat: QueryStat }) {
	const Icon = stat.icon;

	return (
		<div className={`query-stat-card query-stat-${stat.tone}`}>
			<div className="flex items-center justify-between gap-3">
				<span className="query-stat-icon">
					<Icon className="h-5 w-5" aria-hidden="true" />
				</span>
				<span className="text-xs font-extrabold uppercase text-[var(--sea-ink-soft)]">
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

function QueryStateMessage({
	desc,
	icon: Icon,
	title,
	tone = "neutral",
}: {
	desc: string;
	icon: LucideIcon;
	title: string;
	tone?: "neutral" | "danger";
}) {
	return (
		<div className={`query-state-message query-state-${tone}`}>
			<Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
			<div>
				<p className="font-extrabold">{title}</p>
				<p className="mt-1 text-sm leading-6">{desc}</p>
			</div>
		</div>
	);
}
