# 将旧等级式名称改为提交与 PR 准备流程

- 日期：2026-06-25
- 作者：fudanda
- Review：未评审（提交准备检查，文档术语小改，未调用 code-reviewer）
- PR：
- Commit：
- 影响模块：AGENTS.md, .github/pull_request_template.md, docs/vibe-coding/changes/*
- 类型：docs
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）
- AI 协助：Codex 参与术语同步和验证整理

## 为什么改

旧等级式名称不够直观，容易让团队误解为等级或自动提交策略。改成“提交与 PR 准备流程”后，更清楚地表达这是提交前材料准备和确认门禁。

## 改了什么

- 更新本项目 `AGENTS.md` 中的提交与 PR 准备规则命名。
- 更新 PR 模板中的自动化字段和确认检查项。
- 同步更新已有 change fragment 中的旧术语。

## 模块文档同步

- [x] 不需要，原因：本次修改的是项目协作规则术语，不改变业务模块当前实现。
- [ ] 已更新：

## 验证方式

- 已运行：旧术语全文搜索，结果未找到旧用户可见术语。
- 已运行：`rg "提交与 PR 准备流程|独立提交准备对话|提交准备对话" ...`，确认本项目 `AGENTS.md`、PR 模板和 change fragment 已覆盖。
- 已运行：`.codex-plugin/plugin.json` 与 `session-start-codex` JSON 检查通过，确认外层插件规则同步有效。

## 风险和后续事项

- 旧 change fragment 文件名中可能仍含 `level-2`，作为历史路径保留。
- `vibe-pr` 作为插件技能 ID 不在本项目内修改。
