import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createTodoItem, listTodos } from "#/db/todos";

const getTodos = createServerFn({
	method: "GET",
}).handler(async () => {
	return await listTodos();
});

const createTodo = createServerFn({
	method: "POST",
})
	.inputValidator((data: { title: string }) => data)
	.handler(async ({ data }) => {
		return createTodoItem(data);
	});

export const Route = createFileRoute("/demo/drizzle")({
	component: DemoDrizzle,
	loader: async () => await getTodos(),
});

function DemoDrizzle() {
	const router = useRouter();
	const todos = Route.useLoaderData();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const title = formData.get("title") as string;

		if (!title) return;

		try {
			await createTodo({ data: { title } });
			router.invalidate();
			(e.target as HTMLFormElement).reset();
		} catch (error) {
			console.error("Failed to create todo:", error);
		}
	};

	return (
		<main className="demo-page demo-center">
			<section className="demo-panel w-full max-w-2xl">
				<header className="mb-8 flex items-center gap-4">
					<span className="demo-card flex h-14 w-14 items-center justify-center p-3">
						<img src="/drizzle.svg" alt="Drizzle Logo" className="h-8 w-8" />
					</span>
					<div>
						<p className="island-kicker mb-2">Database</p>
						<h1 className="demo-title">Drizzle 数据库示例</h1>
					</div>
				</header>

				<h2 className="demo-section-title mb-4">待办事项</h2>

				<ul className="space-y-3 mb-6">
					{todos.map((todo) => (
						<li key={todo.id} className="demo-list-item">
							<div className="flex items-center justify-between">
								<span className="font-medium">{todo.title}</span>
								<span className="demo-muted text-xs">#{todo.id}</span>
							</div>
						</li>
					))}
					{todos.length === 0 && (
						<li className="demo-list-item text-center demo-muted">
							暂无待办事项，先新增一条吧。
						</li>
					)}
				</ul>

				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-2 sm:flex-row"
				>
					<input
						type="text"
						name="title"
						placeholder="新增一条待办事项..."
						className="demo-input min-w-0 flex-1"
					/>
					<button type="submit" className="demo-button whitespace-nowrap">
						新增 Todo
					</button>
				</form>

				<div className="demo-card mt-8">
					<h3 className="demo-section-title mb-2">SQLite + Drizzle ORM</h3>
					<p className="demo-muted mb-4 text-sm">
						本页首次访问时会自动创建 todos 演示表，并写入几条样例数据。
					</p>
					<div className="space-y-2 text-sm">
						<p className="font-medium">本地验证：</p>
						<ol className="demo-muted list-inside list-decimal space-y-2">
							<li>
								在 <code>.env.local</code> 配置 <code>DATABASE_URL</code>
							</li>
							<li>
								启动：<code>npm run dev</code>
							</li>
							<li>
								访问：<code>/demo/drizzle</code>
							</li>
							<li>
								可选：<code>npm run db:studio</code>
							</li>
						</ol>
					</div>
				</div>
			</section>
		</main>
	);
}
