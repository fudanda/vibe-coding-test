# Codex Review 入口

本文件是 `vibe-coding-test` 的 Codex 代码评审入口。执行 `/review`、调用 `code-reviewer` 或人工检查 PR 时，先参考这里，再进入项目本地规范。

## 评审重点

- 是否满足本次需求和验收标准。
- 是否改变了路由、数据库、接口、运行方式或测试方式。
- 是否同步更新了 `docs/vibe-coding/modules/`、change fragment、ADR 和 PR 说明。
- 是否有真实验证证据，例如构建、Biome 检查、页面访问、接口响应或截图。
- 是否需要高风险人工 Review。

## 使用方式

- 小 diff：直接按 `docs/vibe-coding/modules/` 和 `docs/vibe-coding/reviews/README.md` 检查。
- 大 diff 或耗时评审：生成固定 diff 快照到 `docs/vibe-coding/reviews/YYYY/MM/`，再新建独立 Review 线程。
- 高风险变更：AI Review 只能辅助，必须有人类 Review。

详细规则见：

- `AGENTS.md`
- `docs/vibe-coding/reviews/README.md`
- `docs/vibe-coding/changes/README.md`
