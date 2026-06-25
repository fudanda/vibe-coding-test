# 为首页新增可交互粒子树背景

- 日期：2026-06-25
- 作者：fudanda
- AI 协助：Codex 参与实现、文档同步和验证整理
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）
- Review：未评审（提交与 PR 准备流程已检查 diff；建议合并前执行 Codex/code-reviewer 或人工 Review）
- PR：待创建
- Commit：待提交
- 影响模块：src/routes/index.tsx, src/styles.css, docs/vibe-coding/modules/routing-pages.md
- 类型：feature

## 为什么改

首页需要更强的动态视觉表达，用可交互的“粒子树”承载 Vibe Coding 的规则生长、上下文扎根和协作流动感，同时避免依赖外部背景图片。

## 改了什么

- 在首页首屏新增 `ParticleTreeBackground` canvas 组件。
- 粒子树支持鼠标移动牵引和点击脉冲扩散。
- 将首页 hero 背景从外部图片改为本地 canvas + 科技渐变 + 网格叠层。
- 新增 `vibe-tree-*` 样式和桌面端信号角标。
- 同步更新路由与页面模块文档。

## 模块文档同步

- [ ] 不需要，原因：
- [x] 已更新：`docs/vibe-coding/modules/routing-pages.md`

## 验证方式

- 已运行：`npx biome check --max-diagnostics=100 src\routes\index.tsx src\styles.css`，通过。
- 已运行：`npm run build`，通过；构建输出包含既有 Drizzle 示例的 `createServerFn().inputValidator()` 废弃提示，非本次首页背景变更引入。
- 已运行：`Invoke-WebRequest http://localhost:3002/`，返回 `200`，页面内容包含 `Vibe Coding` 和 `开始使用`。
- 已运行：`rg "ParticleTreeBackground|vibe-tree|粒子树|ROOTED_CONTEXT|INTERACTIVE_TREE" ...`，确认实现和文档入口已落地。

## 风险和后续事项

- canvas 动画会增加首屏绘制成本；已支持 `prefers-reduced-motion` 降低动画。
- 点击脉冲挂在 `window`，背景层不拦截首页按钮点击。

## 决策记录

- [x] 不需要新增 ADR，原因：本次是首页视觉增强和页面文档同步，不改变公共接口、数据模型或运行架构。
