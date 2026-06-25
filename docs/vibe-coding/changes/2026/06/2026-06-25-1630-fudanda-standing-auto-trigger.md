# 同步独立提交准备的长期自动触发规则

- 日期：2026-06-25
- 作者：fudanda
- Review：AI：Codex/code-reviewer（独立审查线程 `019efdea-9b1f-7851-a2b4-73c0223901a2`、`019efdeb-29ad-7f43-b6d2-5e640297ed38`，无阻塞问题）
- PR：未创建
- Commit：未提交
- 独立提交准备对话：019efde9-6974-74b1-b29c-cf8a46217af2
- 影响模块：AGENTS.md；docs/vibe-coding/reviews/README.md
- 类型：docs
- AI 协助：Codex 用于规则同步、文档修改和验证建议。
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）

## 为什么改

`vibe-coding-test` 是 Vibe Coding 的测试项目，需要和外层规则保持一致：有意义功能完成后应自动触发独立 Review 和提交准备。如果工具策略阻止自动新建对话，当前开发对话必须显式输出可粘贴交接 prompt，不能只留下“未评审”。

## 改了什么

- 在本项目 `AGENTS.md` 中新增长期授权自动触发规则。
- 明确 `create_thread`、子智能体或线程工具被阻止时的兜底输出。
- 在 Review 快照说明中增加“自动触发受阻”字段写法。

## 模块文档同步

- [x] 不需要，原因：本次修改的是项目协作规则，不改变业务模块职责、路由、API、状态、数据库或运行方式。

## 验证方式

- 已通过：在外层 `D:\vibe-coding` 执行 `rg -n "长期授权|自动触发受阻|交接 prompt|create_thread" AGENTS.md README.md docs .codex-plugin vibe-coding-test/AGENTS.md vibe-coding-test/docs/vibe-coding`
- 已通过：在内层 `D:\vibe-coding\vibe-coding-test` 复核 `AGENTS.md`、`docs/vibe-coding/reviews/README.md` 和本 change fragment 的限定 diff。
- 已执行：Codex App `create_thread` 创建独立提交准备对话 `019efde9-6974-74b1-b29c-cf8a46217af2`。

## 风险和后续事项

- 当前项目仍需在真实功能完成后验证 Codex App 是否能自动创建独立提交准备对话；如果工具策略阻止，应按规则输出交接 prompt。
