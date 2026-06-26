import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowRight,
	BookOpenText,
	BrainCircuit,
	CheckCircle2,
	Code2,
	FileClock,
	FileText,
	GitPullRequest,
	Layers3,
	Radar,
	ScanLine,
	ShieldCheck,
	Sparkles,
	Workflow,
} from "lucide-react";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/docs")({
	component: DocsPage,
});

const quickEntries = [
	{
		title: "团队入口",
		desc: "从 AGENTS.md 开始，确认模式选择、作者规则、文档同步和完成定义。",
		path: "AGENTS.md",
		icon: BookOpenText,
	},
	{
		title: "工作流程",
		desc: "按需求澄清、计划、实现、验证、记录的顺序组织一次任务。",
		path: "docs/vibe-coding/01-workflow.md",
		icon: Layers3,
	},
	{
		title: "Review 入口",
		desc: "把 AI Review 当作质量门禁，不替代高风险人工 Review。",
		path: "code_review.md",
		icon: ShieldCheck,
	},
	{
		title: "提交与 PR",
		desc: "档位 2 自动化覆盖 diff 检查、change fragment、验证和 PR 文案。",
		path: "docs/vibe-coding/07-commit-pr.md",
		icon: GitPullRequest,
	},
	{
		title: "变更影响图",
		desc: "把功能变更、影响模块、验证证据和 Review 状态放到一张可交互地图。",
		path: "/changes",
		icon: Radar,
	},
];

const protocolSteps = [
	["01", "判断模式", "小改直接执行，复杂任务优先 /plan 或 Human Loop。"],
	["02", "写清上下文", "目标、上下文、约束、完成标准要能被团队复核。"],
	["03", "小步实现", "复用现有模式，控制 diff 范围，避免一次性重写。"],
	["04", "验证交付", "没有验证证据，不能声称完成。"],
];

const localDocs = [
	["总章程", "docs/vibe-coding/00-charter.md"],
	["提示词四要素", "docs/vibe-coding/03-prompt-patterns.md"],
	["测试门禁", "docs/vibe-coding/05-testing.md"],
	["安全边界", "docs/vibe-coding/06-security.md"],
	["Codex 运行协作", "docs/vibe-coding/09-codex-operations.md"],
	["模块文档索引", "docs/vibe-coding/modules/README.md"],
	["变更影响图", "/changes"],
];

const aiSignals = [
	{
		title: "Intent Router",
		value: "92%",
		desc: "需求语义识别",
		icon: BrainCircuit,
	},
	{
		title: "Agent Mesh",
		value: "6 lanes",
		desc: "计划、实现、评审、验证",
		icon: Workflow,
	},
	{
		title: "Context Lock",
		value: "live",
		desc: "固定 diff 与本地文档",
		icon: ScanLine,
	},
	{
		title: "Review Gate",
		value: "armed",
		desc: "AI 预审 + 人工确认",
		icon: ShieldCheck,
	},
];

const consoleLines = [
	"model.router.detect(task.intent)",
	"context.graph.bind(AGENTS.md)",
	"skill.load(vibe-intake -> vibe-plan)",
	"review.agent.watch(diff.snapshot)",
	"verify.require(evidence.before_done)",
];

type ParticleNode = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	size: number;
	phase: number;
};

function DocsParticleBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const wrapRef = useRef<HTMLDivElement>(null);
	const pointerRef = useRef({ active: false, x: 0, y: 0 });

	useEffect(() => {
		const canvas = canvasRef.current;
		const wrap = wrapRef.current;

		if (!canvas || !wrap) {
			return;
		}

		const ctx = canvas.getContext("2d");

		if (!ctx) {
			return;
		}

		const reduceMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		const motionScale = 0.42;
		const nodes: ParticleNode[] = Array.from({ length: 68 }, (_, index) => ({
			x: ((index * 61) % 100) / 100,
			y: ((index * 43) % 100) / 100,
			vx: (((index * 17) % 9) - 4) * 0.012 * motionScale,
			vy: (((index * 29) % 9) - 4) * 0.012 * motionScale,
			size: 1.8 + (index % 4) * 0.55,
			phase: index * 0.51,
		}));

		let frameId = 0;
		let width = 0;
		let height = 0;

		const resize = () => {
			const rect = wrap.getBoundingClientRect();
			const ratio = Math.min(window.devicePixelRatio || 1, 2);
			width = Math.max(rect.width, 1);
			height = Math.max(rect.height, 1);
			canvas.width = Math.floor(width * ratio);
			canvas.height = Math.floor(height * ratio);
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;
			ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
		};

		const drawCircuitLines = (time: number) => {
			ctx.lineWidth = 1;

			for (let y = 24; y < height; y += 58) {
				const alpha = 0.045 + Math.sin(time * 0.001 + y * 0.02) * 0.018;
				ctx.strokeStyle = `rgba(96, 215, 207, ${alpha})`;
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(width * 0.34, y);
				ctx.lineTo(width * 0.34 + 28, y + 22);
				ctx.lineTo(width, y + 22);
				ctx.stroke();
			}

			for (let x = 36; x < width; x += 76) {
				const alpha = 0.035 + Math.cos(time * 0.0009 + x * 0.018) * 0.014;
				ctx.strokeStyle = `rgba(255, 210, 122, ${alpha})`;
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, height);
				ctx.stroke();
			}
		};

		const drawNeuralSpine = (time: number, focusX: number, focusY: number) => {
			const centerX = width * 0.5;
			const centerY = height * 0.48;
			const maxRadius = Math.max(width, height) * 0.28;
			const pulse = reduceMotion ? 0.6 : (Math.sin(time * 0.0018) + 1) / 2;

			for (let ring = 0; ring < 4; ring += 1) {
				const radius = maxRadius * (0.34 + ring * 0.18) + pulse * 18;
				ctx.strokeStyle = `rgba(154, 161, 255, ${0.07 + ring * 0.018})`;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.ellipse(
					centerX,
					centerY,
					radius * 1.24,
					radius * 0.62,
					Math.sin(time * 0.00025) * 0.12,
					0,
					Math.PI * 2,
				);
				ctx.stroke();
			}

			const activation = ctx.createLinearGradient(
				centerX - maxRadius,
				centerY,
				focusX,
				focusY,
			);
			activation.addColorStop(0, "rgba(255, 138, 104, 0)");
			activation.addColorStop(0.5, "rgba(255, 210, 122, 0.28)");
			activation.addColorStop(1, "rgba(96, 215, 207, 0.06)");
			ctx.strokeStyle = activation;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(centerX - maxRadius * 0.86, centerY + 22);
			ctx.bezierCurveTo(
				centerX - maxRadius * 0.2,
				centerY - 86,
				focusX - 42,
				focusY + 42,
				focusX,
				focusY,
			);
			ctx.stroke();
		};

		const drawDataPackets = (time: number) => {
			for (let index = 0; index < 9; index += 1) {
				const progress = reduceMotion
					? index / 9
					: (time * 0.00012 + index * 0.137) % 1;
				const x = width * (0.12 + progress * 0.76);
				const y =
					height * (0.2 + ((index * 19) % 45) / 100) +
					Math.sin(progress * Math.PI * 2 + index) * 24;
				const packetWidth = 34 + (index % 3) * 10;

				ctx.strokeStyle =
					index % 2 === 0
						? "rgba(96, 215, 207, 0.42)"
						: "rgba(255, 210, 122, 0.34)";
				ctx.fillStyle =
					index % 2 === 0
						? "rgba(96, 215, 207, 0.07)"
						: "rgba(255, 210, 122, 0.06)";
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.roundRect(x, y, packetWidth, 13, 4);
				ctx.fill();
				ctx.stroke();
			}
		};

		const draw = (time = 0) => {
			const motionTime = time * motionScale;

			ctx.clearRect(0, 0, width, height);

			const base = ctx.createLinearGradient(0, 0, width, height);
			base.addColorStop(0, "#061016");
			base.addColorStop(0.45, "#0a1b22");
			base.addColorStop(1, "#130f24");
			ctx.fillStyle = base;
			ctx.fillRect(0, 0, width, height);

			drawCircuitLines(motionTime);

			const pointer = pointerRef.current;
			const focusX = pointer.active
				? pointer.x
				: width * (0.68 + Math.sin(motionTime * 0.00019) * 0.18);
			const focusY = pointer.active
				? pointer.y
				: height * (0.4 + Math.cos(motionTime * 0.00023) * 0.2);
			const glow = ctx.createRadialGradient(
				focusX,
				focusY,
				4,
				focusX,
				focusY,
				Math.max(width, height) * 0.46,
			);
			glow.addColorStop(0, "rgba(96, 215, 207, 0.22)");
			glow.addColorStop(0.36, "rgba(255, 210, 122, 0.09)");
			glow.addColorStop(1, "rgba(98, 105, 216, 0)");
			ctx.fillStyle = glow;
			ctx.fillRect(0, 0, width, height);
			drawNeuralSpine(motionTime, focusX, focusY);
			drawDataPackets(motionTime);

			const resolvedNodes = nodes.map((node) => {
				if (!reduceMotion) {
					node.x += node.vx;
					node.y += node.vy;

					if (node.x < -0.03) node.x = 1.03;
					if (node.x > 1.03) node.x = -0.03;
					if (node.y < -0.03) node.y = 1.03;
					if (node.y > 1.03) node.y = -0.03;
				}

				const drift = reduceMotion
					? 0
					: Math.sin(motionTime * 0.00042 + node.phase) * 9;

				return {
					x: node.x * width + drift,
					y: node.y * height + Math.cos(motionTime * 0.00036 + node.phase) * 7,
					size: node.size,
				};
			});

			for (let i = 0; i < resolvedNodes.length; i += 1) {
				const a = resolvedNodes[i];

				for (let j = i + 1; j < resolvedNodes.length; j += 1) {
					const b = resolvedNodes[j];
					const distance = Math.hypot(a.x - b.x, a.y - b.y);

					if (distance < 126) {
						const midDistance = Math.hypot(
							(a.x + b.x) / 2 - focusX,
							(a.y + b.y) / 2 - focusY,
						);
						const focusBoost = Math.max(0, 1 - midDistance / 260);
						const alpha = Math.min(0.5, 0.05 + focusBoost * 0.31);
						ctx.strokeStyle = `rgba(134, 245, 231, ${alpha})`;
						ctx.lineWidth = 1;
						ctx.setLineDash(focusBoost > 0.62 ? [6, 7] : []);
						ctx.beginPath();
						ctx.moveTo(a.x, a.y);
						ctx.lineTo(b.x, b.y);
						ctx.stroke();
						ctx.setLineDash([]);
					}
				}
			}

			for (const node of resolvedNodes) {
				const distance = Math.hypot(node.x - focusX, node.y - focusY);
				const active = Math.max(0, 1 - distance / 210);
				const radius = node.size + active * 2.6;

				ctx.beginPath();
				ctx.fillStyle =
					active > 0.4
						? "rgba(255, 210, 122, 0.96)"
						: "rgba(216, 255, 247, 0.76)";
				ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
				ctx.fill();

				if (active > 0.52) {
					ctx.strokeStyle = "rgba(255, 138, 104, 0.62)";
					ctx.lineWidth = 1.2;
					ctx.beginPath();
					ctx.arc(node.x, node.y, radius + 7, 0, Math.PI * 2);
					ctx.stroke();
				}
			}

			const scanY = reduceMotion
				? height * 0.58
				: ((motionTime * 0.031) % (height + 180)) - 90;
			const scan = ctx.createLinearGradient(0, scanY - 32, 0, scanY + 32);
			scan.addColorStop(0, "rgba(255, 255, 255, 0)");
			scan.addColorStop(0.5, "rgba(154, 161, 255, 0.13)");
			scan.addColorStop(1, "rgba(255, 255, 255, 0)");
			ctx.fillStyle = scan;
			ctx.fillRect(0, scanY - 32, width, 64);

			if (!reduceMotion) {
				frameId = window.requestAnimationFrame(draw);
			}
		};

		resize();
		draw();

		const observer = new ResizeObserver(resize);
		observer.observe(wrap);

		const updatePointer = (event: globalThis.PointerEvent) => {
			const rect = wrap.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;

			pointerRef.current = {
				active: x >= 0 && x <= rect.width && y >= 0 && y <= rect.height,
				x,
				y,
			};
		};

		const resetPointer = () => {
			pointerRef.current.active = false;
		};

		window.addEventListener("pointermove", updatePointer);
		window.addEventListener("pointerleave", resetPointer);

		return () => {
			observer.disconnect();
			window.removeEventListener("pointermove", updatePointer);
			window.removeEventListener("pointerleave", resetPointer);
			window.cancelAnimationFrame(frameId);
		};
	}, []);

	return (
		<div ref={wrapRef} className="docs-particle-background">
			<canvas ref={canvasRef} className="docs-particle-canvas" />
		</div>
	);
}

