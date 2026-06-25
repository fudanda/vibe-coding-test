# 优化查询示例页面

- 日期：2026-06-25
- 作者：fudanda
- Review：AI：Codex/code-reviewer（COMMENT，无阻塞问题；已修复无障碍 landmark 命名建议）
- PR：未创建
- Commit：见本文件所在提交
- 影响模块：src/routes/demo/tanstack-query.tsx；src/styles.css；docs/vibe-coding/modules/tanstack-query.md；docs/vibe-coding/modules/styling-theme.md
- 类型：feature
- AI 协助：Codex
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）

## 为什么改

原查询示例已经接入 SQLite 真实数据，但页面表现偏基础，无法充分展示 React Query 查询状态、真实数据来源和查询链路。需要把它优化成更适合作为 Vibe Coding 演示项目的查询控制台页面。

## 改了什么

- 将 `/demo/tanstack-query` 改为查询控制台视觉，增加查询状态、刷新控制、结果数量、最新编号和最近同步时间。
- 保持现有 `React Query -> Server Function -> SQLite todos` 数据链路不变，只增强页面展示。
- 增加结果流列表，展示真实数据库记录、行号和 SQLite row id。
- 增加 Data Path 面板，明确页面如何从 React Query 走到 Server Function 和 SQLite。
- 在 `src/styles.css` 增加 `query-*` 页面样式、动态网格背景、深色模式和移动端布局保护。
- 同步更新 TanStack Query 模块文档和样式主题模块文档。

## 模块文档同步

- [ ] 不需要，原因：
- [x] 已更新：`docs/vibe-coding/modules/tanstack-query.md`
- [x] 已更新：`docs/vibe-coding/modules/styling-theme.md`

## 验证方式

- `npx biome check --write src\routes\demo\tanstack-query.tsx`
- `npx biome check src\routes\demo\tanstack-query.tsx src\styles.css docs\vibe-coding\modules\tanstack-query.md docs\vibe-coding\modules\styling-theme.md`
- `git diff --check`
- `npm run build`
- `Invoke-WebRequest http://127.0.0.1:3003/demo/tanstack-query` 返回 200，未出现查询失败文案。
- 使用 Playwright 打开 `/demo/tanstack-query`，桌面和移动端截图确认页面可见、真实数据展示正常、按钮和列表无重叠。

## 风险和后续事项

- 本次主要是 UI 展示增强，未改变数据库查询实现，风险较低。
- Vite 构建仍提示 `src/routes/demo/drizzle.tsx` 中 `inputValidator()` 已废弃，这是既有警告，不属于本次查询页面优化范围。
- 深色模式已补样式，但本次未单独保存深色模式截图。
