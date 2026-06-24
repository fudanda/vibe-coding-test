import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowRight,
	Cpu,
	FileCheck2,
	Radar,
	ShieldCheck,
	Sparkles,
} from "lucide-react";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/about")({
	component: About,
});

const signals = [
	["Mode Router", "先判断普通执行还是计划优先"],
	["Skills", "按 intake、plan、implement、review、verify 分阶段工作"],
	["Hooks", "SessionStart 自动注入团队协作入口"],
];

const principles = [
	{
		title: "先判断，再行动",
		desc: "低风险任务直接推进；跨模块、高风险和需求不清的任务先计划。",
		icon: Radar,
	},
	{
		title: "每一步有证据",
		desc: "没有构建、检查、截图、日志或人工验证证据，就不能声称完成。",
		icon: FileCheck2,
	},
	{
		title: "责任留给团队",
		desc: "AI 写入协助字段，作者和决策人始终是负责这次变更的人。",
		icon: ShieldCheck,
	},
];

const timeline = [
	"需求澄清",
	"影响范围",
	"实现计划",
	"小步编码",
	"验证门禁",
	"记录沉淀",
];

type SignalNode = {
	x: number;
	y: number;
	phase: number;
	speed: number;
};

function TechSignalBackground() {
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
		const nodes: SignalNode[] = Array.from({ length: 46 }, (_, index) => ({
			x: ((index * 37) % 100) / 100,
			y: ((index * 53) % 100) / 100,
			phase: index * 0.67,
			speed: 0.6 + (index % 5) * 0.12,
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

		const drawGrid = (time: number) => {
			ctx.lineWidth = 1;

			for (let x = 0; x < width; x += 44) {
				const alpha = 0.05 + Math.sin(time * 0.001 + x * 0.02) * 0.015;
				ctx.strokeStyle = `rgba(126, 211, 191, ${alpha})`;
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, height);
				ctx.stroke();
			}

			for (let y = 0; y < height; y += 44) {
				const alpha = 0.045 + Math.cos(time * 0.001 + y * 0.018) * 0.015;
				ctx.strokeStyle = `rgba(255, 210, 122, ${alpha})`;
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(width, y);
				ctx.stroke();
			}
		};

		const draw = (time = 0) => {
			ctx.clearRect(0, 0, width, height);
			ctx.fillStyle = "#050d11";
			ctx.fillRect(0, 0, width, height);

			drawGrid(time);

			const pointer = pointerRef.current;
			const focusX = pointer.active
				? pointer.x
				: width * (0.62 + Math.sin(time * 0.00022) * 0.16);
			const focusY = pointer.active
				? pointer.y
				: height * (0.44 + Math.cos(time * 0.0002) * 0.18);
			const resolvedNodes = nodes.map((node) => {
				const drift = reduceMotion
					? 0
					: Math.sin(time * 0.00045 * node.speed + node.phase) * 8;
				return {
					x: node.x * width + drift,
					y:
						node.y * height +
						Math.cos(time * 0.00038 * node.speed + node.phase) * 6,
				};
			});

			ctx.lineWidth = 1;
			for (let i = 0; i < resolvedNodes.length; i += 1) {
				const a = resolvedNodes[i];
				for (let j = i + 1; j < resolvedNodes.length; j += 1) {
					const b = resolvedNodes[j];
					const distance = Math.hypot(a.x - b.x, a.y - b.y);

					if (distance < 135) {
						const focusDistance = Math.hypot(
							(a.x + b.x) / 2 - focusX,
							(a.y + b.y) / 2 - focusY,
						);
						const focusBoost = Math.max(0, 1 - focusDistance / 260);
						const alpha = Math.min(0.42, 0.06 + focusBoost * 0.24);
						ctx.strokeStyle = `rgba(96, 215, 207, ${alpha})`;
						ctx.beginPath();
						ctx.moveTo(a.x, a.y);
						ctx.lineTo(b.x, b.y);
						ctx.stroke();
					}
				}
			}

			const scanX = reduceMotion
				? width * 0.68
				: ((time * 0.035) % (width + 240)) - 120;
			const scanGradient = ctx.createLinearGradient(
				scanX - 72,
				0,
				scanX + 72,
				0,
			);
			scanGradient.addColorStop(0, "rgba(255, 210, 122, 0)");
			scanGradient.addColorStop(0.5, "rgba(255, 210, 122, 0.18)");
			scanGradient.addColorStop(1, "rgba(255, 210, 122, 0)");
			ctx.fillStyle = scanGradient;
			ctx.fillRect(scanX - 72, 0, 144, height);

			for (const node of resolvedNodes) {
				const distance = Math.hypot(node.x - focusX, node.y - focusY);
				const active = Math.max(0, 1 - distance / 210);
				const size = active > 0.35 ? 5 : 3;
				ctx.fillStyle = active > 0.35 ? "#ffd27a" : "rgba(216, 255, 247, 0.74)";
				ctx.fillRect(node.x - size / 2, node.y - size / 2, size, size);
			}

			ctx.strokeStyle = "rgba(255, 138, 104, 0.48)";
			ctx.lineWidth = 1.5;
			ctx.beginPath();
			ctx.moveTo(focusX - 28, focusY);
			ctx.lineTo(focusX - 8, focusY);
			ctx.moveTo(focusX + 8, focusY);
			ctx.lineTo(focusX + 28, focusY);
			ctx.moveTo(focusX, focusY - 28);
			ctx.lineTo(focusX, focusY - 8);
			ctx.moveTo(focusX, focusY + 8);
			ctx.lineTo(focusX, focusY + 28);
			ctx.stroke();

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
		<div ref={wrapRef} className="about-tech-background">
			<canvas ref={canvasRef} className="about-tech-canvas" />
		</div>
	);
}

function About() {
	return (
		<main className="about-tech-page">
			<section className="about-tech-scene">
				<TechSignalBackground />

				<div className="page-wrap relative z-10 grid min-h-[calc(100svh-4.5rem)] gap-10 px-4 py-14 text-white lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
					<div className="rise-in max-w-4xl">
						<p className="mb-5 inline-flex items-center gap-2 border border-cyan-200/22 bg-cyan-100/9 px-4 py-2 text-sm font-bold text-cyan-100 shadow-[0_0_40px_rgba(96,215,207,0.16)] backdrop-blur-md">
							<Sparkles size={18} aria-hidden="true" />
							About Vibe Coding
						</p>
						<h1 className="display-title mb-6 text-5xl font-bold leading-[1.02] text-white sm:text-7xl">
							让 AI 协作从灵感流，升级为工程系统。
						</h1>
						<p className="mb-8 max-w-3xl text-lg leading-8 text-cyan-50/78 sm:text-xl">
							Vibe Coding 是给团队和 Codex
							共用的开发协议：它会先判断任务模式，再把需求、计划、实现、验证和记录串成一条可复核的工作链路。
						</p>
						<div className="flex flex-wrap gap-3">
							<a href="#signal" className="about-tech-primary">
								查看协作信号
								<ArrowRight size={18} aria-hidden="true" />
							</a>
							<a href="#principles" className="about-tech-secondary">
								查看核心原则
							</a>
						</div>
					</div>

					<div id="signal" className="about-signal-panel rise-in">
						<div className="mb-5 flex items-center justify-between gap-3">
							<div>
								<p className="m-0 text-xs font-bold uppercase text-cyan-100/54">
									Live Protocol
								</p>
								<h2 className="m-0 mt-1 text-2xl font-extrabold text-white">
									Codex 协作链路
								</h2>
							</div>
							<Cpu
								className="text-[var(--amber)]"
								size={30}
								aria-hidden="true"
							/>
						</div>

						<div className="grid gap-3">
							{signals.map(([title, desc], index) => (
								<div key={title} className="about-signal-row">
									<span>0{index + 1}</span>
									<div>
										<strong>{title}</strong>
										<p>{desc}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			<section id="principles" className="page-wrap px-4 py-14 sm:py-16">
				<div className="mb-8 max-w-3xl">
					<p className="island-kicker mb-3">Operating Principles</p>
					<h2 className="display-title mb-4 text-4xl font-bold leading-tight text-[var(--sea-ink)] sm:text-5xl">
						炫酷只是表面，真正重要的是可控。
					</h2>
					<p className="m-0 text-base leading-8 text-[var(--sea-ink-soft)]">
						这套规范的目标不是让 AI
						生成更多代码，而是让每一次生成都能被团队理解、验证、追踪和接手。
					</p>
				</div>

				<div className="grid gap-4 md:grid-cols-3">
					{principles.map(({ title, desc, icon: Icon }) => (
						<article key={title} className="about-principle-card">
							<div className="about-principle-icon">
								<Icon size={22} aria-hidden="true" />
							</div>
							<h3 className="mb-3 text-xl font-bold text-[var(--sea-ink)]">
								{title}
							</h3>
							<p className="m-0 text-sm leading-7 text-[var(--sea-ink-soft)]">
								{desc}
							</p>
						</article>
					))}
				</div>
			</section>

			<section className="about-timeline-band">
				<div className="page-wrap px-4 py-12">
					<div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<p className="island-kicker mb-3">Workflow Map</p>
							<h2 className="display-title m-0 text-4xl font-bold text-[var(--sea-ink)]">
								从一句话到可交付。
							</h2>
						</div>
						<p className="m-0 max-w-xl text-sm leading-7 text-[var(--sea-ink-soft)]">
							每个阶段都能独立 Review，也能在后续 PR、ADR
							和模块文档里留下清晰上下文。
						</p>
					</div>

					<div className="about-timeline">
						{timeline.map((item, index) => (
							<div key={item} className="about-timeline-step">
								<span>{String(index + 1).padStart(2, "0")}</span>
								<strong>{item}</strong>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="page-wrap grid gap-5 px-4 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
				<div>
					<p className="island-kicker mb-3">Human In The Loop</p>
					<h2 className="display-title mb-4 text-4xl font-bold leading-tight text-[var(--sea-ink)] sm:text-5xl">
						Codex 可以提速，但团队保留判断权。
					</h2>
					<p className="m-0 text-base leading-8 text-[var(--sea-ink-soft)]">
						作者、决策人、风险接受者和最终验收者都应该是人或团队角色。AI
						的位置是协助者，而不是责任替代品。
					</p>
				</div>

				<div className="about-command-panel">
					<div className="mb-4 flex items-center gap-2">
						<span />
						<span />
						<span />
					</div>
					<pre>
						<code>{`mode: auto
if risk == low:
  codex.run("implement")
else:
  codex.run("plan-first")

author: human
ai_assist: Codex
claim_done: require(evidence)`}</code>
					</pre>
				</div>
			</section>
		</main>
	);
}
