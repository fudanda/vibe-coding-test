# 将 Token 消耗规则改为 Codex goal 统计

- 日期：2026-06-24
- 作者：fudanda
- AI 协助：Codex
- Token 消耗：未记录（本次任务未创建 Codex goal）
- Review：
- PR：
- Commit：
- 影响模块：变更记录模板、变更记录规则、PR 模板、项目入口规范
- 类型：docs

## 为什么改

Codex 可以通过 `create_goal` 和 `get_goal` 在任务粒度读取 `goal.tokensUsed`、`goal.timeUsedSeconds` 和 `goal.status`。这比手动估算或只写“未记录”更适合团队统计每个 change fragment 的 AI 协作成本。

## 改了什么

- 将 `Token 消耗` 推荐格式改为 `goal.tokensUsed=<n>，timeUsedSeconds=<n>，status=<status>`。
- 在变更记录规则中新增任务开始创建 goal、任务结束读取 `get_goal()` 的流程。
- 明确 `goal.tokensUsed` 是当前 goal 生命周期内消耗，不是天然全会话总消耗。
- 更新 `AGENTS.md`、PR 模板、提交规范和 change fragment 模板。

## 模块文档同步

- [x] 不需要，原因：本次修改的是协作日志规则，不改变 `vibe-coding-test` 应用模块当前事实。
- [ ] 已更新：

## 验证方式

- `rg "goal.tokensUsed|timeUsedSeconds|get_goal|create_goal|Token 消耗" AGENTS.md .github/pull_request_template.md docs/vibe-coding/07-commit-pr.md docs/vibe-coding/CHANGELOG.md docs/vibe-coding/changes/README.md docs/vibe-coding/templates/change-record.md docs/vibe-coding/changes/2026/06/2026-06-24-1030-fudanda-goal-token-usage-rule.md` 能检索到新规则。
- 检查 `docs/vibe-coding/changes/**/*.md`，共 9 个 change fragment，`missingToken=0`。
- 本次 change fragment 的 `Token 消耗` 已写明：`未记录（本次任务未创建 Codex goal）`。

## 风险和后续事项

- 如果任务开始时忘记创建 goal，仍然无法回溯精确 token，只能写 `未记录（原因）`。
- 如果团队要统计整条会话，需要在新会话一开始创建会话级 goal，或自行汇总多个任务 goal。

## 决策记录

- [x] 不需要新增 ADR，原因：这是日志统计口径调整，不涉及架构取舍。
- [ ] 已新增：
