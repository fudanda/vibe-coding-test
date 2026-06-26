import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowRight,
	Bot,
	Braces,
	CheckCircle2,
	FileCheck2,
	GitPullRequest,
	Layers3,
	ShieldCheck,
	Sparkles,
	Workflow,
	Zap,
} from "lucide-react";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/")({ component: App });

const workflowSteps = [
	{
		title: "Intake",
		desc: "先锁定目标、非目标、影响模块和验收标准，让 AI 不靠猜。",
		icon: Sparkles,
	},
	{
		title: "Plan",
		desc: "把实现范围、测试方案、风险和回滚方式写清楚，再进入编码。",
		icon: Workflow,
	},
	{
		title: "Implement",
		desc: "沿用项目现有模式，小步提交，小 diff，可验证地推进。",
		icon: Braces,
	},
	{
		title: "Verify",
		desc: "没有验证证据就不能声称完成，结果必须能被 Review 复核。",
		icon: CheckCircle2,
	},
];

const capabilities = [
	[
		"自动加载规范",
		"通过 Codex 插件、session-start hook 和 skills 进入团队工作方式。",
	],
	["模块文档同步", "模块文档只写当前事实，变更原因放进独立日志碎片。"],
	[
		"多人低冲突记录",
		"一个变更一份 change fragment，避免所有人抢同一个 CHANGELOG。",
	],
	["AI Review 门禁", "评审重点看真实行为、风险、测试证据和 AI 生成内容边界。"],
];

const guardrails = [
	"需求、非目标和验收标准先确认",
	"影响模块必须同步模块文档",
	"重要取舍新增 ADR 决策记录",
	"PR 必须提供验证证据",
	"AI 参与范围必须写清楚",
];

type SpaceParticle = {
	x: number;
	y: number;
	depth: number;
	phase: number;
	size: number;
	drift: number;
	kind: "star" | "trail" | "beacon";
};

const missionNodes = [
	{ label: "INTAKE", x: 0.22, y: 0.66, phase: 0.2 },
	{ label: "PLAN", x: 0.38, y: 0.38, phase: 1.1 },
	{ label: "REVIEW", x: 0.68, y: 0.33, phase: 2.4 },
	{ label: "VERIFY", x: 0.78, y: 0.62, phase: 3.2 },
];

function createSpaceParticles() {
	const particles: SpaceParticle[] = [];

	for (let index = 0; index < 128; index += 1) {
		const angle = index * 2.399963;
		const radius = Math.sqrt((index + 8) / 136);

		particles.push({
			x: 0.5 + Math.cos(angle) * radius * 0.56,
			y: 0.5 + Math.sin(angle * 1.13) * radius * 0.42,
			depth: 0.35 + (index % 7) * 0.12,
			phase: index * 0.47,
			size: 0.9 + (index % 5) * 0.34,
			drift: 0.5 + (index % 6) * 0.24,
			kind: "star",
		});
	}

	for (let index = 0; index < 42; index += 1) {
		const progress = index / 41;
		const sway = Math.sin(index * 0.9) * 0.035;

		particles.push({
			x: 0.14 + progress * 0.72,
			y: 0.78 - progress * 0.48 + sway,
			depth: 1.05,
			phase: index * 0.6,
			size: 1.2 + (index % 4) * 0.28,
			drift: 1.2,
			kind: "trail",
		});
	}

	for (const [index, node] of missionNodes.entries()) {
		particles.push({
			x: node.x,
			y: node.y,
			depth: 1.4,
			phase: node.phase + index,
			size: 3.2,
			drift: 0.2,
			kind: "beacon",
		});
	}

	return particles;
}

function SpaceMissionBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const wrapRef = useRef<HTMLDivElement>(null);
	const pointerRef = useRef({ active: false, x: 0, y: 0 });
	const pulseRef = useRef(0);

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

		const particles = createSpaceParticles();
		const reduceMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

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

		const drawOrbitLane = (
			centerX: number,
			centerY: number,
			radiusX: number,
			radiusY: number,
			rotation: number,
			alpha: number,
		) => {
			ctx.save();
			ctx.translate(centerX, centerY);
			ctx.rotate(rotation);
			ctx.strokeStyle = `rgba(134, 245, 231, ${alpha})`;
			ctx.lineWidth = 1;
			ctx.setLineDash([7, 18]);
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
			ctx.stroke();
			ctx.restore();
		};

		const drawShip = (
			shipX: number,
			shipY: number,
			angle: number,
			thrust: number,
		) => {
			ctx.save();
			ctx.translate(shipX, shipY);
			ctx.rotate(angle);

			const scale = Math.max(0.82, Math.min(width, height) / 760);

			ctx.shadowBlur = 22;
			ctx.shadowColor = "rgba(96, 215, 207, 0.55)";
			ctx.fillStyle = "rgba(225, 255, 251, 0.96)";
			ctx.beginPath();
			ctx.moveTo(26 * scale, 0);
			ctx.lineTo(-17 * scale, -12 * scale);
			ctx.lineTo(-9 * scale, 0);
			ctx.lineTo(-17 * scale, 12 * scale);
			ctx.closePath();
			ctx.fill();

			ctx.shadowBlur = 0;
			ctx.fillStyle = "rgba(10, 26, 38, 0.82)";
			ctx.beginPath();
			ctx.ellipse(3 * scale, 0, 7 * scale, 4 * scale, 0, 0, Math.PI * 2);
			ctx.fill();

			const flame = ctx.createLinearGradient(-18 * scale, 0, -44 * scale, 0);
			flame.addColorStop(0, `rgba(255, 210, 122, ${0.58 + thrust * 0.25})`);
			flame.addColorStop(0.45, `rgba(255, 107, 77, ${0.32 + thrust * 0.18})`);
			flame.addColorStop(1, "rgba(255, 107, 77, 0)");
			ctx.fillStyle = flame;
			ctx.beginPath();
			ctx.moveTo(-14 * scale, -6 * scale);
			ctx.lineTo((-38 - thrust * 16) * scale, 0);
			ctx.lineTo(-14 * scale, 6 * scale);
			ctx.closePath();
			ctx.fill();

			ctx.restore();
		};

		const draw = (time = 0) => {
			ctx.clearRect(0, 0, width, height);

			const base = ctx.createLinearGradient(0, 0, width, height);
			base.addColorStop(0, "#02040a");
			base.addColorStop(0.42, "#06121d");
			base.addColorStop(1, "#0f1730");
			ctx.fillStyle = base;
			ctx.fillRect(0, 0, width, height);

			const pointer = pointerRef.current;
			const pulse = pulseRef.current;
			const focusX = pointer.active
				? pointer.x
				: width * (0.62 + Math.sin(time * 0.00016) * 0.08);
			const focusY = pointer.active
				? pointer.y
				: height * (0.44 + Math.cos(time * 0.00018) * 0.1);
			const shipX = width * 0.55 + (focusX - width * 0.5) * 0.05;
			const shipY = height * 0.48 + (focusY - height * 0.5) * 0.04;
			const shipAngle = Math.atan2(focusY - shipY, focusX - shipX);

			const halo = ctx.createRadialGradient(
				focusX,
				focusY,
				8,
				focusX,
				focusY,
				Math.max(width, height) * (0.28 + pulse * 0.18),
			);
			halo.addColorStop(0, `rgba(255, 210, 122, ${0.18 + pulse * 0.2})`);
			halo.addColorStop(0.36, "rgba(96, 215, 207, 0.12)");
			halo.addColorStop(1, "rgba(96, 215, 207, 0)");
			ctx.fillStyle = halo;
			ctx.fillRect(0, 0, width, height);

			const lanePulse = reduceMotion ? 0 : Math.sin(time * 0.0008) * 0.08;
			drawOrbitLane(shipX, shipY, width * 0.28, height * 0.16, -0.38, 0.16);
			drawOrbitLane(shipX, shipY, width * 0.39, height * 0.23, 0.22, 0.1);
			drawOrbitLane(
				shipX,
				shipY,
				width * 0.16,
				height * 0.1,
				0.72,
				0.22 + lanePulse,
			);

			const visibleParticles =
				width < 720
					? particles.filter(
							(particle, index) => particle.kind !== "star" || index % 2 === 0,
						)
					: particles;

			const resolvedParticles = visibleParticles.map((particle) => {
				const parallaxX =
					(focusX / Math.max(width, 1) - 0.5) * particle.depth * 22;
				const parallaxY =
					(focusY / Math.max(height, 1) - 0.5) * particle.depth * 14;
				const drift = reduceMotion
					? 0
					: Math.sin(time * 0.00034 * particle.drift + particle.phase) *
						particle.depth *
						7;
				const baseX = particle.x * width;
				const baseY = particle.y * height;
				const distance = Math.hypot(baseX - focusX, baseY - focusY);
				const pull = pointer.active ? Math.max(0, 1 - distance / 280) : 0;
				const pulsePush = pulse * Math.max(0, 1 - distance / 420);

				return {
					x: baseX + parallaxX + drift + (focusX - baseX) * pull * 0.035,
					y: baseY + parallaxY + drift * 0.28 + (focusY - baseY) * pull * 0.025,
					kind: particle.kind,
					phase: particle.phase,
					size: particle.size + pull * 1.7 + pulsePush * 2.8,
					active: pull + pulsePush,
				};
			});

			for (const [index, node] of missionNodes.entries()) {
				const x = node.x * width;
				const y = node.y * height;
				const glow = reduceMotion
					? 0.3
					: 0.42 + Math.sin(time * 0.001 + node.phase) * 0.12;

				ctx.strokeStyle = `rgba(255, 210, 122, ${glow})`;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.arc(x, y, 14 + index * 1.8, 0, Math.PI * 2);
				ctx.stroke();

				if (width > 780) {
					ctx.fillStyle = "rgba(216, 255, 247, 0.62)";
					ctx.font = "700 10px Manrope, sans-serif";
					ctx.fillText(node.label, x + 18, y + 4);
				}
			}

			for (let i = 0; i < resolvedParticles.length; i += 1) {
				const a = resolvedParticles[i];

				for (let j = i + 1; j < resolvedParticles.length; j += 1) {
					const b = resolvedParticles[j];
					const distance = Math.hypot(a.x - b.x, a.y - b.y);
					const threshold =
						a.kind === "beacon" || b.kind === "beacon" ? 116 : 68;

					if (distance < threshold && (a.active > 0.04 || b.active > 0.04)) {
						const alpha = Math.min(
							0.32,
							0.04 + Math.max(a.active, b.active) * 0.24,
						);
						ctx.strokeStyle = `rgba(134, 245, 231, ${alpha})`;
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.moveTo(a.x, a.y);
						ctx.lineTo(b.x, b.y);
						ctx.stroke();
					}
				}
			}

			for (const particle of resolvedParticles) {
				const isTrail = particle.kind === "trail";
				const isBeacon = particle.kind === "beacon";
				const alpha = isBeacon ? 0.86 : isTrail ? 0.58 : 0.45;

				ctx.beginPath();
				ctx.fillStyle =
					particle.kind === "star"
						? `rgba(216, 255, 247, ${alpha + particle.active * 0.2})`
						: `rgba(255, 210, 122, ${alpha + particle.active * 0.22})`;
				ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
				ctx.fill();

				if (isBeacon || particle.active > 0.25) {
					ctx.strokeStyle = `rgba(96, 215, 207, ${0.18 + particle.active * 0.32})`;
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.arc(particle.x, particle.y, particle.size + 7, 0, Math.PI * 2);
					ctx.stroke();
				}
			}

			for (let index = 0; index < 9; index += 1) {
				const offset = reduceMotion
					? index * 18
					: ((time * 0.018 + index * 76) % (width + 160)) - 80;
				const y = height * (0.18 + index * 0.072);
				ctx.strokeStyle = "rgba(216, 255, 247, 0.08)";
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(offset, y);
				ctx.lineTo(offset + 86, y - 34);
				ctx.stroke();
			}

			drawShip(shipX, shipY, shipAngle, pulse);

			if (pulse > 0.02) {
				ctx.strokeStyle = `rgba(255, 210, 122, ${pulse * 0.46})`;
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.arc(focusX, focusY, 80 + pulse * 180, 0, Math.PI * 2);
				ctx.stroke();
				pulseRef.current = Math.max(0, pulse - 0.018);
			}

			if (!reduceMotion) {
				frameId = window.requestAnimationFrame(draw);
			}
		};

		const resizeAndRedraw = () => {
			resize();

			if (reduceMotion) {
				draw();
			}
		};

		resize();
		draw();

		const observer = new ResizeObserver(resizeAndRedraw);
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

		const triggerPulse = () => {
			pulseRef.current = 1;

			if (reduceMotion) {
				draw();
			}
		};

		window.addEventListener("pointermove", updatePointer);
		window.addEventListener("pointerleave", resetPointer);
		window.addEventListener("pointerdown", triggerPulse);

		return () => {
			observer.disconnect();
			window.removeEventListener("pointermove", updatePointer);
			window.removeEventListener("pointerleave", resetPointer);
			window.removeEventListener("pointerdown", triggerPulse);
			window.cancelAnimationFrame(frameId);
		};
	}, []);

	return (
		<div ref={wrapRef} className="vibe-space-background" aria-hidden="true">
			<canvas ref={canvasRef} className="vibe-space-canvas" />
		</div>
	);
}

