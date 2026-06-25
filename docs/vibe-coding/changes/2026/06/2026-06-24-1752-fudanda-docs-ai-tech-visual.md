# 增强文档页 AI 科技视觉效果

- 日期：2026-06-24
- 作者：fudanda
- Review：未评审（已准备固定 diff 快照：`docs/vibe-coding/reviews/2026/06/2026-06-24-1800-docs-ai-tech-visual.diff`，待 Codex/code-reviewer 或人工确认）
- PR：待创建
- Commit：待提交
- 影响模块：src/routes/docs.tsx, src/styles.css, docs/vibe-coding/modules/routing-pages.md
- 类型：feature
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）
- AI 协助：Codex 参与视觉增强、文档同步和验证整理

## 为什么改

文档页虽然已经是本地页面，但视觉表达还不够突出 AI 科技感。需要进一步强化首屏效果，让它更像 Vibe Coding 的 AI 协作控制台。

## 改了什么

- 在文档页首屏新增 AI Core、Agent Trace 控制台和 HUD 状态角标。
- 增强 canvas 粒子背景，加入神经激活环、数据包和动态扫描效果。
- 新增 AI 信号带，展示 Intent Router、Agent Mesh、Context Lock 和 Review Gate。
- 同步更新路由与页面模块文档。

## 模块文档同步

- [ ] 不需要，原因：
- [x] 已更新：`docs/vibe-coding/modules/routing-pages.md`

## 验证方式

- 已运行：`npx biome check --max-diagnostics=100 src\components\Header.tsx src\routes\docs.tsx src\styles.css`，通过。
- 已运行：`npm run build`，通过；构建输出包含既有 Drizzle 示例的 `createServerFn().inputValidator()` 废弃提示，非本次文档页视觉增强引入。
- 已运行：`Invoke-WebRequest http://localhost:3002/docs`，返回 `200`，页面内容包含 `Vibe Coding AI 文档中枢` 和 `AI Knowledge Engine`。

## 风险和后续事项

- 动效更多，低性能设备可能有额外渲染压力；已保留 `prefers-reduced-motion` 降低动画。
- 如后续需要更强 3D 效果，可单独评估 Three.js，但本次不引入新依赖。
