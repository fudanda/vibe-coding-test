# 新增 Vibe Coding 项目介绍首页

- 日期：2026-06-23
- 作者：fudanda
- AI 协助：Codex
- Token 消耗：未记录（历史记录补录，原任务未统计）
- Review：
- PR：
- Commit：
- 影响模块：`src/routes/index.tsx`、`src/styles.css`、`docs/vibe-coding/modules/routing-pages.md`、`docs/vibe-coding/modules/styling-theme.md`
- 类型：feature

## 为什么改

测试项目首页仍是 TanStack starter 默认内容，无法展示当前 Vibe Coding 规范、Codex 插件化能力和团队协作价值。需要把首页改成项目介绍页，方便团队演示和验证 vibe coding 效果。

## 改了什么

- 将 `/` 首页改为中文 Vibe Coding 项目介绍页。
- 增加真实代码工作台照片背景首屏、流程阶段、Codex 插件说明、能力卡片和验证门禁区域。
- 新增首页专用视觉变量和 `vibe-*` 样式类。
- 同步更新路由页面模块文档和样式主题模块文档。

## 模块文档同步

- [ ] 不需要，原因：
- [x] 已更新：`docs/vibe-coding/modules/routing-pages.md`
- [x] 已更新：`docs/vibe-coding/modules/styling-theme.md`

## 验证方式

- `npm run build` 通过。
- `npx biome check src\routes\index.tsx --max-diagnostics=50` 通过。
- `npm run check` 未通过，失败来自项目既有 Biome schema 版本、全仓格式化和 demo 文件 lint 问题，不是本次首页单文件问题。

## 风险和后续事项

- 首页首屏背景使用远程 Unsplash 图片；如果生产环境要求离线或内网部署，需要替换为本地静态图片。

## 决策记录

- [x] 不需要新增 ADR，原因：首页视觉实现没有形成长期架构取舍。
- [ ] 已新增：`docs/vibe-coding/decisions/ADR-000X-<topic>.md`
