# 同步档位 2 提交和 PR 准备规则

- 日期：2026-06-24
- 作者：fudanda
- AI 协助：Codex
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）
- Review：未评审
- PR：
- Commit：
- 影响模块：AGENTS.md、.github/pull_request_template.md、docs/vibe-coding
- 类型：docs

## 为什么改

`vibe-coding-test` 是 Vibe Coding 的测试项目，需要同步档位 2 提交和 PR 准备流程，用来演练功能完成后的半自动提交材料准备。

## 改了什么

- 在项目本地规则中加入档位 2：自动准备 diff 摘要、change fragment、验证、Review 材料、Lore commit message 和 PR 描述草案。
- 明确确认前不执行 `git add`、`git commit`、`git push` 或 `gh pr create`。
- 更新 PR 模板，记录提交和 PR 自动化档位，并检查没有使用 `git add .`。

## 模块文档同步

- [x] 不需要，原因：本次只更新协作规则，不改变业务模块当前实现。
- [ ] 已更新：

## 验证方式

- 计划执行内容检索，确认 `AGENTS.md` 和 PR 模板包含档位 2、确认前停止和禁止 `git add .` 规则。

## 风险和后续事项

- 档位 2 不会自动创建 PR；如需创建 PR，需要人工确认后进入提交执行。

## 决策记录

- [x] 不需要新增 ADR，原因：规则同步，不涉及项目技术架构取舍。
- [ ] 已新增：
