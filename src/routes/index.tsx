import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowRight,
	Bot,
	CheckCircle2,
	FileCheck2,
	GitPullRequest,
	Layers3,
	Sparkles,
	Workflow,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({ component: App });

const missionSections = [
	{
		id: "mission-core",
		nav: "任务核心",
		label: "Mission Core",
		shortcut: "M",
		kicker: "AI 协作任务控制台",
		title: "Vibe Coding",
		desc: "把 AI 协作从灵感点火推进到可验证交付：Codex 负责执行航线，规范负责校准轨道，团队负责判断、验收和发射。",
		status: "AGENTS.md 锁定任务坐标",
		command: "load AGENTS.md -> route by skill",
		icon: Sparkles,
		points: [
			"团队规则自动进入上下文",
			"需求、计划、实现、验证分段推进",
			"没有验证证据不允许发射",
		],
		metrics: [
			["6", "任务 Skill"],
			["1", "Session 入口"],
			["0", "未验证发射"],
		],
	},
	{
		id: "flight-plan",
		nav: "飞行计划",
		label: "Flight Plan",
		shortcut: "P",
		kicker: "Plan First",
		title: "先定航线，再让 Codex 加速。",
		desc: "复杂任务先明确目标、非目标、影响范围、验收方式和风险，避免 AI 一边猜一边改。",
		status: "Plan mode / Human Loop",
		command: "/plan complex task -> confirm -> implement",
		icon: Workflow,
		points: [
			"复杂需求优先进入计划模式",
			"方案确认前不修改代码",
			"风险、回滚和验证方式写在计划里",
		],
	},
	{
		id: "agent-stack",
		nav: "智能体栈",
		label: "Agent Stack",
		shortcut: "A",
		kicker: "Codex Plugin",
		title: "从一句话导入，升级到自动加载团队规范。",
		desc: "通过 Codex 插件、session-start hook 和 skills，把团队协作方式变成每次会话都会自动触达的工作系统。",
		status: "skills + hooks + AGENTS.md",
		command: "session-start -> vibe-intake / vibe-plan / vibe-review",
		icon: Layers3,
		points: [
			"AGENTS.md 优先",
			"按任务类型加载 skill",
			"模块文档和 change fragment 同步",
		],
	},
	{
		id: "review-orbit",
		nav: "审查轨道",
		label: "Review Orbit",
		shortcut: "R",
		kicker: "AI Review Gate",
		title: "每次有意义的功能修改，都进入独立审查轨道。",
		desc: "Code Reviewer 负责提前发现风险、测试缺口和可维护性问题；人仍然对最终合并负责。",
		status: "【AI提交】独立线程",
		command: "create_thread -> code-reviewer -> submit prep",
		icon: GitPullRequest,
		points: [
			"当前开发对话不直接 commit",
			"独立线程基于固定 diff 审查",
			"阻塞问题未解决不提交",
		],
	},
	{
		id: "verify-gate",
		nav: "验证闸门",
		label: "Verify Gate",
		shortcut: "V",
		kicker: "No Evidence, No Done",
		title: "没有验证证据，就不允许说完成。",
		desc: "构建、测试、浏览器检查、接口响应和风险记录都要能被 Review 复核，完成不是一句口头结论。",
		status: "build / check / browser evidence",
		command: "verify -> record evidence -> review",
		icon: CheckCircle2,
		points: [
			"验证命令写入 change fragment",
			"高风险变更保留人工 Review",
			"失败结果必须如实记录",
		],
	},
	{
		id: "launch-protocol",
		nav: "发射协议",
		label: "Launch Protocol",
		shortcut: "L",
		kicker: "Commit & PR",
		title: "提交前，让记录、文档和 PR 草案一起就位。",
		desc: "模块文档描述当前事实，change fragment 解释为什么改，PR 描述说明验证证据和剩余风险。",
		status: "Lore commit + PR draft",
		command: "explicit git add paths -> local commit only",
		icon: FileCheck2,
		points: [
			"一个有意义任务一份 change fragment",
			"模块事实变化必须同步模块文档",
			"默认不 push、不创建远端 PR",
		],
	},
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
	{ label: "CORE", x: 0.18, y: 0.66, phase: 0.2 },
	{ label: "PLAN", x: 0.32, y: 0.38, phase: 1.1 },
	{ label: "STACK", x: 0.5, y: 0.5, phase: 1.7 },
	{ label: "REVIEW", x: 0.66, y: 0.32, phase: 2.4 },
	{ label: "VERIFY", x: 0.8, y: 0.58, phase: 3.2 },
	{ label: "LAUNCH", x: 0.88, y: 0.28, phase: 4.1 },
];

