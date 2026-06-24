# vibe-coding-test AI 协作规则

本项目使用 Vibe Coding 作为团队 AI 协作开发规范。通用规范来自外层 `vibe-coding` 规则仓库和 Codex 插件；本项目自己的代码事实、变更记录、Review 快照和验证证据必须保存在本仓库内。

## 仓库职责

- `D:\vibe-coding`：维护通用 Vibe Coding 规范、Codex 插件、skills、hooks 和模板。
- `D:\vibe-coding\vibe-coding-test`：维护本项目代码、项目模块文档、change fragment、ADR、Review 快照和 PR 模板。

修改业务项目时，以本仓库内的规则和文档为准：

- `docs/vibe-coding/modules/`
- `docs/vibe-coding/changes/`
- `docs/vibe-coding/decisions/`
- `docs/vibe-coding/reviews/`
- `.github/pull_request_template.md`

## 标准流程

每次有意义的项目变更默认遵循：

```text
需求澄清
-> 影响范围分析
-> 实现计划
-> 小步修改
-> 验证
-> Review
-> 文档和变更记录同步
```

小改动可以压缩流程，但不能跳过理解现有实现、验证结果和必要的文档同步。

## 文档同步

- 如果修改影响模块职责、路由、API、状态、数据库、配置、运行方式或测试方式，必须同步更新 `docs/vibe-coding/modules/*.md`。
- 每个有意义任务新增一份 change fragment：`docs/vibe-coding/changes/YYYY/MM/YYYY-MM-DD-HHMM-<author>-<topic>.md`。
- 重要技术取舍新增 ADR：`docs/vibe-coding/decisions/ADR-000X-<topic>.md`。
- 大 diff 或耗时 AI Review 使用固定 diff 快照：`docs/vibe-coding/reviews/YYYY/MM/YYYY-MM-DD-HHMM-<topic>.diff`。

## 作者、Token 和 Review

- `作者` 必须是本次变更负责人，不得默认填写 Codex、Claude、Cursor 等 AI 工具。
- AI 工具参与情况写入 `AI 协助` 或 PR 的“人工智能参与说明”。
- 有意义任务如果创建了 Codex goal，任务结束前应记录 `goal.tokensUsed`、`goal.timeUsedSeconds` 和 `goal.status`；无法获取时写 `未记录（原因）`，不得估算。
- Review 字段必须写清来源：`未评审`、`AI：Codex/code-reviewer`、`人工：<reviewer>` 或 `人工+AI：<reviewer>，Codex/code-reviewer`。
- 独立 Review 线程必须记录 diff 快照路径、线程 ID 和是否过期。
- 高风险变更必须有人类 Review，不能只依赖 AI Review。

## 验证要求

完成前必须提供新的验证证据。可接受的证据包括：

- `bun run build`
- 与改动范围匹配的 `bunx biome check ...`
- 页面访问结果、截图或浏览器验证
- 测试输出、接口响应或日志

如果 `bun run check` 因既有全仓问题失败，必须说明失败原因，并提供本次改动范围内的替代验证证据。

## 提交边界

- 不使用 `git add .`。
- 按明确文件路径暂存本次变更。
- 不提交 `.env.local`、`dev.db`、`dist/`、`node_modules/`、`output/` 等本地或生成产物。
- 提交信息应说明为什么改，并记录验证和未验证内容。
