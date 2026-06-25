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

## 模式和计划清单

- 普通执行模式：目标明确、范围小、风险低时，可以直接读代码、修改和验证。
- 计划优先模式：需求不清、跨模块、涉及接口/数据库/运行方式、需要架构取舍或用户明确说“先计划”“不要改代码”时，先计划。
- 复杂任务首选 Codex 原生 Plan mode：在 Codex App 或 CLI 中用 `/plan`、顶部“计划”按钮或 `Shift+Tab` 开始。
- 本项目规则不能自动切换 Codex App 顶部的“计划”模式。
- `update_plan` 只是普通对话中的可见进度清单，不等于原生 Plan mode，也不是必选入口。
- 未使用原生 Plan mode 时，可以用 `update_plan` 维护需求和影响范围分析、实现方案设计、验证和风险评估等步骤。
- 未使用原生 Plan mode 时，计划优先模式必须输出待确认方案，末尾包含：

```text
状态：等待确认
确认后才会修改代码
```

- 输出待确认方案后必须停止，不得继续修改代码。
- 只有用户明确回复“确认”“批准”“执行”“按方案做”“开始实现”“implement”或“go”时，才进入小步修改和验证。
- 如果用户回复“继续想想”“调整方案”“只分析”“不要改代码”“这个方案不对”等，继续停留在计划优先模式，只调整方案。
- 复杂任务推荐输入四要素：`Goal`、`Context`、`Constraints`、`Done when`；中文可写“目标、上下文、约束、完成标准”。

## 文档同步

- 如果修改影响模块职责、路由、API、状态、数据库、配置、运行方式或测试方式，必须同步更新 `docs/vibe-coding/modules/*.md`。
- 每个有意义任务新增一份 change fragment：`docs/vibe-coding/changes/YYYY/MM/YYYY-MM-DD-HHMM-<author>-<topic>.md`。
- 重要技术取舍新增 ADR：`docs/vibe-coding/decisions/ADR-000X-<topic>.md`。
- 大 diff 或耗时 AI Review 使用固定 diff 快照：`docs/vibe-coding/reviews/YYYY/MM/YYYY-MM-DD-HHMM-<topic>.diff`。

## 作者、Token 和 Review

- `作者` 必须是本次变更负责人，不得默认填写 Codex、Claude、Cursor 等 AI 工具。
- AI 工具参与情况写入 `AI 协助` 或 PR 的“人工智能参与说明”。
- 默认不创建 Codex goal，也不强制统计 token 消耗。
- 只有用户明确要求“记录 token”“创建 goal”或“设置 token_budget”时，才创建或读取 Codex goal。
- 未明确要求统计 token 时，`Token 消耗` 填写 `未记录（当前规则不使用 Codex goal 统计）`；如果本次任务明确创建了 Codex goal，任务结束前应记录 `goal.tokensUsed`、`goal.timeUsedSeconds` 和 `goal.status`。
- 无法获取精确 token 统计时写 `未记录（原因）`，不得估算。
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

## 提交与 PR 准备流程

- 本项目默认采用“提交与 PR 准备流程”：Codex 必须自动检查 diff、补 change fragment、运行验证、调用 `code-reviewer` 做 AI Review、生成中文 Lore 提交信息和 PR 描述草案。
- 每次有意义的功能修改完成后，必须优先新建独立 Codex 对话执行提交与 PR 准备流程。
- 当前开发对话只负责实现、验证、文档同步、change fragment 和交付交接包，不直接执行 `git add`、`git commit`、`git push` 或 `gh pr create`。
- 只有用户明确说“在当前对话直接提交”“当前对话执行 commit”“不要新建对话，直接提交”时，当前开发对话才允许在门禁通过后执行 Review 和本地 commit。
- 交付交接包必须包含：任务标题、仓库路径、关键文件或 diff 快照、change fragment、验证证据、风险和未验证项。
- 独立提交准备对话中，Codex 在自动提交门禁通过后执行本地 `git commit`，并在最终结果中给出 commit hash。
- 自动提交前必须检查 `git status` 和 `git diff`，排除无关改动，补齐 change fragment，记录验证证据，生成中文 Lore 提交信息，确认 `code-reviewer` 无阻塞问题，并按明确文件路径暂存。
- 自动 Git 提交必须按明确文件路径暂存；禁止仓库级暂存命令，例如 `git add .`、`git add -A` 或通配暂存。
- 自动 Git 操作只默认覆盖本地 status/diff/add/commit；不包含 `git push`、`gh pr create`、合并或发布，这些动作仍需单独确认。
- 如果 `code-reviewer` 超时、不可用或发现阻塞问题，必须停止自动提交，记录原因并等待人工处理或重新 Review。
- 没有验证证据时不能声称“可合并”或“已完成”。
- 高风险变更必须保留人工 Review，不能只依赖 AI Review。
