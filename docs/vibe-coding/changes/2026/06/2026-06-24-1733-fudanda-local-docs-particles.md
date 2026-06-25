# 将文档入口改为本地文档中心

- 日期：2026-06-24
- 作者：fudanda
- Review：
- PR：
- Commit：
- 影响模块：src/components/Header.tsx, src/routes/docs.tsx, src/styles.css, docs/vibe-coding/modules/*
- 类型：feature
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）
- AI 协助：Codex 参与实现、文档同步和验证整理

## 为什么改

导航里的“文档”原本跳转到外部 TanStack 文档，不适合作为 Vibe Coding 测试项目的团队规范入口。需要改成本地页面，让开发者在项目内查看规则、流程、Review 和 PR 入口。

## 改了什么

- 将 Header 的“文档”导航改为 TanStack Router 本地路由 `/docs`。
- 新增 `/docs` 本地文档中心页面。
- 为文档中心新增可交互 canvas 粒子背景和本地文档入口布局。
- 同步更新应用壳层、路由页面、UI 组件模块文档。

## 模块文档同步

- [ ] 不需要，原因：
- [x] 已更新：`docs/vibe-coding/modules/app-shell.md`、`docs/vibe-coding/modules/routing-pages.md`、`docs/vibe-coding/modules/ui-components.md`

## 验证方式

- 已运行：`npm run generate-routes`，通过。
- 已运行：`npm run build`，通过；构建输出包含既有 Drizzle 示例的 `createServerFn().inputValidator()` 废弃提示，非本次文档页变更引入。
- 已运行：`npx biome check --max-diagnostics=100 src\components\Header.tsx src\routes\docs.tsx src\styles.css`，本次 TSX 文件定向检查通过。
- 已运行：`Invoke-WebRequest http://localhost:3002/docs`，返回 `200`，页面内容包含 `Vibe Coding 文档中心`。
- 已运行：`npm run check`，未通过；失败项来自项目既有 Biome schema 版本、格式化、未使用 import 和 `src/db/index.ts` 非空断言等问题，不作为本次文档页变更的通过条件。

## 风险和后续事项

- 粒子背景依赖浏览器 canvas，已按 `prefers-reduced-motion` 降低动画强度。
- 后续如果文档体系继续扩展，可以把文档清单抽成数据源或生成索引。
