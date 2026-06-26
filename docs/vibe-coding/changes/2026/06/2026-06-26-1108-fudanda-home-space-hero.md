# 首页太空飞船粒子场

- 日期：2026-06-26
- 作者：fudanda
- Review：AI：Codex/code-reviewer（初审发现 1 个阻塞问题，已修复并复审通过；无剩余阻塞问题）
- PR：未创建
- Commit：未提交
- 影响模块：`src/routes/index.tsx`、`src/styles.css`、`docs/vibe-coding/modules/routing-pages.md`、`docs/vibe-coding/modules/styling-theme.md`
- 类型：feature
- AI 协助：Codex 依据用户确认方案实现首页太空粒子动效、同步模块文档并准备验证
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）

## 为什么改

用户希望参考 Remix 首页的黑色舞台、中心载具、粒子质感和速度感，把原首页的赛车、跑道类动效方向替换为太空、飞船元素及场景。当前首页已有 canvas 粒子树，适合在不新增依赖的前提下升级为更贴合 AI 科技感的太空任务场景。

## 改了什么

- 将首页 canvas 背景从“粒子树”改为“太空飞船粒子场”。
- 新增星场、轨道、任务节点、飞船、航迹和点击跃迁脉冲。
- 鼠标移动会影响飞船朝向、星尘视差和轨道高亮。
- 保留 `prefers-reduced-motion`，低动效场景只绘制慢速或静态星场。
- 修复低动效场景下 ResizeObserver 变更 canvas 尺寸后未立即重绘的问题。
- 将装饰性 canvas 背景包裹层标记为 `aria-hidden="true"`，避免辅助技术暴露无名称 canvas。
- 将首页信号标签更新为 `MISSION_CONTEXT` 和 `AI_REVIEW_ORBIT`。
- 同步路由与样式模块文档，记录首页当前实现事实。

## 模块文档同步

- [ ] 不需要，原因：
- [x] 已更新：`docs/vibe-coding/modules/routing-pages.md`、`docs/vibe-coding/modules/styling-theme.md`

## 验证方式

- 通过：`npx biome check src/routes/index.tsx --max-diagnostics=120`
- 通过：`npm run build`
- 通过：`git diff --check`，仅有 Windows 换行提示，无空白错误
- 通过：浏览器访问 `http://127.0.0.1:3002/`，桌面和移动端截图确认首页 canvas 非空、标题和按钮可见、控制台无 error/warn
- 通过：桌面矩形检测确认左侧任务信号、标题和徽标不重叠，`canvas.vibe-space-canvas` 数量为 1，CTA 文案为“开始使用”
- 通过：Playwright + 本机 Chrome 模拟 `prefers-reduced-motion: reduce`，初始、移动端 resize、桌面 resize 后 canvas 均非空采样，`.vibe-space-background` 的 `aria-hidden` 为 `true`，控制台无 error/warn
- 通过：Codex/code-reviewer 初审指出 `prefers-reduced-motion` resize 后 canvas 可能清空、装饰性 canvas 可访问性标记缺失；修复后复审结论为无阻塞问题、无非阻塞问题

## 风险和后续事项

- 风险：canvas 动效如果粒子密度过高，可能在低性能设备上造成掉帧；已通过移动端降低星点密度和 `prefers-reduced-motion` 降低风险。
- 后续：提交准备线程生成中文 Lore commit message 与 PR 描述草案；远端 push 和 PR 创建仍需单独确认。
