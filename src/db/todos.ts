import { count, desc, sql } from "drizzle-orm";

import { db } from "./index";
import { todos } from "./schema";

export type CreateTodoInput = {
	title: string;
};

let initialized = false;

const todoSeed: CreateTodoInput[] = [
	{ title: "梳理 Vibe Coding 需求边界" },
	{ title: "补齐变更记录和验证证据" },
	{ title: "生成中文 Lore 提交信息草案" },
];

export function ensureTodosTable() {
	if (initialized) return;

	db.run(sql`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      created_at INTEGER DEFAULT (unixepoch())
    )
  `);

	const [row] = db.select({ value: count() }).from(todos).all();

	if ((row?.value ?? 0) === 0) {
		db.insert(todos).values(todoSeed).run();
	}

	initialized = true;
}

export function listTodos() {
	ensureTodosTable();

	return db.query.todos.findMany({
		orderBy: [desc(todos.createdAt), desc(todos.id)],
	});
}

export function createTodoItem(input: CreateTodoInput) {
	ensureTodosTable();

	db.insert(todos)
		.values({ title: normalizeTodoTitle(input.title) })
		.run();
	return { success: true };
}

export function resetTodoItems() {
	ensureTodosTable();

	db.transaction((tx) => {
		tx.delete(todos).run();
		tx.run(sql`DELETE FROM sqlite_sequence WHERE name = 'todos'`);
		tx.insert(todos).values(todoSeed).run();
	});

	return listTodos();
}

function normalizeTodoTitle(value: unknown) {
	if (typeof value !== "string") return "新的数据库任务";

	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed.slice(0, 120) : "新的数据库任务";
}
