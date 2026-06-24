# 在变更日志中增加 Token 消耗字段

- 日期：2026-06-24
- 作者：fudanda
- AI 协助：Codex
- Token 消耗：未记录（Codex 当前会话未提供精确 token 统计）
- Review：
- PR：
- Commit：
- 影响模块：变更记录模板、变更记录规则、PR 模板、项目入口规范
- 类型：docs

## 为什么改

团队希望在改动日志中记录 AI 协作的 token 消耗，便于后续评估成本、比较任务复杂度，并复盘哪些类型的任务更适合交给 Codex。

## 改了什么

- 在 change fragment 模板中新增 `Token 消耗` 字段。
- 在变更记录说明中新增 Token 消耗填写规则。
- 在 `CHANGELOG.md`、提交规范、PR 模板和 `AGENTS.md` 中加入 token 记录检查项。
- 为已有 change fragments 补充 `Token 消耗` 字段，历史记录统一标记为未记录。

## 模块文档同步

- [x] 不需要，原因：本次修改的是协作日志规则，不改变 `vibe-coding-test` 应用模块当前事实。
- [ ] 已更新：

## 验证方式

- `rg "Token 消耗|token 统计|AI 协作成本|无法获取精确" AGENTS.md .github/pull_request_template.md docs/vibe-coding/07-commit-pr.md docs/vibe-coding/CHANGELOG.md docs/vibe-coding/changes/README.md docs/vibe-coding/templates/change-record.md docs/vibe-coding/changes` 能检索到新增规则。
- 检查 `docs/vibe-coding/changes/**/*.md`，共 8 个 change fragment，`missingToken=0`。
- `rg --pcre2 "Token 消耗：(?!未记录|输入|总计|Codex：|Claude：|Cursor：)" docs/vibe-coding/changes -S` 无匹配。

## 风险和后续事项

- 当前推荐使用 Codex goal 粒度统计 token；历史记录未创建 goal 时只能写 `未记录（原因）`。
- 如果团队后续接入 API usage 或自动化统计，可以把该字段从手动填写升级为脚本生成。

## 决策记录

- [x] 不需要新增 ADR，原因：这是日志字段增强，不涉及架构取舍。
- [ ] 已新增：
