# 同步默认 Code Reviewer 和本地自动提交规则

- 日期：2026-06-25
- 作者：fudanda
- AI 协助：Codex
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）
- Review：跳过（规则文档变更，无业务代码行为变化；已用静态检索和 hook 验证替代）
- PR：
- Commit：
- 影响模块：`AGENTS.md`、`.github/pull_request_template.md`
- 类型：docs

## 为什么改

`vibe-coding-test` 是 Vibe Coding 的测试项目，需要同步外层团队规范：有意义的功能修改完成后，默认自动执行 Code Reviewer AI 预审，并在门禁通过后自动完成本地 Git 提交。

## 改了什么

- 更新本项目 `AGENTS.md`，将提交与 PR 准备流程改为默认自动 Review 和本地 commit。
- 明确自动 Git 操作只默认覆盖本地 `status/diff/add/commit`，不包含 `push`、创建 PR、合并或发布。
- 明确 `code-reviewer` 超时、不可用或发现阻塞问题时必须停止自动提交。
- 更新本项目 PR 模板，要求记录 Code Reviewer 状态、本地 commit 和阻塞原因。

## 模块文档同步

- [x] 不需要更新模块文档，原因：本次只修改项目协作规则和 PR 模板，不改变业务模块当前实现。

## 验证方式

- `rg` 检索确认本项目 `AGENTS.md` 和 `.github/pull_request_template.md` 已包含默认 Code Reviewer、本地 commit、禁止 `git add .`、不自动 push/PR 的规则。
- 已在外层规范执行插件 JSON、hook 输出和 skill 元数据验证。
- `git diff --check -- AGENTS.md .github/pull_request_template.md` 通过。

## 风险和后续事项

- 本项目当前工作区已有未提交业务改动；后续自动提交必须先区分规则变更和业务变更，不能混合无关文件。
- 后续需要用一个真实功能改动演练完整链路：实现、验证、Code Reviewer、文件级暂存、本地 commit。

## 决策记录

- [x] 不需要新增 ADR，原因：本次是测试项目规则同步，没有新增业务架构决策。
