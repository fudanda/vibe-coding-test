# ADR 决策记录

本目录用于保存重要技术或流程决策。规则是：一个重要决策一份 ADR 文件，不再把所有决策追加到同一个 `decision-log.md`。

## 什么时候需要 ADR

- 团队在多个方案之间做了取舍。
- 决策会影响后续开发方式、模块边界、测试策略或协作流程。
- 决策背后有明确的放弃方案，未来可能被重新讨论。

普通 typo、格式化、小范围实现细节和无争议调整不需要 ADR。

## 决策人规则

`决策人` 必须是人或团队角色，不是 AI 工具。AI 工具只能写入 `AI 协助` 字段。

如果 Codex 无法从任务说明、`VIBE_AUTHOR` 或 git config 识别决策人，必须先询问开发者。

## 文件命名

```text
docs/vibe-coding/decisions/ADR-0001-<topic>.md
```

编号递增，不复用。`topic` 使用短横线连接的英文或拼音摘要。

## 推荐结构

```md
# ADR-0001：<决策标题>

- 日期：YYYY-MM-DD
- 状态：accepted | superseded | deprecated
- 决策人：<name-or-team>
- AI 协助：<Codex|Claude|Cursor|无>
- 影响范围：<modules or process>

## 背景

## 决策

## 采用方案

## 放弃方案

## 影响

## 回看条件
```

## 检索示例

```bash
rg "状态：accepted" docs/vibe-coding/decisions
rg "影响范围：文档维护" docs/vibe-coding/decisions
```
