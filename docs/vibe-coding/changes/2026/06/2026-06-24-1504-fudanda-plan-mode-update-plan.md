# 将计划优先模式绑定 update_plan

- 日期：2026-06-24
- 作者：fudanda
- AI 协助：Codex
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）
- Review：未评审（规则文档小改，未调用 code-reviewer）
- PR：
- Commit：
- 影响模块：vibe-coding-test 本地 AI 协作规则
- 类型：docs

## 为什么改

`vibe-coding-test` 作为测试模板，需要明确展示计划优先模式如何触发和执行。计划优先模式应使用 Codex `update_plan` 创建计划清单，而不是使用 `create_goal`。

## 改了什么

- 在 `AGENTS.md` 中新增“模式和计划清单”段落。
- 明确普通执行模式和计划优先模式的区别。
- 明确计划优先模式使用 `update_plan` 创建和维护计划清单。
- 明确计划确认前不修改代码。

## 模块文档同步

- [x] 不需要，原因：本次只修改本地协作规则，不改变业务模块当前事实。
- [ ] 已更新：

## 验证方式

- 使用 `rg` 检查 `AGENTS.md` 中可以检索到 `update_plan`、计划优先模式和 `create_goal` 的区分规则。

## 风险和后续事项

- `update_plan` 只是计划清单工具，不会自动阻止代码修改；后续执行仍需要遵守“计划确认前不改代码”。

## 决策记录

- [x] 不需要新增 ADR，原因：这是执行规范澄清，不是长期技术架构决策。
- [ ] 已新增：
