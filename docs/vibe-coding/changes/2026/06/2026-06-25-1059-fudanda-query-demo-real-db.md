# 查询示例接入真实 SQLite 数据

- 日期：2026-06-25
- 作者：fudanda
- AI 协助：Codex
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）
- Review：未评审
- PR：
- Commit：
- 影响模块：`src/routes/demo/tanstack-query.tsx`、`src/db/todos.ts`、`docs/vibe-coding/modules/tanstack-query.md`、`docs/vibe-coding/modules/database-drizzle.md`、`docs/vibe-coding/modules/routing-pages.md`
- 类型：feature

## 为什么改

查询示例之前使用前端 Promise 假数据，只能演示 React Query 的基础渲染，不能验证项目已经接入的 SQLite、Drizzle 和 server function 数据链路。现在需要让查询示例读取真实数据库数据，方便后续继续扩展远程 API、本地缓存、错误重试和离线 fallback。

## 改了什么

- 将 `/demo/tanstack-query` 从本地假数据改为通过 TanStack Start server function 查询 SQLite `todos` 表。
- 复用 `src/db/todos.ts` 的建表、种子数据和查询封装，让查询示例和 Drizzle 示例共享真实演示数据。
- 页面补齐 loading、error、empty、success 和手动“重新查询”状态。
- 同步更新 TanStack Query、Drizzle 数据库和路由模块文档。

## 模块文档同步

- [x] 已更新：`docs/vibe-coding/modules/tanstack-query.md`
- [x] 已更新：`docs/vibe-coding/modules/database-drizzle.md`
- [x] 已更新：`docs/vibe-coding/modules/routing-pages.md`

## 验证方式

- `npx biome check src\routes\demo\tanstack-query.tsx src\db\todos.ts docs\vibe-coding\modules\tanstack-query.md docs\vibe-coding\modules\database-drizzle.md docs\vibe-coding\modules\routing-pages.md` 通过。
- `Invoke-WebRequest http://127.0.0.1:3002/demo/tanstack-query -SkipHttpErrorCheck` 返回 200，页面包含“真实数据库查询示例”和 “SQLite”，未出现 `Something went wrong`。
- 直接查询 `dev.db` 的 `todos` 表，确认存在真实记录：`梳理 Vibe Coding 需求边界`、`补齐变更记录和验证证据`、`生成中文 Lore 提交信息草案` 等。
- 使用 Playwright 打开 `/demo/tanstack-query`，页面实际渲染数据库记录和 `#id`，控制台无业务错误。
- `npm run build` 通过；构建仍提示既有 `src/routes/demo/drizzle.tsx` 的 `createServerFn().inputValidator()` 弃用警告。

## 风险和后续事项

- `todos` 表运行时自动创建只适合本地演示；正式业务表仍应通过 migration 管理。
- 当前查询示例只读本地 SQLite，尚未实现远程 API、本地缓存、错误重试和离线 fallback。
- 如果后续调整 `src/db/todos.ts` 的字段或排序，需要同步验证 `/demo/drizzle` 和 `/demo/tanstack-query` 两个页面。

## 决策记录

- [x] 不需要新增 ADR，原因：本次是演示数据源接入和文档同步，没有形成新的长期架构取舍。
