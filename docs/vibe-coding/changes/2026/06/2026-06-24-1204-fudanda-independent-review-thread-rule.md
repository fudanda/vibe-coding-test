# 加入独立 code-reviewer 快照审查规则

- 日期：2026-06-24
- 作者：fudanda
- AI 协助：Codex
- Token 消耗：未记录（本次规则补充未创建 Codex goal）
- Review：未评审
- PR：未关联
- Commit：未提交
- 影响模块：`AGENTS.md`、`docs/vibe-coding/04-code-review.md`、`docs/vibe-coding/07-commit-pr.md`、`docs/vibe-coding/review-checklist.md`、`skills/vibe-review/SKILL.md`、`docs/vibe-coding/reviews/README.md`、`docs/vibe-coding/changes/README.md`、`docs/vibe-coding/templates/change-record.md`、`.github/pull_request_template.md`、`hooks/session-start-codex`
- 类型：docs

## 为什么改

当前 `code-reviewer` 可以在主线程执行 AI Review，但大 diff 或耗时审查会阻塞开发节奏，而且如果开发者继续修改同一工作区，Review 结果可能和后续代码状态不一致。需要把“固定 diff 快照 + 独立 Review 线程”的做法写入 Vibe Coding 规则。

## 改了什么

- 在入口规范中新增独立 Review 线程规则。
- 在代码评审规范中补充触发条件、标准流程、快照路径和 Review 字段写法。
- 在 `vibe-review` 技能中加入独立线程快照审查流程。
- 新增 `docs/vibe-coding/reviews/README.md`，说明 Review 快照目录用途。
- 更新 change fragment 模板、变更记录入口、PR 模板、提交 PR 规范、评审清单和 SessionStart 提示。

## 模块文档同步

- [x] 不需要，原因：本次是团队协作规则更新，不改变 `vibe-coding-test` 应用模块当前事实。
- [ ] 已更新：`docs/vibe-coding/modules/<module>.md`

## 验证方式

- `rg -n "独立 Review|diff 快照|Review 快照|reviews/|code-reviewer" AGENTS.md docs .github skills hooks -S`：确认规则已写入入口规范、评审文档、技能、模板、PR 模板和钩子。
- `cmd /c hooks\run-hook.cmd session-start-codex`：确认 SessionStart 钩子可以输出包含独立 Review 快照提示的 JSON。
- `Get-ChildItem docs\vibe-coding\reviews -Recurse`：确认 Review 快照目录说明和已有 diff 快照存在。

## 风险和后续事项

- 风险：独立 Review 线程只对快照负责，团队执行时必须检查快照后是否继续修改了被审文件。
- 后续：如果后续接入自动化脚本，可以自动生成快照、创建 Review 线程并回写线程 ID。

## 决策记录

- [x] 不需要新增 ADR，原因：本次是协作流程规则补充，不涉及架构或技术选型取舍。
- [ ] 已新增：`docs/vibe-coding/decisions/ADR-000X-<topic>.md`
