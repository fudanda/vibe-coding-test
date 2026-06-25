# 明确提交准备流程支持自动 Git 提交

- 日期：2026-06-25
- 作者：fudanda
- Review：
- PR：
- Commit：
- 影响模块：AGENTS.md, docs/vibe-coding/changes/*
- 类型：docs
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）
- AI 协助：Codex 参与本地规则同步和验证整理

## 为什么改

本项目作为 Vibe Coding 测试模板，需要让开发者明确知道提交与 PR 准备流程可以在授权后自动完成本地 `git commit`，而不是只准备材料。

## 改了什么

- 更新本项目 `AGENTS.md`，加入“自动 Git 提交”触发语。
- 明确自动提交必须按明确文件路径暂存，并禁止 `git add .`、`git add -A` 和通配暂存。
- 新增本次规则同步记录。

## 模块文档同步

- [x] 不需要，原因：本次修改的是项目协作规则，不改变业务模块当前实现。
- [ ] 已更新：

## 验证方式

- 已运行：搜索“自动 Git 提交”，确认本项目规则和记录已覆盖。
- 已运行：误导性“不要使用 git add .”独立提示搜索，确认本项目提交准备规则不再把它写成主动作。
- 已运行：外层 `.codex-plugin/plugin.json` 与 SessionStart hook 检查通过，确认插件规则同步有效。

## 风险和后续事项

- 本项目是独立 Git 仓库；自动提交时必须在 `vibe-coding-test` 仓库内检查 diff，不能把外层规则文件误认为同一个 Git 提交范围。
