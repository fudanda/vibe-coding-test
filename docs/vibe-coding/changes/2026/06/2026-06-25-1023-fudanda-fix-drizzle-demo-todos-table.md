# 修复数据库示例缺少 todos 表报错

- 日期：2026-06-25
- 作者：fudanda
- Review：未评审
- PR：
- Commit：
- 影响模块：Drizzle 数据库、数据库示例页面、模块文档
- 类型：fix
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）
- AI 协助：Codex 参与问题复现、根因分析、修复实现和验证整理

## 为什么改

访问 `/demo/drizzle` 时页面报错 `no such table: todos`。本地 `dev.db` 已有表格示例的 `demo_people` 表，但没有 Drizzle Todo 示例需要的 `todos` 表，导致 route loader 查询失败并返回 500。

## 改了什么

- 新增 `src/db/todos.ts`，封装 Todo 演示表的自动建表、种子数据、查询和新增逻辑。
- 更新 `/demo/drizzle` 页面，改为通过 `listTodos()` 和 `createTodoItem()` 访问数据库。
- 将数据库示例页面文案改为当前真实的 SQLite + Drizzle 说明。
- 更新 Drizzle 数据库模块文档，说明 `todos` 和 `demo_people` 都会为演示目的运行时自动建表和种子。

## 模块文档同步

- [ ] 不需要，原因：
- [x] 已更新：`docs/vibe-coding/modules/database-drizzle.md`

## 验证方式

- 已运行：访问 `http://127.0.0.1:3002/demo/drizzle` 返回 200。
- 已运行：页面内容包含 `Drizzle 数据库示例`、`SQLite + Drizzle ORM` 和种子 Todo，且不包含 `no such table` 或 `Something went wrong`。
- 已运行：查询 `dev.db`，确认已创建 `todos` 表并写入 3 条种子数据。
- 已运行：`npx biome check src\routes\demo\drizzle.tsx src\db\todos.ts src\db\schema.ts`，通过。
- 已运行：`npm run build`，通过；仍有 `createServerFn().inputValidator()` 废弃提示，非本次缺表修复引入。

## 风险和后续事项

- `todos` 是演示表，运行时自动建表只用于降低本地 demo 验证成本；正式业务表仍应走 Drizzle migration。
- 当前 `createTodo` 仍使用 TanStack Start 旧的 `inputValidator()` 写法，构建会出现既有废弃提示，后续可单独迁移到新 API。
