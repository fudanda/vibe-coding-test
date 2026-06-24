import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { demoPersonStatuses } from "../data/demo-table-data";

export const todos = sqliteTable("todos", {
	id: integer({ mode: "number" }).primaryKey({
		autoIncrement: true,
	}),
	title: text().notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).default(
		sql`(unixepoch())`,
	),
});

export const demoPeople = sqliteTable("demo_people", {
	id: integer({ mode: "number" }).primaryKey({
		autoIncrement: true,
	}),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	age: integer({ mode: "number" }).notNull(),
	visits: integer({ mode: "number" }).notNull(),
	progress: integer({ mode: "number" }).notNull(),
	status: text({ enum: demoPersonStatuses }).notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).default(
		sql`(unixepoch())`,
	),
});
