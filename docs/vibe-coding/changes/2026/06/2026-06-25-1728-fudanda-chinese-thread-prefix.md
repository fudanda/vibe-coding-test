# 同步中文独立线程标题前缀

- 日期：2026-06-25
- 作者：fudanda
- Review：AI：Codex/code-reviewer（独立提交准备线程 019efe1f-1b80-7a52-9934-4fe488548706；子审查 019efe1f-f6b4-7323-8863-96db69758357，无阻塞问题）
- PR：未创建
- Commit：本地提交已生成，见提交结果
- 独立提交准备对话：019efe1f-1b80-7a52-9934-4fe488548706
- 当前提交准备线程标题：`【AI提交】vibe-coding｜中文化独立线程前缀`
- 内层项目目标标题：`【AI提交】vibe-coding-test｜中文化独立线程标题前缀`
- 影响模块：AGENTS.md；docs/vibe-coding/reviews/README.md
- 类型：docs
- AI 协助：Codex 用于本地规则同步、文档修改和验证。
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）

## 为什么改

`vibe-coding-test` 是 Vibe Coding 的测试项目，需要同步通用规则：独立 Review 和提交准备线程使用中文标题前缀，方便团队成员在 Codex 侧边栏识别线程用途。

## 改了什么

- 独立 Review 线程标题改为 `【AI审查】vibe-coding-test｜<任务短标题>`。
- 独立提交准备线程标题改为 `【AI提交】vibe-coding-test｜<任务短标题>`。
- 明确 `【AI提交】` 只代表提交准备和受控本地 commit 门禁，不代表自动 push、创建 PR、合并或发布。

## 模块文档同步

- [x] 不需要，原因：本次修改的是项目协作规则，不改变业务模块职责、路由、API、状态、数据库或运行方式。

## 验证方式

- 已通过：`rg -n "\[VIBE-REVIEW\]|\[VIBE-SUBMIT\]" AGENTS.md docs/vibe-coding --glob "!**/changes/**"` 无命中，说明本项目现行规则正文已不再使用英文前缀。
- 已通过：`rg -n "【AI审查】|【AI提交】|set_thread_title|目标线程标题" AGENTS.md docs/vibe-coding`
- 已通过：`git diff --check -- AGENTS.md docs\vibe-coding\reviews\README.md docs\vibe-coding\changes\2026\06\2026-06-25-1728-fudanda-chinese-thread-prefix.md`，退出码 0，仅有 CRLF 提示。
- 已执行：Codex App `create_thread` 创建独立提交准备对话 `019efe1f-1b80-7a52-9934-4fe488548706`。
- 已执行：Codex App `set_thread_title` 将线程标题设置为 `【AI提交】vibe-coding｜中文化独立线程前缀`。
- 已通过：Codex/code-reviewer 子审查 `019efe1f-f6b4-7323-8863-96db69758357`，结论为无阻塞问题；已按非阻塞建议澄清当前提交准备线程标题和内层项目目标标题。

## 风险和后续事项

- 历史 change fragment 保留英文前缀作为当时规则事实，不回改。
- 线程标题前缀只用于识别；合并前仍必须检查 Review 结论、验证证据和提交门禁。
