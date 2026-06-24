# 变更日志碎片

本目录用于多人协作下的变更记录。规则是：一个有意义任务新增一个 Markdown 文件，不再多人同时追加同一个 `CHANGELOG.md`。

## 为什么使用碎片文件

- 减少多人并行开发时的合并冲突。
- 每个 PR 只负责自己的变更记录。
- 方便按作者、模块、日期和类型搜索。
- 发布或复盘时再按需汇总，不把日常开发变成维护大日志。

## 文件路径

按年月分目录：

```text
docs/vibe-coding/changes/YYYY/MM/YYYY-MM-DD-HHMM-<author>-<topic>.md
```

示例：

```text
docs/vibe-coding/changes/2026/06/2026-06-23-1530-zhangsan-add-table-filter.md
docs/vibe-coding/changes/2026/06/2026-06-23-1612-lisi-fix-drizzle-env.md
```

## 命名规则

- `YYYY-MM-DD-HHMM` 使用提交或完成记录时的本地时间。
- `author` 使用 Git 用户名、姓名拼音或团队约定 ID。
- `topic` 使用短横线连接的英文或拼音摘要。
- 同一人同一分钟有多条记录时，在文件名末尾追加 `-2`、`-3`。

## Token 消耗规则

`Token 消耗` 用于记录本次 AI 协作成本，放在 change fragment 头部元数据中，位于 `AI 协助` 后面。

当前默认规则：不为任务自动创建 Codex goal，也不强制统计 token 消耗。

默认格式：

```text
Token 消耗：未记录（当前规则不使用 Codex goal 统计）
```

只有用户明确要求以下事项时，才使用 Codex goal：

- 记录 token。
- 创建 goal。
- 设置 `token_budget`。
- 统计某个任务的 AI 协作成本。

需要统计 token 时，任务开始时创建 goal：

```json
{
  "objective": "实现 About 页面科技感动态背景"
}
```

如果需要预算控制，可以带上 `token_budget`：

```json
{
  "objective": "实现 About 页面科技感动态背景",
  "token_budget": 30000
}
```

任务结束前调用 `get_goal()`，把返回里的 `goal.tokensUsed`、`goal.timeUsedSeconds`、`goal.status` 写入 change fragment。

有 goal 时的推荐格式：

```text
Token 消耗：goal.tokensUsed=15500，timeUsedSeconds=420，status=complete
```

规则：

- 不要为了填写字段而自动创建 Codex goal。
- 不要为了补齐字段而编造估算值。
- 未明确要求统计 token 时，统一写 `未记录（当前规则不使用 Codex goal 统计）`。
- 如果明确创建了 goal，`goal.tokensUsed` 记录的是当前 goal 生命周期内的 token 消耗，不是天然的整条会话总消耗。
- 如果当前环境无法获取精确值，写 `未记录（原因）`。
- 如果一个 PR 使用多个 AI 工具，可以按工具分别记录，例如 `Codex：未记录；Claude：...`。

## 作者规则

`作者` 是本次变更的负责人，不是生成内容的 AI 工具。Codex、Claude、Cursor 等工具只能写入 `AI 协助` 字段。

作者识别优先级：

1. 开发者在本次任务或 PR 中明确指定的作者。
2. 环境变量 `VIBE_AUTHOR`。
3. `git config user.name`。
4. `git config user.email`。
5. 如果以上都没有，Codex 必须先询问开发者，不能默认写 `Codex`。

推荐设置：

```bash
git config user.name "张三"
git config user.email "zhangsan@company.com"
```

或者只给 Vibe Coding 使用：

```powershell
$env:VIBE_AUTHOR="张三"
```

## Review 字段规则

`Review` 用于说明本次变更是否评审、由谁评审、是否使用 AI 预审。不要只写空值。

推荐值：

```text
Review：未评审
Review：AI：Codex/code-reviewer
Review：AI：Codex/code-reviewer（独立线程，快照：docs/vibe-coding/reviews/2026/06/2026-06-24-1157-vibe-coding-test-current.diff，线程：019xxx）
Review：人工：张三
Review：人工+AI：张三，Codex/code-reviewer
```

规则：

- 使用 Codex 原生子智能体 `code-reviewer` 做 AI Review 时，写 `AI：Codex/code-reviewer`。
- 使用独立 Review 线程时，必须记录快照路径和线程 ID。
- 如果同时有人工评审和 AI 预审，写 `人工+AI：<reviewer>，Codex/code-reviewer`。
- 高风险变更必须有人类 Review，不得只写 `AI：Codex/code-reviewer`。
- `code-reviewer` 发现的阻塞问题、测试缺口和剩余风险，应写入 PR 或当前 change fragment。
- 未执行任何 Review 时写 `未评审`，不要留空或假装已评审。

## Review 快照规则

当 PR diff 较大，或开发者需要继续在当前对话开发时，应先生成固定 diff 快照，再让独立 Review 线程审查。

推荐路径：

```text
docs/vibe-coding/reviews/YYYY/MM/YYYY-MM-DD-HHMM-<topic>.diff
```

规则：

- 快照是 Review 的事实来源。
- Review 线程不应把持续变化的工作区作为唯一事实来源。
- 快照后如果继续修改被审文件，Review 结果只代表旧快照。
- AI Review 超时不等于通过；超时时写 `未评审（Codex/code-reviewer 独立线程超时未返回）`。
- Review 返回后，主开发线程负责把阻塞问题、测试缺口和疑问写入 PR 或 change fragment。

## 必填内容

每个变更文件必须包含：

- 日期
- 作者
- AI 协助
- Token 消耗
- Review
- PR
- Commit
- 影响模块
- 类型
- 为什么改
- 改了什么
- 模块文档同步情况
- 验证方式
- 风险和后续事项

模板见 `docs/vibe-coding/templates/change-record.md`。

## 检索示例

按作者：

```bash
rg "作者：张三" docs/vibe-coding/changes
```

按模块：

```bash
rg "database-drizzle" docs/vibe-coding/changes
```

按类型：

```bash
rg "类型：fix" docs/vibe-coding/changes
```

按 token 记录缺口：

```bash
rg "Token 消耗：未记录" docs/vibe-coding/changes
```
