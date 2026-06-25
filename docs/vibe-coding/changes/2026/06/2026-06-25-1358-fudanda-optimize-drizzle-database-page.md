# 优化 Drizzle 数据库示例页面

- 日期：2026-06-25
- 作者：fudanda
- Review：AI：Codex/code-reviewer（首轮 `019efd69-cb42-7473-8cfe-76bedd33f61c` 发现排序阻塞项；已修复并由复审线程 `019efd70-e416-7c32-a247-c6565423302b` APPROVE，无阻塞问题）
- PR：未创建
- Commit：见本文件所在提交
- 独立提交准备对话：`019efd68-bab3-7960-babb-95cc2a4a78ae`
- 影响模块：`src/routes/demo/drizzle.tsx`、`src/routes/demo/tanstack-query.tsx`、`src/routes/demo/table.tsx`、`src/db/todos.ts`、`src/styles.css`、`docs/vibe-coding/modules/database-drizzle.md`、`docs/vibe-coding/modules/styling-theme.md`
- 类型：feature
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）

## 为什么改

数据库示例页面原本偏基础表单和列表，无法直观体现真实 SQLite、server function 和 Drizzle ORM 的读写链路，也缺少可恢复的演示数据入口。需要把页面优化成更适合团队展示和验证的数据库工作台。

## 改了什么

- 将 `/demo/drizzle` 改为数据库示例工作台，增加数据链路、统计卡片、写入面板、schema 面板和真实记录列表。
- 为 Todo 演示数据增加 `resetTodoItems()`，支持事务化清空并恢复固定样例数据。
- Todo 列表按 `createdAt desc` 和 `id desc` 稳定排序，避免同秒写入时最新记录置顶不稳定。
- 将 `createTodo` 输入处理更新为 `.validator()`，避免继续使用 deprecated `inputValidator`。
- 将数据库访问改为 server function handler 内动态 import，避免 route 顶层 import 把 `better-sqlite3` 带进浏览器客户端。
- 新增 `db-*` 页面专用样式，提供动态网格、扫描线、面板、按钮、记录行和深色主题适配。
- 同步数据库模块文档和样式模块文档。

## 模块文档同步

- [ ] 不需要，原因：
- [x] 已更新：`docs/vibe-coding/modules/database-drizzle.md`
- [x] 已更新：`docs/vibe-coding/modules/styling-theme.md`

## 验证方式

- 已通过：`npx biome check src\routes\demo\drizzle.tsx src\routes\demo\tanstack-query.tsx src\routes\demo\table.tsx src\db\todos.ts`
- 已通过：`git diff --check`（仅 Windows LF/CRLF 提示，无空白错误）
- 已通过：`npm run build`
- 已通过：Playwright 访问 `http://localhost:3002/demo/drizzle`，页面渲染“数据库示例工作台”，console error 为 0。
- 已通过：Playwright 新增 `Playwright 数据库验证` 后记录数从 5 增至 6。
- 已通过：Playwright 点击“重置样例”后恢复 3 条种子记录，ID 为 `#1`、`#2`、`#3`。
- 已通过：Playwright 移动端视口 `390x844` 检查，`scrollWidth=390`、`clientWidth=390`，无横向溢出。

## 风险和后续事项

- `resetTodoItems()` 会删除演示表当前数据，只能用于 demo，不能直接迁移到正式业务流程。
- AI Review 已完成；本地提交准备流程仍禁止 `git add .`、push、创建 PR 或发布操作。
