# 优化状态示例页面

- 日期：2026-06-25
- 作者：fudanda
- AI 协助：Codex 负责页面分析、实现、模块文档同步和验证
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）
- Review：未评审（提交前需要在独立提交准备流程中调用 Codex/code-reviewer）
- PR：未创建
- Commit：未提交
- 影响模块：`src/routes/demo/store.tsx`、`src/lib/demo-store.ts`、`src/lib/demo-store-devtools.tsx`、`src/styles.css`、`docs/vibe-coding/modules/demo-store.md`
- 类型：feature

## 为什么改

原状态示例页面只展示 First Name、Last Name 和 Full Name 三个基础输入，视觉和交互都弱于表格、查询、数据库示例页面，不能充分体现 TanStack Store 的状态订阅、派生状态和 Devtools 事件传播能力。

## 改了什么

- 将 `/demo/store` 改为状态控制台页面，增加顶部说明区、当前状态快照、指标卡、基础状态编辑区、状态传播链路和 Live JSON。
- 扩展 demo store 状态模型，增加角色、任务阶段、关注任务和信心分。
- 增加 `statusSummary` 派生 Store，并通过统一更新函数和保留订阅对象确保派生状态实时同步。
- 扩展自定义 Store Devtools 面板，展示新增状态字段和派生摘要。
- 新增状态示例专属 CSS，包含响应式控制台布局、暗色模式、动效和 reduced-motion 处理。
- 同步更新 TanStack Store 模块文档。

## 模块文档同步

- [x] 已更新：`docs/vibe-coding/modules/demo-store.md`

## 验证方式

- 已通过：`npx biome check src/lib/demo-store.ts src/lib/demo-store-devtools.tsx src/routes/demo/store.tsx`，本次 touched TS/TSX 文件无新增 Biome 问题。
- 已通过：`npm run build`，Vite client 和 SSR 构建成功。
- 已通过：`git diff --check`，未发现空白错误。
- 已通过：启动 dev server 后访问 `http://127.0.0.1:3002/demo/store` 返回 200。
- 已通过：Playwright + 本机 Chrome 验证桌面端交互，修改姓名、角色、阶段、关注任务和信心分后，当前状态、状态摘要和 Live JSON 同步更新，控制台无错误。
- 已通过：Playwright + 本机 Chrome 验证 390px 移动端，无横向溢出，控制台无错误。
- 已知：全仓 `npm run check` 仍被既有无关 lint/format 问题拦截，包含 `src/db/index.ts` 非空断言、`src/router.tsx` 未使用 import、旧文件格式化和 `__root.tsx` 既有 `dangerouslySetInnerHTML` 规则。

## 风险和后续事项

- 本次扩展了状态模型，后续新增字段时需要同步页面、Devtools、Live JSON 和模块文档。
- 提交前需要通过独立提交准备流程补充 Code Reviewer 审查。
