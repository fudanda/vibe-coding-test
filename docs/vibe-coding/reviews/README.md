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
3. Review 线程只审查快照，不把持续变化的工作区当作唯一事实来源。
4. 主开发线程可以继续开发。
5. Review 返回后，主开发线程整合阻塞问题、非阻塞问题、测试缺口和疑问。
6. 如果快照后被审文件继续变化，标记 Review 过期，并重新审查或人工确认差异。

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
