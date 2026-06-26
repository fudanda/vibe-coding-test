import { createFileRoute } from "@tanstack/react-router";
import {
	Activity,
	CalendarDays,
	CheckCircle2,
	FileText,
	Filter,
	GitPullRequest,
	Layers3,
	Network,
	ShieldAlert,
	ShieldCheck,
	Sparkles,
	UserRound,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import {
	type ChangeImpactRecord,
	changeImpactRecords,
	changeTypeLabels,
	reviewStateLabels,
} from "../lib/change-impact-data";

export const Route = createFileRoute("/changes")({
	component: ChangesPage,
});

type GraphNodeKind = "module" | "file" | "verify" | "review" | "risk";

type GraphNode = {
	id: string;
	label: string;
	detail: string;
	kind: GraphNodeKind;
	x: number;
	y: number;
};

const allValue = "all";

const graphPositions: Record<GraphNodeKind, Array<[number, number]>> = {
	module: [
		[24, 28],
		[76, 28],
		[24, 58],
		[76, 58],
	],
	file: [
		[28, 82],
		[50, 86],
		[72, 82],
	],
	verify: [[50, 14]],
	review: [[72, 50]],
	risk: [[28, 50]],
};

function uniqueSorted(values: string[]) {
	return Array.from(new Set(values)).sort((a, b) =>
		a.localeCompare(b, "zh-CN"),
	);
}

function buildGraphNodes(record: ChangeImpactRecord): GraphNode[] {
	const moduleNodes = record.modules.slice(0, 4).map((moduleName, index) => {
		const [x, y] = graphPositions.module[index];

		return {
			id: `module-${moduleName}`,
			label: moduleName,
			detail: "影响模块",
			kind: "module" as const,
			x,
			y,
		};
	});
	const fileNodes = record.files.slice(0, 3).map((filePath, index) => {
		const [x, y] = graphPositions.file[index];

		return {
			id: `file-${filePath}`,
			label: filePath,
			detail: "关键文件",
			kind: "file" as const,
			x,
			y,
		};
	});

	return [
		{
			id: "verify",
			label: `${record.verification.length} 条验证`,
			detail: "验证证据",
			kind: "verify",
			x: graphPositions.verify[0][0],
			y: graphPositions.verify[0][1],
		},
		{
			id: "review",
			label: reviewStateLabels[record.reviewState],
			detail: "Review 门禁",
			kind: "review",
			x: graphPositions.review[0][0],
			y: graphPositions.review[0][1],
		},
		{
			id: "risk",
			label: `${record.risks.length} 项风险`,
			detail: "风险和后续",
			kind: "risk",
			x: graphPositions.risk[0][0],
			y: graphPositions.risk[0][1],
		},
		...moduleNodes,
		...fileNodes,
	];
}

function ChangesPage() {
	const [selectedId, setSelectedId] = useState(
		changeImpactRecords[0]?.id ?? "",
	);
	const [typeFilter, setTypeFilter] = useState(allValue);
	const [moduleFilter, setModuleFilter] = useState(allValue);
	const [authorFilter, setAuthorFilter] = useState(allValue);
	const [dateFilter, setDateFilter] = useState(allValue);
	const [activeNodeId, setActiveNodeId] = useState("review");

	const allModules = useMemo(
		() => uniqueSorted(changeImpactRecords.flatMap((record) => record.modules)),
		[],
	);
	const allAuthors = useMemo(
		() => uniqueSorted(changeImpactRecords.map((record) => record.author)),
		[],
	);
	const allDates = useMemo(
		() =>
			Array.from(
				new Set(changeImpactRecords.map((record) => record.date)),
			).sort((a, b) => b.localeCompare(a)),
		[],
	);

	const filteredRecords = useMemo(
		() =>
			changeImpactRecords.filter((record) => {
				const typeMatched =
					typeFilter === allValue || record.type === typeFilter;
				const moduleMatched =
					moduleFilter === allValue || record.modules.includes(moduleFilter);
				const authorMatched =
					authorFilter === allValue || record.author === authorFilter;
				const dateMatched =
					dateFilter === allValue || record.date === dateFilter;

				return typeMatched && moduleMatched && authorMatched && dateMatched;
			}),
		[typeFilter, moduleFilter, authorFilter, dateFilter],
	);
	const selectedRecord =
		filteredRecords.find((record) => record.id === selectedId) ??
		filteredRecords[0];
	const graphNodes = useMemo(
		() => (selectedRecord ? buildGraphNodes(selectedRecord) : []),
		[selectedRecord],
	);
	const activeNode =
		graphNodes.find((node) => node.id === activeNodeId) ?? graphNodes[0];
	const reviewedCount = changeImpactRecords.filter(
		(record) => record.reviewState === "reviewed",
	).length;
	const hasFilteredRecords = filteredRecords.length > 0 && selectedRecord;

	return (
		<main className="changes-page">
			<section className="changes-hero">
				<div className="changes-hero-grid page-wrap px-4 py-16 sm:py-20">
					<div className="changes-hero-copy">
						<p className="island-kicker mb-3">Change Impact Graph</p>
						<h1 className="display-title mb-5 text-5xl font-bold leading-tight text-[#d9fff7] sm:text-6xl">
							功能变更，不只是一条日志。
						</h1>
						<p className="m-0 max-w-2xl text-base leading-8 text-[rgba(216,255,247,0.74)] sm:text-lg">
							把 change fragment 里的原因、影响模块、文件、验证证据和 Review
							门禁拉成一张可交互关系图。团队复盘时可以直接看到一次改动牵动了哪里。
						</p>
					</div>

					<aside className="changes-hero-console" aria-label="变更图统计">
						<div className="changes-console-bar">
							<span />
							<span />
							<span />
							<strong>IMPACT MAP</strong>
						</div>
						<div className="changes-metric-grid">
							<div>
								<span>记录</span>
								<strong>{changeImpactRecords.length}</strong>
							</div>
							<div>
								<span>已审</span>
								<strong>{reviewedCount}</strong>
							</div>
							<div>
								<span>模块</span>
								<strong>{allModules.length}</strong>
							</div>
						</div>
						<code>{"source: docs/vibe-coding/changes/**/*.md"}</code>
					</aside>
				</div>
			</section>

			<section className="page-wrap px-4 py-12">
				<div className="changes-toolbar">
					<div>
						<p className="island-kicker mb-2">Filter</p>
						<h2 className="m-0 text-2xl font-extrabold text-[var(--sea-ink)]">
							按日期、类型、作者和模块定位一次变更
						</h2>
					</div>

					<fieldset className="changes-filter-grid">
						<legend className="sr-only">变更筛选</legend>
						<label>
							<span>日期</span>
							<select
								value={dateFilter}
								onChange={(event) => setDateFilter(event.target.value)}
							>
								<option value={allValue}>全部日期</option>
								{allDates.map((date) => (
									<option key={date} value={date}>
										{date}
									</option>
								))}
							</select>
						</label>
						<label>
							<span>类型</span>
							<select
								value={typeFilter}
								onChange={(event) => setTypeFilter(event.target.value)}
							>
								<option value={allValue}>全部类型</option>
								{Object.entries(changeTypeLabels).map(([type, label]) => (
									<option key={type} value={type}>
										{label}
									</option>
								))}
							</select>
						</label>
						<label>
							<span>作者</span>
							<select
								value={authorFilter}
								onChange={(event) => setAuthorFilter(event.target.value)}
							>
								<option value={allValue}>全部作者</option>
								{allAuthors.map((author) => (
									<option key={author} value={author}>
										{author}
									</option>
								))}
							</select>
						</label>
						<label>
							<span>模块</span>
							<select
								value={moduleFilter}
								onChange={(event) => setModuleFilter(event.target.value)}
							>
								<option value={allValue}>全部模块</option>
								{allModules.map((moduleName) => (
									<option key={moduleName} value={moduleName}>
										{moduleName}
									</option>
								))}
							</select>
						</label>
					</fieldset>
				</div>

				<div className="changes-workspace">
					<aside className="changes-timeline-panel" aria-label="变更时间线">
						<div className="changes-panel-title">
							<CalendarDays size={20} aria-hidden="true" />
							<strong>变更时间线</strong>
						</div>

						{hasFilteredRecords ? (
							<div className="changes-timeline-list">
								{filteredRecords.map((record) => (
									<button
										key={record.id}
										type="button"
										className={
											record.id === selectedRecord.id
												? "changes-timeline-item is-active"
												: "changes-timeline-item"
										}
										aria-pressed={record.id === selectedRecord.id}
										onClick={() => setSelectedId(record.id)}
									>
										<span className="changes-time">
											{record.date} {record.time}
										</span>
										<strong>{record.title}</strong>
										<span className="changes-type-line">
											{changeTypeLabels[record.type]} /{" "}
											{reviewStateLabels[record.reviewState]}
										</span>
									</button>
								))}
							</div>
						) : (
							<div className="changes-empty-state">
								<Filter size={22} aria-hidden="true" />
								<span>没有匹配的变更记录</span>
							</div>
						)}
					</aside>

					<section
						className="changes-graph-panel"
						aria-labelledby="changes-graph-title"
					>
						<div className="changes-panel-title">
							<Network size={20} aria-hidden="true" />
							<strong id="changes-graph-title">影响关系图</strong>
						</div>

						{hasFilteredRecords ? (
							<div className="changes-graph-canvas">
								<svg
									className="changes-graph-lines"
									viewBox="0 0 100 100"
									aria-hidden="true"
								>
									{graphNodes.map((node) => (
										<line
											key={node.id}
											x1="50"
											y1="50"
											x2={node.x}
											y2={node.y}
										/>
									))}
								</svg>

								<div className="changes-graph-center">
									<Sparkles size={22} aria-hidden="true" />
									<strong>{selectedRecord.title}</strong>
									<span>
										{selectedRecord.author} /{" "}
										{changeTypeLabels[selectedRecord.type]}
									</span>
								</div>

								{graphNodes.map((node) => (
									<button
										key={node.id}
										type="button"
										className={`changes-graph-node changes-node-${node.kind}${
											node.id === activeNode?.id ? " is-active" : ""
										}`}
										style={{ left: `${node.x}%`, top: `${node.y}%` }}
										aria-pressed={node.id === activeNode?.id}
										onClick={() => {
											setActiveNodeId(node.id);
											if (node.kind === "module") {
												setModuleFilter(node.label);
											}
										}}
									>
										<span>{node.detail}</span>
										<strong>{node.label}</strong>
									</button>
								))}

								<div className="changes-graph-focus">
									<Activity size={18} aria-hidden="true" />
									<span>
										{activeNode
											? `${activeNode.detail}：${activeNode.label}`
											: "选择节点查看影响关系"}
									</span>
								</div>
							</div>
						) : (
							<div className="changes-empty-state">
								<Filter size={22} aria-hidden="true" />
								<span>调整筛选条件后查看影响关系图</span>
							</div>
						)}
					</section>

					<aside className="changes-detail-panel" aria-label="变更详情">
						<div className="changes-panel-title">
							<FileText size={20} aria-hidden="true" />
							<strong>详情面板</strong>
						</div>

						{hasFilteredRecords ? (
							<>
								<div className="changes-detail-header">
									<span
										className={`changes-type-pill type-${selectedRecord.type}`}
									>
										{changeTypeLabels[selectedRecord.type]}
									</span>
									<h2>{selectedRecord.title}</h2>
									<p>{selectedRecord.summary}</p>
								</div>

								<div className="changes-meta-grid">
									<div>
										<UserRound size={16} aria-hidden="true" />
										<span>{selectedRecord.author}</span>
									</div>
									<div>
										<CalendarDays size={16} aria-hidden="true" />
										<span>
											{selectedRecord.date} {selectedRecord.time}
										</span>
									</div>
									<div>
										<GitPullRequest size={16} aria-hidden="true" />
										<span>{selectedRecord.fragmentPath}</span>
									</div>
									<div>
										{selectedRecord.reviewState === "reviewed" ? (
											<ShieldCheck size={16} aria-hidden="true" />
										) : (
											<ShieldAlert size={16} aria-hidden="true" />
										)}
										<span>{selectedRecord.review}</span>
									</div>
								</div>

								<DetailList title="改了什么" items={selectedRecord.changes} />
								<DetailList
									title="验证方式"
									items={selectedRecord.verification}
									icon={<CheckCircle2 size={18} aria-hidden="true" />}
								/>
								<DetailList
									title="模块文档同步"
									items={selectedRecord.docSync}
									icon={<Layers3 size={18} aria-hidden="true" />}
								/>
								<DetailList
									title="风险和后续事项"
									items={selectedRecord.risks}
									icon={<ShieldAlert size={18} aria-hidden="true" />}
								/>

								<div className="changes-token-line">
									<span>Token 消耗</span>
									<strong>{selectedRecord.tokenCost}</strong>
								</div>
							</>
						) : (
							<div className="changes-empty-state">
								<Filter size={22} aria-hidden="true" />
								<span>没有可展示的变更详情</span>
							</div>
						)}
					</aside>
				</div>
			</section>
		</main>
	);
}

function DetailList({
	title,
	items,
	icon,
}: {
	title: string;
	items: string[];
	icon?: ReactNode;
}) {
	return (
		<section className="changes-detail-block">
			<h3>
				{icon}
				{title}
			</h3>
			<ul>
				{items.map((item) => (
					<li key={item}>{item}</li>
				))}
			</ul>
		</section>
	);
}
