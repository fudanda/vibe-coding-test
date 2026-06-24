# 将日志作者规则写入项目入口规范

- 日期：2026-06-23
- 作者：fudanda
- AI 协助：Codex
- Token 消耗：未记录（历史记录补录，原任务未统计）
- Review：
- PR：
- Commit：
- 影响模块：AGENTS.md、团队协作流程
- 类型：docs

## 为什么改

作者识别规则已经存在于提交规范、PR 模板和变更记录说明中，但项目入口 `AGENTS.md` 还没有直接写入。团队和 Codex 新会话优先读取入口规范，因此需要把规则提升到项目规则层，避免后续日志继续误写为 Codex 作者。

## 改了什么

- 在 `AGENTS.md` 新增“变更记录和作者规则”。
- 明确 change fragment 使用独立文件，避免多人同时修改 `CHANGELOG.md`。
- 明确 `作者` 必须是本次变更负责人，AI 工具只能写入 `AI 协助`。
- 明确作者识别优先级：明确指定、`VIBE_AUTHOR`、`git config user.name`、`git config user.email`。
- 明确模块文档、change fragment 和 ADR 的职责边界。

## 模块文档同步

- [x] 不需要，原因：本次修改的是项目协作入口规则，不改变 `vibe-coding-test` 应用模块当前事实。
- [ ] 已更新：

## 验证方式

- `rg -n "变更记录和作者规则|作者识别优先级|不得默认填写 Codex|AI 协助|change fragment" AGENTS.md docs/vibe-coding/changes/2026/06/2026-06-23-1806-fudanda-agents-author-rule.md` 能检索到入口规则。
- `Test-Path docs/vibe-coding/changes/2026/06/2026-06-23-1806-fudanda-agents-author-rule.md` 返回 `True`。
- `rg -n "^- 作者：Codex|^- 决策人：Codex" AGENTS.md docs .github -S` 无匹配。

## 风险和后续事项

- 如果公司希望展示真实中文姓名而不是 git 用户名，需要每个开发者设置 `VIBE_AUTHOR` 或本机 `git config user.name`。
