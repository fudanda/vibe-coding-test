import { asc, count, sql } from "drizzle-orm";

import {
	type DemoPersonSeed,
	type DemoPersonStatus,
	demoPeopleSeed,
	demoPersonStatuses,
	type Person,
} from "#/data/demo-table-data";
import { db } from "./index";
import { demoPeople } from "./schema";

export type CreateDemoPersonInput = DemoPersonSeed;

let initialized = false;

export function ensureDemoPeopleTable() {
	if (initialized) return;

	db.run(sql`
    CREATE TABLE IF NOT EXISTS demo_people (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      age INTEGER NOT NULL,
      visits INTEGER NOT NULL,
      progress INTEGER NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('relationship', 'complicated', 'single')),
      created_at INTEGER DEFAULT (unixepoch())
    )
  `);

	const [row] = db.select({ value: count() }).from(demoPeople).all();

	if ((row?.value ?? 0) === 0) {
		db.insert(demoPeople).values(demoPeopleSeed).run();
	}

	initialized = true;
}

export function listDemoPeople(): Person[] {
	ensureDemoPeopleTable();

	return db
		.select({
			id: demoPeople.id,
			firstName: demoPeople.firstName,
			lastName: demoPeople.lastName,
			age: demoPeople.age,
			visits: demoPeople.visits,
			progress: demoPeople.progress,
			status: demoPeople.status,
		})
		.from(demoPeople)
		.orderBy(asc(demoPeople.id))
		.all();
}

export function createDemoPerson(input: CreateDemoPersonInput): Person {
	ensureDemoPeopleTable();

	return db
		.insert(demoPeople)
		.values(input)
		.returning({
			id: demoPeople.id,
			firstName: demoPeople.firstName,
			lastName: demoPeople.lastName,
			age: demoPeople.age,
			visits: demoPeople.visits,
			progress: demoPeople.progress,
			status: demoPeople.status,
		})
		.get();
}

export function resetDemoPeople(): Person[] {
	ensureDemoPeopleTable();
	db.delete(demoPeople).run();
	db.insert(demoPeople).values(demoPeopleSeed).run();
	return listDemoPeople();
}

export function normalizeDemoPersonInput(data: unknown): CreateDemoPersonInput {
	const input = data as Partial<Record<keyof CreateDemoPersonInput, unknown>>;

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
