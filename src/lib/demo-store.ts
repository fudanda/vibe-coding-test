import { Store } from "@tanstack/store";

export const demoStoreRoles = [
	"AI 协作负责人",
	"前端工程师",
	"Review Owner",
	"验证负责人",
] as const;

export const demoStoreModes = ["计划中", "实现中", "验证中", "可交接"] as const;

export type DemoStoreRole = (typeof demoStoreRoles)[number];
export type DemoStoreMode = (typeof demoStoreModes)[number];

export type DemoStoreState = {
	firstName: string;
	lastName: string;
	role: DemoStoreRole;
	mode: DemoStoreMode;
	focus: string;
	confidence: number;
};

export const initialDemoStoreState: DemoStoreState = {
	firstName: "Jane",
	lastName: "Smith",
	role: "AI 协作负责人",
	mode: "验证中",
	focus: "表格示例数据层验收",
	confidence: 86,
};

export const store = new Store<DemoStoreState>(initialDemoStoreState);

export const fullName = new Store(deriveFullName(initialDemoStoreState));
export const statusSummary = new Store(
	deriveStatusSummary(initialDemoStoreState),
);

export function updateDemoStore(patch: Partial<DemoStoreState>) {
	store.setState((state) => ({ ...state, ...patch }));
	syncDerivedState(store.state);
}

export function resetDemoStore() {
	store.setState(() => initialDemoStoreState);
	syncDerivedState(store.state);
}

function deriveFullName(state: DemoStoreState) {
	const name = [state.firstName.trim(), state.lastName.trim()]
		.filter(Boolean)
		.join(" ");

	return name || "未命名成员";
}

function deriveStatusSummary(state: DemoStoreState) {
	return `${deriveFullName(state)} · ${state.role} · ${state.mode}`;
}

function syncDerivedState(state: DemoStoreState) {
	fullName.setState(() => deriveFullName(state));
	statusSummary.setState(() => deriveStatusSummary(state));
}

export const demoStoreDerivedSubscription = store.subscribe(syncDerivedState);