function DocsPage() {
	return (
		<main className="docs-page">
			<section className="docs-hero-scene">
				<DocsParticleBackground />

				<div className="docs-hero-hud docs-hero-hud-left">
					<span>AI_CONTEXT</span>
					<strong>AGENTS.md</strong>
				</div>
				<div className="docs-hero-hud docs-hero-hud-right">
					<span>VERIFY_GATE</span>
					<strong>evidence required</strong>
				</div>

				<div className="page-wrap relative z-10 grid min-h-[calc(100svh-4.5rem)] gap-8 px-4 py-12 text-white lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-16">
					<div className="rise-in max-w-4xl">
						<p className="mb-5 inline-flex items-center gap-2 border border-cyan-200/22 bg-cyan-100/9 px-4 py-2 text-sm font-bold text-cyan-100 shadow-[0_0_40px_rgba(96,215,207,0.16)] backdrop-blur-md">
							<Sparkles size={18} aria-hidden="true" />
							AI Knowledge Engine
						</p>
						<h1 className="display-title mb-6 text-5xl font-bold leading-[1.02] text-white sm:text-7xl">
							Vibe Coding AI 文档中枢
						</h1>
						<p className="mb-8 max-w-3xl text-lg leading-8 text-cyan-50/78 sm:text-xl">
							这里把团队规则、Codex 协作流程、Review、PR
							和变更记录入口收在项目内，像一套可审计的 AI
							协作控制台，把提示词、上下文、验证证据和提交门禁连接起来。
						</p>
						<div className="flex flex-wrap gap-3">
							<a href="#map" className="docs-hero-primary">
								打开文档地图
								<ArrowRight size={18} aria-hidden="true" />
							</a>
							<a href="#protocol" className="docs-hero-secondary">
								查看协作协议
							</a>
						</div>
					</div>

					<div className="docs-orbit-panel rise-in">
						<div className="docs-ai-console">
							<div className="docs-console-topbar">
								<span />
								<span />
								<span />
								<strong>AI AGENT TRACE</strong>
							</div>
							<div className="docs-console-lines">
								{consoleLines.map((line) => (
									<code key={line}>{line}</code>
								))}
							</div>
						</div>
						<div className="docs-orbit-core">
							<BrainCircuit size={38} aria-hidden="true" />
							<strong>AI Core</strong>
						</div>
						<div className="docs-orbit-node docs-orbit-node-a">
							<Radar size={18} aria-hidden="true" />
							<span>Plan</span>
						</div>
						<div className="docs-orbit-node docs-orbit-node-b">
							<Code2 size={18} aria-hidden="true" />
							<span>Build</span>
						</div>
						<div className="docs-orbit-node docs-orbit-node-c">
							<CheckCircle2 size={18} aria-hidden="true" />
							<span>Verify</span>
						</div>
						<div className="docs-orbit-node docs-orbit-node-d">
							<FileClock size={18} aria-hidden="true" />
							<span>Record</span>
						</div>
					</div>
				</div>
			</section>

			<section className="docs-ai-band">
				<div className="page-wrap px-4 py-8">
					<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
						{aiSignals.map(({ title, value, desc, icon: Icon }) => (
							<article key={title} className="docs-ai-signal-card">
								<div className="docs-ai-signal-head">
									<Icon size={20} aria-hidden="true" />
									<span>{title}</span>
								</div>
								<strong>{value}</strong>
								<p>{desc}</p>
								<div className="docs-ai-meter">
									<span />
								</div>
							</article>
						))}
					</div>
				</div>
			</section>

			<section id="map" className="page-wrap px-4 py-14 sm:py-16">
				<div className="mb-8 max-w-3xl">
					<p className="island-kicker mb-3">Doc Map</p>
					<h2 className="display-title mb-4 text-4xl font-bold leading-tight text-[var(--sea-ink)] sm:text-5xl">
						常用入口放在项目内。
					</h2>
					<p className="m-0 text-base leading-8 text-[var(--sea-ink-soft)]">
						这些路径就是当前项目里的本地文档位置。修改规则时，优先改对应文档，再同步模块文档或
						change fragment。
					</p>
				</div>

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					{quickEntries.map(({ title, desc, path, icon: Icon }) => (
						<article key={title} className="docs-entry-card">
							<div className="docs-entry-icon">
								<Icon size={22} aria-hidden="true" />
							</div>
							<h3 className="mb-3 text-xl font-bold text-[var(--sea-ink)]">
								{title}
							</h3>
							<p className="mb-4 text-sm leading-7 text-[var(--sea-ink-soft)]">
								{desc}
							</p>
							<code>{path}</code>
						</article>
					))}
				</div>
			</section>

			<section id="protocol" className="docs-protocol-band">
				<div className="page-wrap grid gap-8 px-4 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
					<div>
						<p className="island-kicker mb-3">Protocol</p>
						<h2 className="display-title mb-4 text-4xl font-bold leading-tight text-[var(--sea-ink)] sm:text-5xl">
							一套规则，覆盖从需求到合并。
						</h2>
						<p className="m-0 text-base leading-8 text-[var(--sea-ink-soft)]">
							页面保留本地入口，具体执行仍以仓库文档为准。复杂任务优先进入计划，普通任务保持快速实现和验证。
						</p>
					</div>

					<div className="docs-protocol-grid">
						{protocolSteps.map(([index, title, desc]) => (
							<div key={title} className="docs-protocol-step">
								<span>{index}</span>
								<div>
									<strong>{title}</strong>
									<p>{desc}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="page-wrap grid gap-5 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr]">
				<div className="docs-local-list">
					<div className="mb-5 flex items-center gap-3">
						<FileText
							className="text-[var(--lagoon)]"
							size={26}
							aria-hidden="true"
						/>
						<h2 className="m-0 text-2xl font-extrabold text-[var(--sea-ink)]">
							本地文档清单
						</h2>
					</div>
					<div className="grid gap-3">
						{localDocs.map(([name, path]) => (
							<div key={path} className="docs-local-row">
								<span>{name}</span>
								<code>{path}</code>
							</div>
						))}
					</div>
				</div>

				<div className="docs-command-panel">
					<div className="mb-4 flex items-center gap-2">
						<span />
						<span />
						<span />
						<strong>AI execution contract</strong>
					</div>
					<pre>
						<code>{`task:
  goal: 用本地规则完成一次可验证变更
  context: docs/vibe-coding/*
  constraints:
    - 不使用 git add .
    - 有意义变更新增 change fragment
  done_when:
    - 代码已验证
    - PR 描述包含风险和证据
    - AI 协助范围已记录`}</code>
					</pre>
				</div>
			</section>
		</main>
	);
}
