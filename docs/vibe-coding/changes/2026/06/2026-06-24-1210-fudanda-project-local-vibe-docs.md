# 迁移 Vibe Coding 项目文档到独立仓库

- 日期：2026-06-24
- 作者：fudanda
- AI 协助：Codex
- Token 消耗：未记录（本次迁移任务未创建 Codex goal）
- Review：未评审
- PR：未关联
- Commit：未提交
- 影响模块：`AGENTS.md`、`.github/pull_request_template.md`、`docs/vibe-coding/`
- 类型：docs

## 为什么改

`vibe-coding-test` 是独立 Git 仓库。此前项目模块文档、change fragment、ADR 和 Review 快照保存在外层规则仓库的项目文档目录中，导致项目代码 PR 无法直接携带对应文档证据。需要把项目事实文档复制到本仓库内，让代码、文档、变更记录和 Review 快照可以一起提交。

## 改了什么

- 新增项目级 `AGENTS.md`，声明本仓库如何使用 Vibe Coding。
- 将外层项目文档复制到 `docs/vibe-coding/`。
- 将外层 PR 模板复制到 `.github/pull_request_template.md`。
- 将复制后的 Markdown 路径引用改为本仓库内的 `docs/vibe-coding/...`。
- 保留外层原文档，不做删除迁移。

## 模块文档同步

- [x] 不需要，原因：本次是文档归属和仓库边界调整，不改变应用模块当前实现。
- [ ] 已更新：`docs/vibe-coding/modules/<module>.md`

## 验证方式

- 旧外层文档路径关键词检查无匹配，确认项目内 Markdown 已切换到本仓库路径。
- `Test-Path AGENTS.md`：返回 `True`。
- `Test-Path .github/pull_request_template.md`：返回 `True`。
- `Get-ChildItem docs\vibe-coding`：确认 `changes`、`decisions`、`modules`、`reviews`、`templates` 均存在。

## 风险和后续事项

- 外层原项目文档目录暂时仍保留，后续确认项目内文档稳定后，再决定是否删除或改为迁移说明。
- 历史 change fragment 中的验证命令仍可能描述当时外层文档状态；本次只做项目内路径归属修正，不重写历史原因。

## 决策记录

- [x] 不需要新增 ADR，原因：本次是仓库边界落地，不涉及新的技术选型。
- [ ] 已新增：`docs/vibe-coding/decisions/ADR-000X-<topic>.md`
