import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { listTodos } from "#/db/todos";

const getQueryTodos = createServerFn({
	method: "GET",
}).handler(async () => {
	return await listTodos();
});

export const Route = createFileRoute("/demo/tanstack-query")({
	component: TanStackQueryDemo,
});

function TanStackQueryDemo() {
	const { data, error, isError, isFetching, isLoading, refetch } = useQuery({
		queryKey: ["query-demo", "todos"],
		queryFn: () => getQueryTodos(),
	});

	return (
		<main className="demo-page demo-center">
			<section className="demo-panel w-full max-w-2xl">
				<p className="island-kicker mb-2">TanStack Query</p>
				<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<h1 className="demo-title">真实数据库查询示例</h1>
						<p className="demo-muted mt-3 text-sm">
							React Query 通过 Server Function 读取 SQLite 的 todos 表。
						</p>
					</div>
					<button
						type="button"
						className="demo-button whitespace-nowrap"
						onClick={() => refetch()}
						disabled={isFetching}
					>
						{isFetching ? "刷新中..." : "重新查询"}
					</button>
				</div>

				{isLoading ? (
					<div className="demo-list-item text-center demo-muted">
						正在查询数据库...
					</div>
				) : null}

				{isError ? (
					<div className="demo-list-item border-red-200 bg-red-50 text-red-700">
						查询失败：{error instanceof Error ? error.message : "未知错误"}
					</div>
				) : null}

				{!isLoading && !isError && data?.length === 0 ? (
					<div className="demo-list-item text-center demo-muted">
						数据库暂无 Todo 记录。
					</div>
				) : null}

				<ul className="mb-4 space-y-2">
					{data?.map((todo) => (
						<li key={todo.id} className="demo-list-item">
							<div className="flex items-center justify-between gap-3">
								<span className="text-base font-medium">{todo.title}</span>
								<span className="demo-muted text-xs">#{todo.id}</span>
							</div>
						</li>
					))}
				</ul>

				<div className="demo-card mt-6">
					<h2 className="demo-section-title mb-2">查询来源</h2>
					<p className="demo-muted text-sm">
						数据来自本地 SQLite 数据库。首次访问会复用数据库模块自动创建的
						<code className="mx-1">todos</code>
						演示表和种子数据。
					</p>
				</div>
			</section>
		</main>
	);
}
