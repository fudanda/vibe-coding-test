export type ChangeImpactType =
	| "feature"
	| "fix"
	| "docs"
	| "config"
	| "refactor"
	| "test"
	| "incident";

export type ReviewState = "reviewed" | "pending" | "partial";

export type ChangeImpactRecord = {
	id: string;
	title: string;
	date: string;
	time: string;
	author: string;
	type: ChangeImpactType;
	reviewState: ReviewState;
	review: string;
	fragmentPath: string;
	summary: string;
	modules: string[];
	files: string[];
	changes: string[];
	verification: string[];
	risks: string[];
	docSync: string[];
	tokenCost: string;
};

export const changeTypeLabels: Record<ChangeImpactType, string> = {
	feature: "功能",
	fix: "修复",
	docs: "文档",
	config: "配置",
	refactor: "重构",
	test: "测试",
	incident: "事故",
};

export const reviewStateLabels: Record<ReviewState, string> = {
	reviewed: "已 AI Review",
	pending: "待 Review",
	partial: "部分 Review",
};

export const changeImpactRecords: ChangeImpactRecord[] = [
	{
		id: "change-impact-map",
		title: "新增功能变更影响图页面",
		date: "2026-06-25",
		time: "18:04",
		author: "fudanda",
		type: "feature",
		reviewState: "reviewed",
		review:
			"AI：Codex/code-reviewer，初审发现空状态和移动端裁切阻塞项，已修复并重新验证。",
		fragmentPath:
			"docs/vibe-coding/changes/2026/06/2026-06-25-1804-fudanda-change-impact-map.md",
		summary:
			"把 change fragment 的原因、影响模块、关键文件、验证证据和 Review 状态整理成可交互关系图。",
		modules: ["变更影响图", "路由页面", "样式主题", "模块文档"],
		files: [
			"src/routes/changes.tsx",
			"src/lib/change-impact-data.ts",
			"src/styles.css",
			"docs/vibe-coding/modules/routing-pages.md",
		],
		changes: [
			"新增 /changes 页面，包含变更时间线、筛选、影响关系图和详情面板。",
			"新增静态 ChangeImpactRecord 数据，映射代表性 change fragment。",
			"在 Header 和 Docs 页面增加变更图入口，并同步模块文档。",
		],
		verification: [
			"npx biome check 覆盖变更页面、静态数据、Header 和 Docs 页面。",
			"npm run build 通过，client 和 SSR 均生成 changes chunk。",
			"Invoke-WebRequest /changes 返回 200，页面内容包含首屏标题。",
			"移动端验证筛选空状态一致，关系图节点未越出画布边界。",
		],
		risks: ["v1 使用静态数据，新增 change fragment 后需要同步维护本文件。"],
		docSync: [
			"已更新：docs/vibe-coding/modules/routing-pages.md",
			"已更新：docs/vibe-coding/modules/styling-theme.md",
		],
		tokenCost: "未记录（当前规则不使用 Codex goal 统计）",
	},
	{
		id: "chinese-thread-prefix",
		title: "同步中文独立线程标题前缀",
		date: "2026-06-25",
		time: "17:28",
		author: "fudanda",
		type: "docs",
		reviewState: "reviewed",
		review: "AI：Codex/code-reviewer，独立提交准备线程和子审查均无阻塞问题。",
		fragmentPath:
			"docs/vibe-coding/changes/2026/06/2026-06-25-1728-fudanda-chinese-thread-prefix.md",
		summary:
			"把独立 Review 和提交准备线程前缀统一为中文，方便团队在 Codex 侧边栏识别线程用途。",
		modules: ["协作规则", "Review 流程", "提交准备流程"],
		files: ["AGENTS.md", "docs/vibe-coding/reviews/README.md"],
		changes: [
			"Review 线程标题改为【AI审查】vibe-coding-test｜<任务短标题>。",
			"提交准备线程标题改为【AI提交】vibe-coding-test｜<任务短标题>。",
			"明确【AI提交】不代表自动 push、创建 PR、合并或发布。",
		],
		verification: [
			"rg 检查现行规则正文不再使用英文前缀。",
			"rg 检查中文前缀、set_thread_title 和目标线程标题规则。",
			"git diff --check 通过；Code Reviewer 子审查无阻塞问题。",
		],
		risks: ["历史 change fragment 保留英文前缀作为历史事实，不回改。"],
		docSync: ["不需要：本次修改协作规则，不改变业务模块当前事实。"],
		tokenCost: "未记录（当前规则不使用 Codex goal 统计）",
	},
	{
		id: "slow-docs-particles",
		title: "降低文档页粒子动画速度",
		date: "2026-06-25",
		time: "16:53",
		author: "fudanda",
		type: "fix",
		reviewState: "reviewed",
		review:
			"AI：Codex/code-reviewer，独立提交准备对话和 Code Reviewer 线程未发现阻塞问题。",
		fragmentPath:
			"docs/vibe-coding/changes/2026/06/2026-06-25-1653-fudanda-slow-docs-particles.md",
		summary:
			"文档页粒子、数据包和扫描线速度偏快，本次保留 AI 科技感并降低背景运动节奏。",
		modules: ["文档页", "路由页面", "样式主题"],
		files: [
			"src/routes/docs.tsx",
			"docs/vibe-coding/modules/routing-pages.md",
			"docs/vibe-coding/modules/styling-theme.md",
		],
		changes: [
			"在 Docs 粒子背景中加入统一 motionScale。",
			"降低粒子漂移、自动焦点、数据包、扫描线和时间波动速度。",
			"同步路由和样式模块文档。",
		],
		verification: [
			"npx biome check 覆盖 Docs 路由和模块文档。",
			"npm run build 通过。",
			"Invoke-WebRequest /docs 返回 200。",
		],
		risks: ["只调整动画速度，不改变页面结构和文档入口。"],
		docSync: [
			"已更新：docs/vibe-coding/modules/routing-pages.md",
			"已更新：docs/vibe-coding/modules/styling-theme.md",
		],
		tokenCost: "未记录（当前规则不使用 Codex goal 统计）",
	},
	{
		id: "optimize-store-demo-page",
		title: "优化状态示例页面",
		date: "2026-06-25",
		time: "16:19",
		author: "fudanda",
		type: "feature",
		reviewState: "pending",
		review: "未评审，提交前需要在独立提交准备流程中调用 Codex/code-reviewer。",
		fragmentPath:
			"docs/vibe-coding/changes/2026/06/2026-06-25-1619-fudanda-optimize-store-demo-page.md",
		summary:
			"把基础 TanStack Store 输入示例升级成状态控制台，展示状态订阅、派生状态和 Devtools 传播。",
		modules: ["状态示例", "Store Devtools", "样式主题"],
		files: [
			"src/routes/demo/store.tsx",
			"src/lib/demo-store.ts",
			"src/lib/demo-store-devtools.tsx",
			"src/styles.css",
			"docs/vibe-coding/modules/demo-store.md",
		],
		changes: [
			"新增状态快照、指标卡、状态传播链路和 Live JSON。",
			"扩展 store 状态模型，增加角色、任务阶段、关注任务和信心分。",
			"扩展 Store Devtools 面板展示新增状态字段和派生摘要。",
		],
		verification: [
			"npx biome check 覆盖 touched TS/TSX 文件。",
			"npm run build 通过。",
			"Playwright 验证桌面和移动端交互同步，控制台无错误。",
		],
		risks: ["后续新增字段时需要同步页面、Devtools、Live JSON 和模块文档。"],
		docSync: ["已更新：docs/vibe-coding/modules/demo-store.md"],
		tokenCost: "未记录（当前规则不使用 Codex goal 统计）",
	},
	{
		id: "optimize-drizzle-database-page",
		title: "优化 Drizzle 数据库示例页面",
		date: "2026-06-25",
		time: "13:58",
		author: "fudanda",
		type: "feature",
		reviewState: "reviewed",
		review: "AI：Codex/code-reviewer，首轮发现排序阻塞项，修复后复审 APPROVE。",
		fragmentPath:
			"docs/vibe-coding/changes/2026/06/2026-06-25-1358-fudanda-optimize-drizzle-database-page.md",
		summary:
			"把 Drizzle 示例升级为数据库工作台，直观看到 SQLite、server function 和 Drizzle ORM 的读写链路。",
		modules: ["数据库示例", "查询示例", "表格示例", "样式主题"],
		files: [
			"src/routes/demo/drizzle.tsx",
			"src/routes/demo/tanstack-query.tsx",
			"src/routes/demo/table.tsx",
			"src/db/todos.ts",
			"src/styles.css",
			"docs/vibe-coding/modules/database-drizzle.md",
		],
		changes: [
			"新增数据链路、统计卡片、写入面板、schema 面板和真实记录列表。",
			"增加 resetTodoItems()，支持事务化清空并恢复样例数据。",
			"将数据库访问改为 server function handler 内动态 import。",
		],
		verification: [
			"npx biome check 覆盖数据库、查询、表格和 todos 数据层文件。",
			"npm run build 通过。",
			"Playwright 验证新增、重置、桌面渲染和移动端无横向溢出。",
		],
		risks: ["resetTodoItems() 会删除演示表当前数据，只能用于 demo。"],
		docSync: [
			"已更新：docs/vibe-coding/modules/database-drizzle.md",
			"已更新：docs/vibe-coding/modules/styling-theme.md",
		],
		tokenCost: "未记录（当前规则不使用 Codex goal 统计）",
	},
	{
		id: "optimize-table-demo-page",
		title: "优化表格示例页面",
		date: "2026-06-25",
		time: "13:23",
		author: "fudanda",
		type: "feature",
		reviewState: "pending",
		review: "未评审，提交准备对话需执行 Codex/code-reviewer。",
		fragmentPath:
			"docs/vibe-coding/changes/2026/06/2026-06-25-1323-fudanda-optimize-table-demo-page.md",
		summary:
			"表格示例已经接入真实 SQLite 和 server function，本次升级为更适合展示数据链路和表格能力的数据工作台。",
		modules: ["表格示例", "样式主题", "模块文档"],
		files: [
			"src/routes/demo/table.tsx",
			"src/styles.css",
			"docs/vibe-coding/modules/demo-table.md",
			"docs/vibe-coding/modules/styling-theme.md",
		],
		changes: [
			"新增搜索、数据链路、统计卡、Mutation 表单、分页和调试状态区。",
			"表格列改为中文展示，增加进度条、状态标签和空结果提示。",
			"补充 table-* 页面专用样式和模块文档。",
		],
		verification: [
			"npx biome check 覆盖表格路由。",
			"npm run build 通过。",
			"Playwright 验证搜索、分页、新增、重置和移动端无横向溢出。",
		],
		risks: ["未改变 SQLite 表结构和 server function 数据契约。"],
		docSync: [
			"已更新：docs/vibe-coding/modules/demo-table.md",
			"已更新：docs/vibe-coding/modules/styling-theme.md",
		],
		tokenCost: "未记录（当前规则不使用 Codex goal 统计）",
	},
	{
		id: "optimize-query-demo-page",
		title: "优化查询示例页面",
		date: "2026-06-25",
		time: "11:36",
		author: "fudanda",
		type: "feature",
		reviewState: "reviewed",
		review: "AI：Codex/code-reviewer，COMMENT，无阻塞问题。",
		fragmentPath:
			"docs/vibe-coding/changes/2026/06/2026-06-25-1136-fudanda-optimize-query-demo-page.md",
		summary:
			"把 React Query 示例升级为查询控制台，展示真实数据库记录、查询状态和 Data Path。",
		modules: ["查询示例", "数据库示例", "样式主题"],
		files: [
			"src/routes/demo/tanstack-query.tsx",
			"src/styles.css",
			"docs/vibe-coding/modules/tanstack-query.md",
			"docs/vibe-coding/modules/styling-theme.md",
		],
		changes: [
			"新增查询状态、刷新控制、结果数量、最新编号和最近同步时间。",
			"保持 React Query -> Server Function -> SQLite 链路不变。",
			"新增结果流列表和 Data Path 面板。",
		],
		verification: [
			"npx biome check 覆盖查询路由、样式和模块文档。",
			"npm run build 通过。",
			"Invoke-WebRequest /demo/tanstack-query 返回 200；Playwright 检查桌面和移动端。",
		],
		risks: ["主要是 UI 展示增强，未改变数据库查询实现。"],
		docSync: [
			"已更新：docs/vibe-coding/modules/tanstack-query.md",
			"已更新：docs/vibe-coding/modules/styling-theme.md",
		],
		tokenCost: "未记录（当前规则不使用 Codex goal 统计）",
	},
];
