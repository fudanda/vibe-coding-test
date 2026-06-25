# 同步 Codex 最佳实践计划规则

- 日期：2026-06-24
- 作者：fudanda
- AI 协助：Codex
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）
- Review：未评审
- PR：
- Commit：
- 影响模块：AGENTS.md、code_review.md、.github/pull_request_template.md、docs/vibe-coding
- 类型：docs

## 为什么改

`vibe-coding-test` 是 Vibe Coding 的测试项目，需要和外层通用规范保持一致，便于验证复杂任务走原生 `/plan` 或项目级 Human Loop 的效果。

## 改了什么

- 将本地计划优先规则改为“原生 `/plan` 优先，Human Loop 兜底”。
- 明确 `update_plan` 只是普通对话中的可见进度清单，不等于原生 Plan mode。
- 增加复杂任务输入四要素：`Goal`、`Context`、`Constraints`、`Done when`。

## 模块文档同步

- [x] 不需要，原因：本次仅更新项目 AI 协作规则，不改变业务模块当前实现。
- [ ] 已更新：

## 验证方式

- `rg` 内容检查确认本地 `AGENTS.md` 包含 `/plan`、`Shift+Tab`、Human Loop 和四要素说明。
- 检查 `code_review.md` 已作为本地 Review 入口存在。

## 风险和后续事项

- 项目规则不能自动切换 Codex App 顶部“计划”模式，仍需用户手动 `/plan` 或依赖 Human Loop 兜底。

## 决策记录

- [x] 不需要新增 ADR，原因：本次是规则同步，不涉及项目技术架构取舍。
- [ ] 已新增：
