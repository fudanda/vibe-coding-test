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

function App() {
	return (
		<main className="overflow-hidden">
			<section className="vibe-hero">
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
							把“感觉对了就让 AI
							写”的随意协作，升级成可复盘、可验证、可交接的团队工程流程。 Codex
							负责执行，规范负责定边界，团队负责判断和验收。
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
							["0", "无验证不完成"],
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
