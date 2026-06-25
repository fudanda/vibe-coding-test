# 增加受控自动提交规则

- 日期：2026-06-25
- 作者：fudanda
- Review：
- PR：
- Commit：
- 影响模块：AGENTS.md, .github/pull_request_template.md, docs/vibe-coding/changes/*
- 类型：docs
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）
- AI 协助：Codex 参与本地规则同步和验证整理

## 为什么改

`vibe-coding-test` 作为测试模板，需要支持团队验证“明确授权后自动完成本地 commit”的流程，同时继续防止误提交无关改动。

## 改了什么

- 更新本项目 `AGENTS.md`，允许用户明确要求自动提交且门禁通过时执行本地 `git commit`。
- 更新 PR 模板，增加 Git 提交方式字段，并区分受控自动提交、人工提交、push 和 PR 创建。
- 新增本次规则同步记录。

## 模块文档同步

- [x] 不需要，原因：本次修改的是项目协作规则，不改变业务模块当前实现。
- [ ] 已更新：

## 验证方式

- 已运行：自动提交规则搜索，确认本项目 `AGENTS.md`、PR 模板和记录已覆盖。
- 已运行：旧冲突规则搜索，结果未找到过期门禁表达。
- 已运行：外层 `.codex-plugin/plugin.json` 与 SessionStart hook 检查通过，确认插件规则同步有效。

## 风险和后续事项

- 本项目有独立 Git 仓库；自动提交时必须在 `vibe-coding-test` 仓库内检查 diff，不能把外层规则文件误认为同一个 Git 提交范围。
