# vibe-coding-test 变更记录入口

本文件是变更记录入口，不再作为每次 PR 的追加日志。多人协作时，请为每个有意义任务新增一份 change fragment，避免多人同时修改同一个文件导致合并冲突。

## 写到哪里

变更记录写入：

```text
docs/vibe-coding/changes/YYYY/MM/YYYY-MM-DD-HHMM-<author>-<topic>.md
```

说明与示例见 [changes/README.md](./changes/README.md)。

模板见 [templates/change-record.md](./templates/change-record.md)。

## 什么时候需要记录

需要记录：

- 模块职责变化。
- 新增、删除或调整功能。
- 路由、API、状态、数据库 schema、配置变化。
- 运行方式、测试方式、部署方式变化。
- AI 引入问题后的修复、回滚或经验教训。

不需要记录：

- 普通 typo。
- 纯格式化。
- 无行为变化的小重命名。
- 临时调试代码，且最终没有进入交付结果。

## 日常流程

- 每个 PR 如果需要记录变更，只新增自己的 change fragment 文件。
- change fragment 的 `作者` 必须是变更负责人；AI 工具写入 `AI 协助`。
- 默认不创建 Codex goal，也不强制统计 token 消耗；只有用户明确要求时才创建或读取 goal。
- change fragment 必须填写 `Token 消耗`；默认写 `未记录（当前规则不使用 Codex goal 统计）`。如果本次任务明确创建了 Codex goal，则记录 `goal.tokensUsed`、`goal.timeUsedSeconds` 和 `goal.status`。
- change fragment 必须填写 `Review`；使用 `code-reviewer` 时写 `AI：Codex/code-reviewer`，高风险变更必须有人类 Review。
- 大 diff 或耗时 Review 建议使用独立 Review 线程，并记录 diff 快照路径、线程 ID 和是否过期。
- 如果无法从明确指定、`VIBE_AUTHOR` 或 git config 识别作者，Codex 必须先询问开发者。
- 如果模块当前事实变化，仍然更新对应 `docs/vibe-coding/modules/*.md`。
- 如果产生重要技术取舍，新增 ADR 文件到 `docs/vibe-coding/decisions/`。
- 发布或阶段复盘时，再由负责人按需汇总 `changes/` 到 release note。

## 检索方式

按作者：

```bash
rg "作者：张三" docs/vibe-coding/changes
```

按模块：

```bash
rg "影响模块：.*database" docs/vibe-coding/changes
```

按类型：

```bash
rg "类型：fix" docs/vibe-coding/changes
```

按 token 记录缺口：

```bash
rg "Token 消耗：未记录" docs/vibe-coding/changes
```