function App() {
	return (
		<main className="overflow-hidden">
			<section className="vibe-hero">
				<SpaceMissionBackground />
				<div className="vibe-space-signal vibe-space-signal-left">
					<span>MISSION_CONTEXT</span>
					<strong>AGENTS.md</strong>
				</div>
				<div className="vibe-space-signal vibe-space-signal-right">
					<span>AI_REVIEW_ORBIT</span>
					<strong>Code Reviewer</strong>
				</div>
				<div className="page-wrap relative z-10 flex min-h-[72svh] flex-col justify-center px-4 py-16 text-white sm:py-20">
					<div className="max-w-4xl rise-in">
						<p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/24 bg-white/12 px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_48px_rgba(0,0,0,0.22)] backdrop-blur-md">
							<Bot size={18} aria-hidden="true" />
							Codex 驱动的团队 AI 协作开发规范
						</p>
						<h1 className="display-title mb-6 max-w-4xl text-5xl font-bold leading-[1.05] text-white sm:text-7xl">
							Vibe Coding
						</h1>
						<p className="mb-8 max-w-3xl text-lg leading-8 text-white/86 sm:text-xl">
							把 AI 协作从灵感点火推进到可验证交付：Codex
							负责执行航线，规范负责校准轨道，团队负责判断、验收和发射。
						</p>
						<div className="flex flex-wrap gap-3">
							<a href="#workflow" className="vibe-hero-button">
								开始使用
								<ArrowRight size={18} aria-hidden="true" />
							</a>
							<a href="#guardrails" className="vibe-hero-button-secondary">
								查看验证门禁
							</a>
						</div>
					</div>

					<div className="mt-12 grid max-w-4xl gap-3 sm:grid-cols-3">
						{[
							["6", "任务 Skill"],
							["1", "SessionStart 入口"],
							["0", "未验证不发射"],
						].map(([value, label]) => (
							<div key={label} className="vibe-stat">
								<strong>{value}</strong>
								<span>{label}</span>
							</div>
						))}
					</div>
				</div>
			</section>

			<section id="workflow" className="page-wrap px-4 py-12 sm:py-16">
				<div className="mb-8 max-w-3xl">
					<p className="island-kicker mb-3">Team Operating System</p>
					<h2 className="display-title mb-4 text-4xl font-bold leading-tight text-[var(--sea-ink)] sm:text-5xl">
						让每一次 AI 协作都有阶段、有证据、有记录。
					</h2>
					<p className="m-0 text-base leading-8 text-[var(--sea-ink-soft)]">
						Vibe Coding 不是让 AI
						更会表演，而是让团队更容易判断：该做什么、做到了没有、哪里有风险、下次如何接手。
					</p>
				</div>

				<div className="grid gap-4 md:grid-cols-4">
					{workflowSteps.map(({ title, desc, icon: Icon }, index) => (
						<article
							key={title}
							className="vibe-step-card rise-in"
							style={{ animationDelay: `${index * 70}ms` }}
						>
							<div className="vibe-icon-badge">
								<Icon size={22} aria-hidden="true" />
							</div>
							<p className="mb-2 text-sm font-bold text-[var(--lagoon-deep)]">
								0{index + 1}
							</p>
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

			<section className="vibe-band">
				<div className="page-wrap grid gap-8 px-4 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
					<div>
						<p className="island-kicker mb-3">Codex Plugin</p>
						<h2 className="display-title mb-4 text-4xl font-bold leading-tight text-[var(--sea-ink)] sm:text-5xl">
							从一句话导入，进化到自动加载团队规范。
						</h2>
						<p className="mb-6 text-base leading-8 text-[var(--sea-ink-soft)]">
							插件化后的 Vibe Coding 会在 Codex
							会话开始时给出入口提示，并按任务类型加载
							intake、plan、implement、review、verify、incident 等 skill。
						</p>
						<div className="flex flex-wrap gap-3">
							<span className="vibe-pill">
								<Layers3 size={16} aria-hidden="true" />
								AGENTS.md 优先
							</span>
							<span className="vibe-pill">
								<Zap size={16} aria-hidden="true" />
								自动阶段化
							</span>
							<span className="vibe-pill">
								<FileCheck2 size={16} aria-hidden="true" />
								文档同步
							</span>
						</div>
					</div>

					<div className="vibe-terminal">
						<div className="mb-5 flex items-center gap-2">
							<span />
							<span />
							<span />
						</div>
						<pre>
							<code>{`$ codex session-start
load: AGENTS.md
load: skills/vibe-intake
load: skills/vibe-plan

task: build feature
rule: no evidence, no done
docs: modules + changes + ADR`}</code>
						</pre>
					</div>
				</div>
			</section>

			<section className="page-wrap px-4 py-12 sm:py-16">
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{capabilities.map(([title, desc]) => (
						<article key={title} className="vibe-capability-card">
							<ShieldCheck
								className="mb-4 text-[var(--coral)]"
								size={26}
								aria-hidden="true"
							/>
							<h3 className="mb-2 text-lg font-bold text-[var(--sea-ink)]">
								{title}
							</h3>
							<p className="m-0 text-sm leading-7 text-[var(--sea-ink-soft)]">
								{desc}
							</p>
						</article>
					))}
				</div>
			</section>

			<section id="guardrails" className="page-wrap px-4 pb-16">
				<div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
					<div className="vibe-review-panel">
						<p className="island-kicker mb-3">Review Gate</p>
						<h2 className="display-title mb-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
							AI 可以写得快，但完成必须慢半拍验证。
						</h2>
						<p className="m-0 text-base leading-8 text-white/78">
							每个 PR 都要回答：AI
							做了什么、人工确认了什么、哪些文档同步了、验证证据在哪里。
						</p>
					</div>

					<div className="grid gap-3">
						{guardrails.map((item) => (
							<div key={item} className="vibe-check-row">
								<GitPullRequest size={19} aria-hidden="true" />
								<span>{item}</span>
							</div>
						))}
					</div>
				</div>
			</section>
		</main>
	);
}
