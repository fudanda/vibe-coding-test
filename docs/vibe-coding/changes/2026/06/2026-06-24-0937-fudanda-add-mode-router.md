# 新增 Codex 模式判断规则

- 日期：2026-06-24
- 作者：fudanda
- AI 协助：Codex
- Token 消耗：未记录（历史记录补录，原任务未统计）
- Review：
- PR：
- Commit：
- 影响模块：Codex 插件、AGENTS.md、README.md、工作流规范
- 类型：docs

## 为什么改

团队需要让 Codex 根据用户想实现的功能自动判断“直接执行”还是“先计划”。如果只靠人工提醒，复杂任务容易被直接实现，简单任务又可能被过度规划。

## 改了什么

- 新增 `skills/vibe-mode-router/SKILL.md`，定义普通执行模式和计划优先模式的判断条件。
- 更新 `hooks/session-start-codex`，在会话开始提示中加入模式判断 skill。
- 更新 `.codex-plugin/plugin.json`，把插件能力描述扩展为包含模式判断。
- 更新 `AGENTS.md`，把模式判断规则写入项目入口规范。
- 更新 `README.md` 和 `docs/vibe-coding/01-workflow.md`，让团队文档和插件行为保持一致。

## 模块文档同步

- [x] 不需要，原因：本次修改的是 Vibe Coding 规范和插件能力，不改变 `vibe-coding-test` 应用模块当前事实。
- [ ] 已更新：

## 验证方式

- `python -m json.tool .codex-plugin/plugin.json` 通过，插件 JSON 合法。
- `PYTHONUTF8=1 python C:/Users/Administrator/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/vibe-mode-router` 返回 `Skill is valid!`。
- 检查所有 `skills/*/SKILL.md`，均包含 `name` 和 `description`。
- `cmd /c hooks/run-hook.cmd session-start-codex` 输出包含 `SessionStart` 和 `vibe-mode-router`。
- `rg "模式判断|普通执行模式|计划优先模式|vibe-mode-router" AGENTS.md README.md docs/vibe-coding/01-workflow.md hooks/session-start-codex .codex-plugin/plugin.json skills/vibe-mode-router/SKILL.md` 能检索到新规则。

## 风险和后续事项

- 该规则不保证能切换 Codex App 的界面模式，只保证流程层面先判断工作方式。
- 后续如果 Codex 插件 manifest 支持更强的模式路由能力，可以再把本规则升级为更自动化的 runtime 行为。

## 决策记录

- [x] 不需要新增 ADR，原因：这是对现有插件流程的轻量增强，没有引入新的架构取舍。
- [ ] 已新增：
