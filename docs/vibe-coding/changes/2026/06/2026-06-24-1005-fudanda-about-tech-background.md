# 增强 About 页面科技感和动态背景

- 日期：2026-06-24
- 作者：fudanda
- AI 协助：Codex
- Token 消耗：未记录（历史记录补录，原任务未统计）
- Review：
- PR：
- Commit：
- 影响模块：`src/routes/about.tsx`、`src/styles.css`、路由页面文档、样式主题文档
- 类型：feature

## 为什么改

About 页面仍是 TanStack starter 默认介绍，无法表达当前 Vibe Coding 项目的团队 AI 协作定位。需要把页面改成更贴合项目主题的中文介绍页，并加入动态可交互背景，提升演示效果。

## 改了什么

- 将 `/about` 改为 Vibe Coding 项目理念介绍页。
- 新增 `TechSignalBackground` canvas 背景，绘制网络节点、连线、扫描带和随鼠标位置变化的焦点。
- 新增协作链路、核心原则、工作流时间线和 Human In The Loop 说明区。
- 在 `src/styles.css` 新增 `about-*` 页面专用样式。
- 同步更新路由页面文档和样式主题文档。

## 模块文档同步

- [ ] 不需要，原因：
- [x] 已更新：`docs/vibe-coding/modules/routing-pages.md`、`docs/vibe-coding/modules/styling-theme.md`

## 验证方式

- `npx biome check src/routes/about.tsx src/styles.css --max-diagnostics=80` 通过。
- `npm run build` 通过；构建时仍有既有 `demo/drizzle.tsx` 的 `createServerFn().inputValidator()` deprecated warning。
- `Invoke-WebRequest http://localhost:3002/about` 返回 `200`，并包含新页面文案。
- `npx playwright screenshot --browser=chromium --channel=chrome --viewport-size=1440,1100 http://localhost:3002/about output/playwright/about-tech-desktop.png` 成功。
- `npx playwright screenshot --browser=chromium --channel=chrome --viewport-size=390,900 http://localhost:3002/about output/playwright/about-tech-mobile.png` 成功。
- 桌面截图采样结果：`size=1440x1100`，`sampledUniqueColors=295`，确认背景不是空白色块。

## 风险和后续事项

- canvas 动画在低性能设备上可能增加少量渲染成本；当前已支持 `prefers-reduced-motion: reduce` 降低动画。
- 截图文件位于 `vibe-coding-test/output/playwright/`，仅作为本地验证证据使用。

## 决策记录

- [x] 不需要新增 ADR，原因：这是单页视觉增强，不涉及长期架构取舍。
- [ ] 已新增：
