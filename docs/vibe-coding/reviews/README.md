# 独立 Review 快照

本目录用于保存给独立 `code-reviewer` 线程使用的固定 diff 快照。

## 什么时候使用

满足任一条件时建议使用：

- PR diff 较大，例如超过 300 行。
- 涉及多个页面、模块、样式文件或配置文件。
- 涉及 React 生命周期、性能、可访问性、安全、权限、数据库或公共 API。
- 当前对话中的 `code-reviewer` 等待超时。
- 开发者需要继续在当前对话开发，让 Review 后台进行。

## 文件路径

按年月保存：

```text
docs/vibe-coding/reviews/YYYY/MM/YYYY-MM-DD-HHMM-<topic>.diff
```

示例：

```text
docs/vibe-coding/reviews/2026/06/2026-06-24-1157-vibe-coding-test-current.diff
```

## 标准流程

1. 主开发线程生成固定 diff 快照。
2. 新建独立 Codex Review 线程。
3. 使用 `set_thread_title` 将线程标题改为 `【AI审查】vibe-coding-test｜<任务短标题>`。
4. Review 线程只审查快照，不把持续变化的工作区当作唯一事实来源。
5. 主开发线程可以继续开发。
6. Review 返回后，主开发线程整合阻塞问题、非阻塞问题、测试缺口和疑问。
7. 如果快照后被审文件继续变化，标记 Review 过期，并重新审查或人工确认差异。

## 线程命名

独立 Review 线程统一使用：

```text
【AI审查】vibe-coding-test｜<任务短标题>
```

独立提交准备线程统一使用：

```text
【AI提交】vibe-coding-test｜<任务短标题>
```

标题只用于侧边栏快速识别；快照路径、线程 ID、验证证据和风险仍然写入 change fragment 或 PR 描述。`【AI提交】` 只代表提交准备和受控本地 commit 门禁，不代表自动 push、创建 PR、合并或发布。

## 自动触发受阻

本项目长期授权功能完成后自动触发独立 Review 和提交准备。如果当前 Codex App、CLI、子智能体或线程工具策略阻止自动新建 Review 或提交准备对话，主开发线程必须输出可直接粘贴的新对话交接 prompt，并在 Review 字段记录：

```text
Review：未评审（自动触发受阻，已输出独立提交准备交接 prompt）
```

自动触发失败不是 Review 通过，也不能作为本地 commit 的门禁通过依据。

## Review 字段写法

```text
Review：AI：Codex/code-reviewer（独立线程，快照：docs/vibe-coding/reviews/2026/06/2026-06-24-1157-vibe-coding-test-current.diff，线程：019xxx）
Review：未评审（Codex/code-reviewer 独立线程超时未返回）
Review：AI：Codex/code-reviewer（已审快照，但当前 diff 已变化，需重新审查）
```

## 重要约束

- AI Review 超时不等于通过。
- Review 结果只对快照负责，不自动覆盖后续改动。
- 高风险变更仍然必须有人类 Review。
- 没有测试、构建、截图、接口响应或日志等验证证据时，不能声称完成。
