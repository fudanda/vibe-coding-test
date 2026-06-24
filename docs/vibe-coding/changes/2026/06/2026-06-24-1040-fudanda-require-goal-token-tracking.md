# 约束有意义任务必须创建 Codex goal

- 日期：2026-06-24
- 作者：fudanda
- AI 协助：Codex
- Token 消耗：goal.tokensUsed=21861，timeUsedSeconds=130，status=complete
- Review：
- PR：
- Commit：
- 影响模块：AGENTS.md、SessionStart hook、变更记录规则、PR 模板、提交规范
- 类型：docs

## 为什么改

如果任务开始时没有创建 Codex goal，change fragment 只能写 `未记录（本次任务未创建 Codex goal）`，无法回溯真实 token 消耗。团队需要把 goal 创建从“推荐做法”升级为“有意义任务默认约束”，减少后续记录缺口。

## 改了什么

- 在 `AGENTS.md` 中明确：有意义任务开始时应先创建任务级 goal。
- 在 SessionStart hook 入口提示中加入 goal 创建和 `get_goal()` 读取要求。
- 在变更记录说明中明确允许不创建 goal 的例外场景。
- 在 change fragment 模板、提交规范、`CHANGELOG.md` 和 PR 模板中加入 goal 检查要求。

## 模块文档同步

- [x] 不需要，原因：本次修改的是 Vibe Coding 协作规则，不改变 `vibe-coding-test` 应用模块当前事实。
- [ ] 已更新：

## 验证方式

- `rg "create_goal|get_goal|goal.tokensUsed|timeUsedSeconds|任务级 goal|有意义任务" AGENTS.md hooks/session-start-codex docs/vibe-coding/changes/README.md docs/vibe-coding/templates/change-record.md docs/vibe-coding/07-commit-pr.md docs/vibe-coding/CHANGELOG.md .github/pull_request_template.md docs/vibe-coding/changes/2026/06/2026-06-24-1040-fudanda-require-goal-token-tracking.md` 能检索到新约束。
- `cmd /c hooks/run-hook.cmd session-start-codex` 输出包含 goal 统计提示。
- 检查 `docs/vibe-coding/changes/**/*.md`，共 11 个 change fragment，`missingToken=0`。
- 本次 change fragment 使用 `get_goal()` 返回的真实 `goal.tokensUsed`、`goal.timeUsedSeconds` 和 `goal.status`。

## 风险和后续事项

- 如果 Codex 环境没有 goal 工具，仍需要写 `未记录（原因）`。
- 如果任务过于微小且不需要 change fragment，可以不创建 goal，但不能在需要记录的任务中省略原因。

## 决策记录

- [x] 不需要新增 ADR，原因：这是日志执行约束增强，不涉及架构取舍。
- [ ] 已新增：