const missionPalettes = [
	{ primary: "134, 245, 231", accent: "255, 210, 122" },
	{ primary: "126, 214, 255", accent: "255, 210, 122" },
	{ primary: "159, 245, 191", accent: "96, 215, 207" },
	{ primary: "255, 138, 104", accent: "255, 210, 122" },
	{ primary: "96, 215, 207", accent: "216, 255, 247" },
	{ primary: "255, 210, 122", accent: "255, 138, 104" },
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

function SpaceMissionBackground({
	activeSectionIndex,
}: {
	activeSectionIndex: number;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const wrapRef = useRef<HTMLDivElement>(null);
	const pointerRef = useRef({ active: false, x: 0, y: 0 });
	const pulseRef = useRef(0);
	const activeRef = useRef(activeSectionIndex);
	const reduceMotionRef = useRef(false);
	const redrawRef = useRef<(() => void) | null>(null);

	useEffect(() => {
		activeRef.current = activeSectionIndex;
		pulseRef.current = Math.max(pulseRef.current, 0.42);

		if (reduceMotionRef.current) {
			redrawRef.current?.();
		}
	}, [activeSectionIndex]);

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
		reduceMotionRef.current = reduceMotion;

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
			color: string,
		) => {
			ctx.save();
			ctx.translate(centerX, centerY);
			ctx.rotate(rotation);
			ctx.strokeStyle = `rgba(${color}, ${alpha})`;
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
			const activeIndex = Math.min(
				Math.max(activeRef.current, 0),
				missionNodes.length - 1,
			);
			const activeNode = missionNodes[activeIndex];
			const palette = missionPalettes[activeIndex] ?? missionPalettes[0];
			const progress = activeIndex / Math.max(missionNodes.length - 1, 1);
			const focusX = pointer.active
				? pointer.x
				: width * (activeNode.x + Math.sin(time * 0.00016) * 0.04);
			const focusY = pointer.active
				? pointer.y
				: height * (activeNode.y + Math.cos(time * 0.00018) * 0.035);
			const shipX =
				width * (0.2 + progress * 0.6) + (focusX - width * 0.5) * 0.05;
			const shipY =
				height * (0.66 - progress * 0.36) + (focusY - height * 0.5) * 0.04;
			const shipAngle = Math.atan2(focusY - shipY, focusX - shipX);

			const halo = ctx.createRadialGradient(
				focusX,
				focusY,
				8,
				focusX,
				focusY,
				Math.max(width, height) * (0.28 + pulse * 0.18),
			);
			halo.addColorStop(0, `rgba(${palette.accent}, ${0.18 + pulse * 0.2})`);
			halo.addColorStop(0.36, `rgba(${palette.primary}, 0.12)`);
			halo.addColorStop(1, `rgba(${palette.primary}, 0)`);
			ctx.fillStyle = halo;
			ctx.fillRect(0, 0, width, height);

			const lanePulse = reduceMotion ? 0 : Math.sin(time * 0.0008) * 0.08;
			drawOrbitLane(
				shipX,
				shipY,
				width * 0.28,
				height * 0.16,
				-0.38,
				0.16 + activeIndex * 0.015,
				palette.primary,
			);
			drawOrbitLane(
				shipX,
				shipY,
				width * 0.39,
				height * 0.23,
				0.22,
				0.1,
				palette.primary,
			);
			drawOrbitLane(
				shipX,
				shipY,
				width * 0.16,
				height * 0.1,
				0.72,
				0.22 + lanePulse,
				palette.accent,
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

			for (let index = 0; index < missionNodes.length - 1; index += 1) {
				const from = missionNodes[index];
				const to = missionNodes[index + 1];
				const isTraveled = index < activeIndex;

				ctx.strokeStyle = isTraveled
					? `rgba(${palette.primary}, 0.34)`
					: "rgba(216, 255, 247, 0.08)";
				ctx.lineWidth = isTraveled ? 1.6 : 1;
				ctx.setLineDash(isTraveled ? [] : [6, 16]);
				ctx.beginPath();
				ctx.moveTo(from.x * width, from.y * height);
				ctx.quadraticCurveTo(
					((from.x + to.x) / 2) * width,
					(Math.min(from.y, to.y) - 0.1) * height,
					to.x * width,
					to.y * height,
				);
				ctx.stroke();
				ctx.setLineDash([]);
			}

			for (const [index, node] of missionNodes.entries()) {
				const x = node.x * width;
				const y = node.y * height;
				const isActive = index === activeIndex;
				const isVisited = index < activeIndex;
				const glow = reduceMotion
					? isActive
						? 0.68
						: 0.28
					: (isActive ? 0.76 : isVisited ? 0.44 : 0.2) +
						Math.sin(time * 0.001 + node.phase) * (isActive ? 0.12 : 0.04);

				ctx.strokeStyle = `rgba(${isActive ? palette.accent : palette.primary}, ${glow})`;
				ctx.lineWidth = isActive ? 2 : 1;
				ctx.beginPath();
				ctx.arc(x, y, (isActive ? 20 : 14) + index * 1.1, 0, Math.PI * 2);
				ctx.stroke();

				if (width > 780) {
					ctx.fillStyle = isActive
						? `rgba(${palette.accent}, 0.84)`
						: "rgba(216, 255, 247, 0.56)";
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
						ctx.strokeStyle = `rgba(${palette.primary}, ${alpha})`;
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
						: `rgba(${palette.accent}, ${alpha + particle.active * 0.22})`;
				ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
				ctx.fill();

				if (isBeacon || particle.active > 0.25) {
					ctx.strokeStyle = `rgba(${palette.primary}, ${0.18 + particle.active * 0.32})`;
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
				ctx.strokeStyle = `rgba(${palette.primary}, 0.08)`;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(offset, y);
				ctx.lineTo(offset + 86, y - 34);
				ctx.stroke();
			}

			drawShip(shipX, shipY, shipAngle, pulse);

			if (pulse > 0.02) {
				ctx.strokeStyle = `rgba(${palette.accent}, ${pulse * 0.46})`;
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
		redrawRef.current = () => draw();

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
			redrawRef.current = null;
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
	const [activeSectionIndex, setActiveSectionIndex] = useState(0);
	const sectionRefs = useRef<Array<HTMLElement | null>>([]);

	useEffect(() => {
		const updateActiveSection = () => {
			const viewportAnchor = window.innerHeight * 0.42;
			let nextIndex = 0;
			let bestDistance = Number.POSITIVE_INFINITY;

			for (const [index, section] of sectionRefs.current.entries()) {
				if (!section) {
					continue;
				}

				const rect = section.getBoundingClientRect();
				const distance = Math.abs(
					rect.top + rect.height * 0.28 - viewportAnchor,
				);

				if (distance < bestDistance) {
					bestDistance = distance;
					nextIndex = index;
				}
			}

			setActiveSectionIndex(nextIndex);
		};

		const observer = new IntersectionObserver(
			(entries) => {
				const visibleEntry = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

				if (!visibleEntry) {
					return;
				}

				const index = Number(
					(visibleEntry.target as HTMLElement).dataset.missionIndex ?? 0,
				);
				setActiveSectionIndex(index);
			},
			{
				rootMargin: "-36% 0px -44% 0px",
				threshold: [0.12, 0.35, 0.62],
			},
		);

		for (const section of sectionRefs.current) {
			if (section) {
				observer.observe(section);
			}
		}

		updateActiveSection();
		window.addEventListener("scroll", updateActiveSection, { passive: true });
		window.addEventListener("resize", updateActiveSection);

		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", updateActiveSection);
			window.removeEventListener("resize", updateActiveSection);
		};
	}, []);

	return (
		<main className="vibe-stage">
			<SpaceMissionBackground activeSectionIndex={activeSectionIndex} />
			<nav className="vibe-mission-nav" aria-label="首页任务章节">
				<p>MISSION ROUTE</p>
				<ol>
					{missionSections.map((section, index) => (
						<li key={section.id}>
							<a
								href={`#${section.id}`}
								className="vibe-mission-nav-link"
								aria-current={index === activeSectionIndex ? "step" : undefined}
								onClick={() => setActiveSectionIndex(index)}
							>
								<span>[{section.shortcut}]</span>
								<strong>{section.nav}</strong>
								<em>{section.label}</em>
							</a>
						</li>
					))}
				</ol>
			</nav>

			<div className="vibe-stage-content">
				<div className="page-wrap px-4">
					<nav className="vibe-command-strip" aria-label="任务快捷提示">
						<span>SCROLL OR PRESS</span>
						{missionSections.map((section, index) => (
							<a
								key={section.id}
								href={`#${section.id}`}
								aria-current={index === activeSectionIndex ? "step" : undefined}
								onClick={() => setActiveSectionIndex(index)}
							>
								[{section.shortcut}] {section.nav}
							</a>
						))}
					</nav>
				</div>

				{missionSections.map((section, index) => {
					const Icon = section.icon;
					const isHero = index === 0;

					return (
						<section
							key={section.id}
							id={section.id}
							ref={(node) => {
								sectionRefs.current[index] = node;
							}}
							data-mission-index={index}
							data-active={index === activeSectionIndex ? "true" : "false"}
							className={`vibe-stage-section${isHero ? " vibe-stage-hero" : ""}${
								index % 2 === 1 ? " vibe-stage-section-alt" : ""
							}`}
						>
							<div className="page-wrap vibe-stage-grid px-4">
								<div className="vibe-stage-panel rise-in">
									<p className="vibe-stage-eyebrow">
										<span>[{section.shortcut}]</span>
										{section.kicker}
									</p>
									{isHero ? (
										<>
											<p className="vibe-stage-supertitle">
												<Bot size={18} aria-hidden="true" />
												AI 协作任务控制台
											</p>
											<h1 className="display-title vibe-stage-title">
												{section.title}
											</h1>
										</>
									) : (
										<h2 className="display-title vibe-stage-title">
											{section.title}
										</h2>
									)}
									<p className="vibe-stage-copy">{section.desc}</p>
									<div className="vibe-stage-actions">
										{isHero ? (
											<>
												<a href="#flight-plan" className="vibe-hero-button">
													开始使用
													<ArrowRight size={18} aria-hidden="true" />
												</a>
												<a
													href="#verify-gate"
													className="vibe-hero-button-secondary"
												>
													查看验证门禁
												</a>
											</>
										) : (
											<span className="vibe-stage-status">
												{section.status}
											</span>
										)}
									</div>
								</div>

								<div className="vibe-stage-orbit-panel">
									<div className="vibe-stage-orbit-head">
										<div className="vibe-stage-icon">
											<Icon size={24} aria-hidden="true" />
										</div>
										<div>
											<p>{section.label}</p>
											<strong>{section.status}</strong>
										</div>
									</div>

									<pre className="vibe-stage-command">
										<code>{`$ ${section.command}`}</code>
									</pre>

									{section.metrics ? (
										<div className="vibe-stage-metrics">
											{section.metrics.map(([value, label]) => (
												<div key={label} className="vibe-stat">
													<strong>{value}</strong>
													<span>{label}</span>
												</div>
											))}
										</div>
									) : null}

									<ul className="vibe-stage-checklist">
										{section.points.map((point) => (
											<li key={point}>
												<CheckCircle2 size={17} aria-hidden="true" />
												<span>{point}</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						</section>
					);
				})}
			</div>
		</main>
	);
}
