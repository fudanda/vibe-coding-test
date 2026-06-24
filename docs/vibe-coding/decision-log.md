# vibe-coding-test 决策记录入口

本文件是决策记录入口，不再作为所有决策的追加日志。重要技术或流程取舍请新增独立 ADR 文件，避免多人同时编辑同一个 `decision-log.md`。

## 写到哪里

决策记录写入：

```text
docs/vibe-coding/decisions/ADR-0001-<topic>.md
```

说明与示例见 [decisions/README.md](./decisions/README.md)。

## 什么时候需要 ADR

需要 ADR：

- 团队在多个方案之间做了取舍。
- 决策影响后续开发方式、模块边界、测试策略或协作流程。
- 有明确放弃方案，未来可能被重新讨论。
- 高风险或长期影响的技术选择。

不需要 ADR：

- 普通 typo。
- 纯格式化。
- 无争议的小范围实现细节。
- 无行为变化的局部调整。

## 当前 ADR

- [ADR-0001：模块当前事实与历史记录分离](./decisions/ADR-0001-separate-current-docs-history.md)
- [ADR-0002：使用日志碎片降低多人协作冲突](./decisions/ADR-0002-use-change-fragments.md)

