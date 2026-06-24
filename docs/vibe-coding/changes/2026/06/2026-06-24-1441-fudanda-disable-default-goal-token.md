# 暂停默认使用 Codex goal 统计 token

- 日期：2026-06-24
- 作者：fudanda
- AI 协助：Codex
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）
- Review：未评审（规则文档小改，未调用 code-reviewer）
- PR：
- Commit：
- 影响模块：Vibe Coding 本地规则、变更记录模板、PR 模板
- 类型：docs

## 为什么改

团队暂时不需要使用 Codex goal 记录 token。继续默认创建 goal 会让普通开发任务进入额外的任务统计流程，和当前团队执行偏好不一致。

## 改了什么

- 将 `vibe-coding-test` 项目本地规则改为默认不创建 Codex goal。
- 明确只有用户要求“记录 token”“创建 goal”或“设置 token_budget”时，才使用 Codex goal。
- 更新 `CHANGELOG.md`、`changes/README.md`、change fragment 模板和 PR 模板中的 token 规则。
- 将未统计时的默认写法统一为 `未记录（当前规则不使用 Codex goal 统计）`。

## 模块文档同步

- [x] 不需要，原因：本次只修改团队协作规则，不改变业务模块当前事实。
- [ ] 已更新：

## 验证方式

- 使用 `rg` 检查 `AGENTS.md`、`docs/vibe-coding/CHANGELOG.md`、`docs/vibe-coding/changes/README.md`、`docs/vibe-coding/templates/change-record.md` 和 `.github/pull_request_template.md` 中的 goal 规则已改为显式要求时才使用。

## 风险和后续事项

- 暂停默认 goal 后，普通任务无法回溯精确 token 消耗；如后续需要成本统计，应在具体任务开始时明确要求创建 goal。

## 决策记录

- [x] 不需要新增 ADR，原因：这是阶段性协作规则调整，不是长期技术架构决策。
- [ ] 已新增：
