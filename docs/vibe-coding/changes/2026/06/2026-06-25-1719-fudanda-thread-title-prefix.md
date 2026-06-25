# 同步独立线程标题前缀规则

- 日期：2026-06-25
- 作者：fudanda
- Review：AI：Codex/code-reviewer（提交准备线程 019efe16-fd7d-7b40-85df-8dc2fd81cd3e；初审发现标题记录歧义，已修正后复核）
- PR：未创建
- Commit：未提交
- 独立提交准备对话：019efe16-fd7d-7b40-85df-8dc2fd81cd3e
- 当前提交准备线程标题：[VIBE-SUBMIT] vibe-coding｜增加独立线程标题前缀
- 内层项目目标标题：[VIBE-SUBMIT] vibe-coding-test｜增加独立线程标题前缀
- 影响模块：AGENTS.md；docs/vibe-coding/reviews/README.md
- 类型：docs
- AI 协助：Codex 用于规则同步、文档修改和验证。
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）

## 为什么改

`vibe-coding-test` 会自动创建独立 Review 和提交准备对话。为了让团队在 Codex 侧边栏中快速区分线程用途，需要同步通用规则里的标题前缀。

## 改了什么

- 独立 Review 线程统一命名为 `[VIBE-REVIEW] vibe-coding-test｜<任务短标题>`。
- 独立提交准备线程统一命名为 `[VIBE-SUBMIT] vibe-coding-test｜<任务短标题>`。
- 明确 `create_thread` 后应调用 `set_thread_title`，失败时写入首条消息和最终结果。

## 模块文档同步

- [x] 不需要，原因：本次修改的是项目协作规则，不改变业务模块职责、路由、API、状态、数据库或运行方式。

## 验证方式

- 已通过：`rg -n "\\[VIBE-REVIEW\\]|\\[VIBE-SUBMIT\\]|set_thread_title|目标线程标题" AGENTS.md README.md docs .codex-plugin vibe-coding-test/AGENTS.md vibe-coding-test/docs/vibe-coding`
- 已通过：`cmd /c .codex-plugin\hooks\run-hook.cmd session-start-codex`，输出包含线程标题前缀规则。
- 已通过：`python scripts\vibe-doctor.py --json`，结果 `ok: true`。
- 已执行：Codex App `create_thread` 创建独立提交准备对话 `019efe16-fd7d-7b40-85df-8dc2fd81cd3e`。
- 已执行：Codex App `set_thread_title` 将当前提交准备线程标题设置为 `[VIBE-SUBMIT] vibe-coding｜增加独立线程标题前缀`。

## 风险和后续事项

- 线程标题前缀只用于识别；合并前仍必须检查 Review 结论、验证证据和提交门禁。
