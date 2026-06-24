# 表格示例接入真实数据库和接口

- 日期：2026-06-24
- 作者：fudanda
- AI 协助：Codex
- Token 消耗：goal.tokensUsed=317409，timeUsedSeconds=1331，status=complete
- Review：未评审（本次未启动独立 code-reviewer；数据库和 server function 变更建议合并前补审）
- PR：
- Commit：
- 影响模块：TanStack Table、Drizzle 数据库、模块文档
- 类型：feature

## 为什么改

用户要求表格示例添加真实数据库和接口。原表格示例只使用客户端假数据，无法验证数据库、服务端函数和前端表格之间的真实数据流。

## 改了什么

- 新增 `demo_people` SQLite 表结构，并通过 Drizzle schema 描述字段。
- 新增 `src/db/demo-people.ts`，封装建表、种子数据、查询、新增和重置逻辑。
- `/demo/table` 改为通过 route loader 和 server function 读取真实数据库数据。
- 页面新增记录创建、重新读取接口和重置数据库样例操作。
- 表格示例移除对 `faker` 随机数据生成的运行时依赖，改用稳定 seed 数据。
- 同步更新 TanStack Table、Drizzle、环境工具和模块索引文档。

## 模块文档同步

- [ ] 不需要，原因：
- [x] 已更新：`docs/vibe-coding/modules/demo-table.md`、`docs/vibe-coding/modules/database-drizzle.md`、`docs/vibe-coding/modules/environment-tooling.md`、`docs/vibe-coding/modules/README.md`

## 验证方式

- `npx biome check src\routes\demo\table.tsx src\db\demo-people.ts src\db\schema.ts src\data\demo-table-data.ts` 通过。
- `npm run build` 通过；仍有既有 `src/routes/demo/drizzle.tsx` 的 `inputValidator()` deprecation warning。
- 临时 dev server 请求 `http://127.0.0.1:3006/demo/table` 返回 200，页面包含“真实数据库表格示例”和 `demo_people`/seed 内容，未出现 `Something went wrong`。
- 直接查询 `dev.db`：`demo_people` 共有 12 条种子数据，`min(first_name)` 为 `Ava`。

## 风险和后续事项

- `demo_people` 是演示表，当前采用运行时自动建表；正式业务表应改走 Drizzle migration。
- 本次未启动独立 code-reviewer；合并前建议补一次 AI 或人工 Review。
- `dev.db` 是本地忽略文件，不应提交。

## 决策记录

- [x] 不需要新增 ADR，原因：本次是演示模块接入真实数据流，没有新增长期架构取舍。
- [ ] 已新增：
