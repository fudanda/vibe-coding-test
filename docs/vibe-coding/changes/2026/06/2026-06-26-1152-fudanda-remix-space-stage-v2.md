# Remix 风格太空任务首页 v2

- 日期：2026-06-26
- 作者：fudanda
- Review：AI：Codex/code-reviewer（独立提交准备线程二次预审通过；首次发现 reduced-motion 重绘缺口，已修复并复审通过）
- PR：未创建
- Commit：未提交
- 影响模块：`src/routes/index.tsx`、`src/styles.css`、`docs/vibe-coding/modules/routing-pages.md`、`docs/vibe-coding/modules/styling-theme.md`
- 类型：feature
- AI 协助：Codex 依据用户确认方案实现 Remix 风格滚动任务舞台、滚动章节联动、样式与模块文档同步
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）

## 为什么改

用户希望进一步借鉴 Remix 首页的品牌舞台、粒子场、章节导航和滚动叙事机制。上一版首页已经具备太空飞船粒子场，但仍偏向单一 Hero。为了让首页更像 AI 任务控制中心，本次将首页升级为可滚动的太空任务舞台。

## 改了什么

- 将首页内容重组为 `Mission Core`、`Flight Plan`、`Agent Stack`、`Review Orbit`、`Verify Gate`、`Launch Protocol` 六个任务章节。
- 新增桌面端左侧任务章节导航和移动端横向命令提示条。
- `SpaceMissionBackground` 支持 `activeSectionIndex`，根据当前章节调整飞船目标点、轨道亮度、任务节点高亮和粒子色调。
- 使用 `IntersectionObserver` 和滚动位置计算更新当前任务阶段。
- 修复 `prefers-reduced-motion: reduce` 下章节切换后 canvas 不随当前章节立即重绘的问题。
- 保留鼠标移动、点击脉冲和 `prefers-reduced-motion` 降级逻辑。
- 同步路由与样式模块文档，记录首页当前实现事实。

## 模块文档同步

- [ ] 不需要，原因：
- [x] 已更新：`docs/vibe-coding/modules/routing-pages.md`、`docs/vibe-coding/modules/styling-theme.md`

## 验证方式

- 通过：`npx biome check src/routes/index.tsx --max-diagnostics=120`
- 通过：`npm run build`（仅保留 Vite chunk size 提示）
- 通过：`git diff --check`（仅提示工作区 LF 将被 Git 转为 CRLF）
- 通过：`rg "ParticleTree|vibe-tree|ROOTED_CONTEXT|INTERACTIVE_TREE" src docs/vibe-coding/modules` 无命中
- 通过：浏览器访问 `http://127.0.0.1:3002/`，桌面 `1280x720` 检查 canvas 非空、6 个任务章节存在、左侧任务导航可见、标题和按钮不重叠。
- 通过：滚动到 `review-orbit` 后，当前章节和左侧导航 active 状态切换为 `review-orbit`。
- 通过：移动端 `390x844` 检查侧边任务导航隐藏、横向命令条可滚动、canvas 尺寸为 `375x844`、标题/按钮/首屏 HUD 不重叠。
- 通过：移动端滚动到 `verify-gate` 后，当前章节和横向命令条 active 状态切换为 `verify-gate`。
- 通过：浏览器 console 过滤 `Invalid DOM property`、`notFound`、`canvas`、`React` 无命中。
- 通过：Playwright + 系统 Chrome 模拟 `prefers-reduced-motion: reduce`、移动端 `390x844`，从 `mission-core` 点击移动端命令条跳到 `verify-gate` 后，当前章节和横向命令条 active 状态切换为 `verify-gate`，canvas 尺寸为 `390x844`，采样像素变化量 `193371`，证明 reduced-motion 下章节切换触发重绘。

## 风险和后续事项

- 风险：滚动舞台比单 Hero 更复杂，移动端需要重点检查命令条、标题、按钮和章节 HUD 是否重叠。
- 风险：canvas 与滚动状态联动增加运行时逻辑，已由独立 AI Review 重点审查 effect 清理、`IntersectionObserver` 和动画性能；当前无已知阻塞问题。
- 后续：提交后仍建议人工在真实移动设备上抽查滚动手感和长页面性能。
