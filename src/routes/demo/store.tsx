import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import {
	Activity,
	BrainCircuit,
	CheckCircle2,
	CircuitBoard,
	Gauge,
	type LucideIcon,
	RadioTower,
	RefreshCcw,
	SlidersHorizontal,
	Sparkles,
	UserRound,
	Workflow,
} from "lucide-react";

import {
	type DemoStoreMode,
	type DemoStoreRole,
	demoStoreModes,
	demoStoreRoles,
	fullName,
	resetDemoStore,
	statusSummary,
	store,
	updateDemoStore,
} from "#/lib/demo-store";

export const Route = createFileRoute("/demo/store")({
	component: DemoStore,
});

type StoreMetric = {
	label: string;
	value: string;
	hint: string;
	icon: LucideIcon;
	tone: "lagoon" | "indigo" | "amber";
};

const propagationSteps = [
	["01", "基础 Store", "姓名、角色、阶段、关注点和信心分都写入同一个 Store。"],
	["02", "派生 Store", "fullName 和 statusSummary 由订阅同步刷新。"],
	["03", "Devtools Event", "自定义面板接收 store-devtools:state 事件。"],
];

function DemoStore() {
	const state = useStore(store, (value) => value);
	const name = useStore(fullName, (value) => value);
	const summary = useStore(statusSummary, (value) => value);
	const initials = getInitials(state.firstName, state.lastName);
	const confidenceTone =
		state.confidence >= 85
			? "高可信"
			: state.confidence >= 68
				? "稳定"
				: "需关注";
	const metrics: StoreMetric[] = [
		{
			label: "基础字段",
			value: "06",
			hint: "Store state",
			icon: CircuitBoard,
			tone: "lagoon",
		},
		{
			label: "派生状态",
			value: "02",
			hint: "fullName / summary",
			icon: Workflow,
			tone: "indigo",
		},
		{
			label: "信心分",
			value: `${state.confidence}%`,
			hint: confidenceTone,
			icon: Gauge,
			tone: "amber",
		},
	];
	const snapshot = {
		store: state,
		derived: {
			fullName: name,
			statusSummary: summary,
		},
	};

	return (
		<main className="store-console-shell px-4 py-10 sm:px-6 lg:px-8">
			<section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6">
				<header className="grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
					<div className="store-hero-panel">
						<div className="mb-6 flex flex-wrap items-center gap-3">
							<span className="store-icon-node">
								<BrainCircuit className="h-5 w-5" aria-hidden="true" />
							</span>
							<p className="island-kicker m-0">TanStack Store Console</p>
							<span className="store-status-chip">
								<span className="store-live-dot" />
								状态已订阅
							</span>
						</div>
						<h1 className="display-title max-w-3xl text-4xl leading-tight sm:text-5xl">
							状态示例
						</h1>
						<p className="mt-4 max-w-2xl text-base leading-8 text-[var(--sea-ink-soft)]">
							用 TanStack Store 管理一个 AI
							协作任务的实时状态。编辑左侧字段后，基础 Store、派生 Store 和
							Devtools 面板会同步刷新。
						</p>
						<div className="mt-6 flex flex-wrap gap-2">
							<span className="store-token">store.setState</span>
							<span className="store-token">selector subscribe</span>
							<span className="store-token">derived store</span>
						</div>
					</div>

					<aside
						className="store-live-panel"
						aria-labelledby="store-live-title"
					>
						<div className="flex items-start justify-between gap-4">
							<div>
								<p className="island-kicker mb-2">Live Snapshot</p>
								<h2
									id="store-live-title"
									className="text-xl font-extrabold text-[var(--sea-ink)]"
								>
									当前状态
								</h2>
							</div>
							<Sparkles
								className="h-6 w-6 text-[var(--indigo)]"
								aria-hidden="true"
							/>
						</div>
						<div className="mt-6 flex items-center gap-4">
							<div className="store-avatar" aria-hidden="true">
								{initials}
							</div>
							<div className="min-w-0">
								<p className="truncate text-2xl font-black text-[var(--sea-ink)]">
									{name}
								</p>
								<p className="mt-1 text-sm font-bold text-[var(--sea-ink-soft)]">
									{state.role}
								</p>
							</div>
						</div>
						<div className="store-summary-line mt-6">
							<CheckCircle2 className="h-4 w-4" aria-hidden="true" />
							<span>{summary}</span>
						</div>
						<div className="mt-5">
							<div className="mb-2 flex justify-between text-xs font-black uppercase text-[var(--sea-ink-soft)]">
								<span>Confidence</span>
								<span>{state.confidence}%</span>
							</div>
							<div className="store-confidence-track">
								<span style={{ width: `${state.confidence}%` }} />
							</div>
						</div>
					</aside>
				</header>

				<div className="grid gap-4 md:grid-cols-3">
					{metrics.map((metric) => (
						<StoreMetricCard key={metric.label} metric={metric} />
					))}
				</div>

				<div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
					<section
						className="store-control-panel"
						aria-labelledby="store-control-title"
					>
						<div className="mb-5 flex items-start justify-between gap-4">
							<div>
								<p className="island-kicker mb-2">State Inputs</p>
								<h2
									id="store-control-title"
									className="text-2xl font-extrabold text-[var(--sea-ink)]"
								>
									编辑基础状态
								</h2>
							</div>
							<button
								type="button"
								className="store-icon-button"
								onClick={resetDemoStore}
								aria-label="重置状态"
								title="重置状态"
							>
								<RefreshCcw className="h-4 w-4" aria-hidden="true" />
							</button>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<StoreField icon={UserRound} label="First Name">
								<input
									type="text"
									className="store-input"
									value={state.firstName}
									onChange={(event) =>
										updateDemoStore({ firstName: event.target.value })
									}
									aria-label="First Name"
								/>
							</StoreField>
							<StoreField icon={UserRound} label="Last Name">
								<input
									type="text"
									className="store-input"
									value={state.lastName}
									onChange={(event) =>
										updateDemoStore({ lastName: event.target.value })
									}
									aria-label="Last Name"
								/>
							</StoreField>
							<StoreField icon={BrainCircuit} label="角色">
								<select
									className="store-select"
									value={state.role}
									onChange={(event) =>
										updateDemoStore({
											role: event.target.value as DemoStoreRole,
										})
									}
									aria-label="角色"
								>
									{demoStoreRoles.map((role) => (
										<option key={role} value={role}>
											{role}
										</option>
									))}
								</select>
							</StoreField>
							<StoreField icon={Activity} label="阶段">
								<select
									className="store-select"
									value={state.mode}
									onChange={(event) =>
										updateDemoStore({
											mode: event.target.value as DemoStoreMode,
										})
									}
									aria-label="阶段"
								>
									{demoStoreModes.map((mode) => (
										<option key={mode} value={mode}>
											{mode}
										</option>
									))}
								</select>
							</StoreField>
						</div>

						<StoreField icon={RadioTower} label="关注任务">
							<input
								type="text"
								className="store-input"
								value={state.focus}
								onChange={(event) =>
									updateDemoStore({ focus: event.target.value })
								}
								aria-label="关注任务"
							/>
						</StoreField>

						<div className="store-range-field">
							<div className="flex items-center justify-between gap-4">
								<div className="flex items-center gap-2">
									<SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
									<span>信心分</span>
								</div>
								<strong>{state.confidence}%</strong>
							</div>
							<input
								type="range"
								min="40"
								max="99"
								value={state.confidence}
								onChange={(event) =>
									updateDemoStore({ confidence: Number(event.target.value) })
								}
								aria-label="信心分"
							/>
						</div>
					</section>

					<section
						className="store-dev-panel"
						aria-labelledby="store-dev-title"
					>
						<div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<p className="island-kicker mb-2">State Propagation</p>
								<h2
									id="store-dev-title"
									className="text-2xl font-extrabold text-[var(--sea-ink)]"
								>
									状态传播链路
								</h2>
							</div>
							<span className="store-status-chip">
								<RadioTower className="mr-2 h-4 w-4" aria-hidden="true" />
								store-devtools:state
							</span>
						</div>

						<div className="grid gap-3">
							{propagationSteps.map(([step, title, desc]) => (
								<div key={step} className="store-flow-step">
									<span>{step}</span>
									<div>
										<h3 className="font-black text-[var(--sea-ink)]">
											{title}
										</h3>
										<p className="mt-1 text-sm leading-6 text-[var(--sea-ink-soft)]">
											{desc}
										</p>
									</div>
								</div>
							))}
						</div>

						<div className="store-json-panel mt-5">
							<div className="mb-3 flex items-center justify-between gap-3">
								<span>LIVE JSON</span>
								<code>selector snapshot</code>
							</div>
							<pre>{JSON.stringify(snapshot, null, 2)}</pre>
						</div>
					</section>
				</div>
			</section>
		</main>
	);
}

