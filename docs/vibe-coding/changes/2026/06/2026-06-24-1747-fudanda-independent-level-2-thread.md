# 将提交与 PR 准备流程默认拆到独立对话

- 日期：2026-06-24
- 作者：fudanda
- Review：
- PR：
- Commit：
- 影响模块：AGENTS.md
- 类型：docs
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）
- AI 协助：Codex 参与规则同步和验证整理

## 为什么改

团队希望每次功能修改完成后，提交和 PR 准备不继续占用开发对话，而是在新的独立 Codex 对话中按提交与 PR 准备流程执行，降低开发、Review 和 git 操作上下文混用的风险。

## 改了什么

- 在本项目 `AGENTS.md` 的“提交和 PR 准备自动化”中加入独立提交准备对话规则。
- 明确当前开发对话只输出交付交接包。
- 明确交接包应包含任务标题、仓库路径、关键文件或 diff 快照、change fragment、验证证据、风险和未验证项。

## 模块文档同步

- [x] 不需要，原因：本次修改的是项目协作规则，不改变业务模块当前实现。
- [ ] 已更新：

## 验证方式

- 已运行：`rg "独立 Codex 对话|独立提交准备|交付交接包|交接包|提交与 PR 准备" ...`，确认 `vibe-coding-test/AGENTS.md` 已包含独立提交准备对话规则。
- 已运行：`git -C vibe-coding-test status --short -- AGENTS.md docs/vibe-coding/changes/2026/06/2026-06-24-1747-fudanda-independent-level-2-thread.md`，确认本地规则和变更记录已进入当前 diff。

## 风险和后续事项

- Codex App 规则不能强制自动创建新对话；如果无法自动创建，开发对话应输出交接包，由开发者粘贴到新对话。
- 本地 commit 可按受控自动提交门禁执行；`push` 和 PR 创建仍必须单独确认。
