# 明确变更记录作者识别规则

- 日期：2026-06-23
- 作者：fudanda
- AI 协助：Codex
- Token 消耗：未记录（历史记录补录，原任务未统计）
- Review：
- PR：
- Commit：
- 影响模块：`docs/vibe-coding/changes/README.md`、`docs/vibe-coding/templates/change-record.md`、`docs/vibe-coding/07-commit-pr.md`、`.github/pull_request_template.md`
- 类型：docs

## 为什么改

多人协作时，change fragment 的作者字段需要指向本次变更负责人，而不是协助生成内容的 AI 工具。否则后续按人追踪、Review 责任和团队复盘都会混淆。

## 改了什么

- 新增作者识别优先级：明确指定、`VIBE_AUTHOR`、`git config user.name`、`git config user.email`、询问开发者。
- 模板新增 `AI 协助` 字段。
- PR 模板增加作者字段检查。
- 既有变更碎片和 ADR 补充 `AI 协助：Codex`，并把负责人改为当前 git 用户 `fudanda`。

## 模块文档同步

- [x] 不需要，原因：本次变更是团队记录规则，不改变 `vibe-coding-test` 应用模块当前事实。
- [ ] 已更新：`docs/vibe-coding/modules/<module>.md`

## 验证方式

- `rg "作者：Codex|决策人：Codex" docs/vibe-coding docs/vibe-coding .github` 无匹配。
- `rg "AI 协助|VIBE_AUTHOR|git config user.name|git config user.email" docs/vibe-coding docs/vibe-coding .github` 能检索到新规则。
- Markdown 链接检查通过。

## 风险和后续事项

- 如果公司希望使用真实中文姓名而不是 git 用户名，需要每个开发者设置 `VIBE_AUTHOR` 或 `git config user.name`。

## 决策记录

- [x] 不需要新增 ADR，原因：这是对既有日志碎片流程的细化规则。
- [ ] 已新增：`docs/vibe-coding/decisions/ADR-000X-<topic>.md`