function StoreMetricCard({ metric }: { metric: StoreMetric }) {
	const Icon = metric.icon;

	return (
		<article className={`store-stat-card store-stat-${metric.tone}`}>
			<div className="mb-5 flex items-start justify-between gap-3">
				<span className="store-stat-icon">
					<Icon className="h-5 w-5" aria-hidden="true" />
				</span>
				<span className="text-xs font-black uppercase text-[var(--sea-ink-soft)]">
					{metric.hint}
				</span>
			</div>
			<p className="text-sm font-extrabold text-[var(--sea-ink-soft)]">
				{metric.label}
			</p>
			<strong className="mt-2 block text-3xl font-black text-[var(--sea-ink)]">
				{metric.value}
			</strong>
		</article>
	);
}

function StoreField({
	children,
	icon: Icon,
	label,
}: {
	children: React.ReactNode;
	icon: LucideIcon;
	label: string;
}) {
	return (
		<div className="store-field">
			<span>
				<Icon className="h-4 w-4" aria-hidden="true" />
				{label}
			</span>
			{children}
		</div>
	);
}

function getInitials(firstName: string, lastName: string) {
	const first = firstName.trim().charAt(0);
	const last = lastName.trim().charAt(0);
	const value = `${first}${last}`.trim();

	return value.toUpperCase() || "AI";
}
