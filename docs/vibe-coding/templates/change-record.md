# 变更日志碎片模板

复制本模板到：

```text
docs/vibe-coding/changes/YYYY/MM/YYYY-MM-DD-HHMM-<author>-<topic>.md
```

只记录有意义的变更，不记录普通 typo、格式化或临时尝试。

# <变更标题>

- 日期：YYYY-MM-DD
- 作者：<name-or-git-user>
- AI 协助：<Codex|Claude|Cursor|无>
- Token 消耗：goal.tokensUsed=<n>，timeUsedSeconds=<n>，status=<active|complete|blocked>，或 未记录（原因）
- Review：未评审 | AI：Codex/code-reviewer | AI：Codex/code-reviewer（独立线程，快照：<path>，线程：<thread-id>） | 人工：<reviewer> | 人工+AI：<reviewer>，Codex/code-reviewer
- PR：<link-or-id>
- Commit：<hash-or-empty>
- 影响模块：<module names or paths>
- 类型：feature | fix | refactor | docs | config | test | incident

> 作者必须是本次变更负责人。不要把 Codex 写成作者，除非这条记录明确是 Codex 作为项目维护身份创建的自动维护记录；普通开发任务应把 Codex 写入 `AI 协助`。

> Token 消耗用于记录 AI 协作成本。有意义任务开始时应创建 Codex goal，任务结束时用 `get_goal()` 读取 `goal.tokensUsed`、`goal.timeUsedSeconds` 和 `goal.status`；无法获得时填写 `未记录（原因）`，不要编造估算值。

> Review 字段用于区分评审来源。`code-reviewer` 是 AI 预审工具，不替代高风险变更的人类 Review。

> 独立 Review 线程必须记录快照路径和线程 ID。快照后继续修改被审文件时，Review 结果只代表旧快照，需要标记为过期或重新审查。

## 为什么改

<业务原因、技术原因或协作原因>

## 改了什么

- <关键变更 1>
- <关键变更 2>

## 模块文档同步

- [ ] 不需要，原因：<原因>
- [ ] 已更新：`docs/vibe-coding/modules/<module>.md`

## 验证方式

- <命令、手动验证或静态检查证据>

## 风险和后续事项

- <已知风险、回滚方式或后续任务>

## 决策记录

- [ ] 不需要新增 ADR，原因：<原因>
- [ ] 已新增：`docs/vibe-coding/decisions/ADR-000X-<topic>.md`
