# 将多人变更记录改为日志碎片

- 日期：2026-06-23
- 作者：fudanda
- AI 协助：Codex
- Token 消耗：未记录（历史记录补录，原任务未统计）
- Review：
- PR：
- Commit：
- 影响模块：文档体系、团队协作流程、PR 模板
- 类型：docs

## 为什么改

多人协作时，如果所有成员都向同一个 `CHANGELOG.md` 追加记录，会在日常 PR 中频繁产生合并冲突。改为一个变更一份日志碎片，可以让每个 PR 只新增自己的文件。

## 改了什么

- 新增 `docs/vibe-coding/changes/` 作为碎片化变更记录目录。
- 新增 `docs/vibe-coding/decisions/` 作为 ADR 决策目录。
- 将 `CHANGELOG.md` 调整为变更记录入口，不再要求每次追加。
- 将 `decision-log.md` 调整为决策记录入口，不再要求所有决策追加到同一文件。
- 更新 PR 模板，要求填写新增的 change fragment 或 ADR 路径。

## 模块文档同步

- [ ] 不需要，原因：
- [x] 已更新：`docs/vibe-coding/modules/README.md`

## 验证方式

- 检查碎片目录和模板存在。
- 检查入口文件不再要求每次 PR 追加到同一文件。
- 检查可以通过 `rg "作者：fudanda" docs/vibe-coding/changes` 按作者检索。

## 风险和后续事项

- 发布说明需要后续从 `changes/` 中按需汇总。
