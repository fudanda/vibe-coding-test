# 加入 code-reviewer AI Review 规则

- 日期：2026-06-24
- 作者：fudanda
- AI 协助：Codex
- Token 消耗：未记录（本次任务未创建 Codex goal）
- Review：未评审
- PR：未关联
- Commit：未提交
- 影响模块：`AGENTS.md`，`docs/vibe-coding/`，`skills/vibe-review/`，`docs/vibe-coding/changes/`，`.github/pull_request_template.md`，`hooks/session-start-codex`
- 类型：docs

## 为什么改

团队希望把 Codex 原生子智能体 `code-reviewer` 纳入 Vibe Coding 规则，让 AI Review 可以作为合并前预审和风险发现工具，同时避免高风险变更只依赖 AI 评审。

## 改了什么

- 在入口规范中新增 AI Review 自动化规则，明确 `code-reviewer` 的使用场景、边界和 Review 字段写法。
- 在代码评审规范、评审清单、PR 规范和 PR 模板中加入 AI Review 检查项。
- 在 `vibe-review` 技能中写入 `code-reviewer` 调用与结果整合规则。
- 在 change fragment 模板和变更记录入口中明确 Review 字段枚举值。
- 在 SessionStart 钩子提示中加入 Review 规则提醒。

## 模块文档同步

- [x] 不需要，原因：本次只调整团队协作规则和模板，不改变 `vibe-coding-test` 应用模块当前事实。
- [ ] 已更新：`docs/vibe-coding/modules/<module>.md`

## 验证方式

- `rg -n "code-reviewer|Review：|人工\+AI|AI：Codex" AGENTS.md docs .github skills hooks -S`：确认规则已写入入口规范、评审文档、技能、模板和钩子。
- `rg -n "Token 消耗：|Review：|作者：|AI 协助：" docs\vibe-coding\changes\2026\06\2026-06-24-1058-fudanda-code-reviewer-rule.md`：确认作者、AI 协助、Token 消耗和 Review 字段存在。
- `cmd /c hooks\run-hook.cmd session-start-codex`：确认 SessionStart 钩子可以输出包含 `code-reviewer` Review 提示的 JSON。

## 风险和后续事项

- 风险：AI Review 只能作为预审工具，后续团队执行时仍需要人工判断高风险变更。
- 后续：如果团队接入 CI 或 PR 自动化，可把 `code-reviewer` 触发结果写入 PR 评论或固定 Review 摘要。

## 决策记录

- [x] 不需要新增 ADR，原因：本次是流程规则补充，不涉及架构或技术选型取舍。
- [ ] 已新增：`docs/vibe-coding/decisions/ADR-000X-<topic>.md`
