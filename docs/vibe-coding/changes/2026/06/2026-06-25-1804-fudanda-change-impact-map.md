# 新增功能变更影响图页面

- 日期：2026-06-25
- 作者：fudanda
- AI 协助：Codex 用于方案落地、页面实现、模块文档同步和验证整理。
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）
- Review：AI：Codex/code-reviewer（提交准备线程 `019efe47-d796-72c0-9681-e2e6d7871930`；子审查 `019efe48-aeda-7fb0-ad7a-3ec47d8e1aac` 初审发现空状态和移动端裁切阻塞项，已修复并重新验证）
- PR：未创建
- Commit：未提交
- 影响模块：`src/routes/changes.tsx`、`src/lib/change-impact-data.ts`、`src/components/Header.tsx`、`src/routes/docs.tsx`、`src/styles.css`、`docs/vibe-coding/modules/routing-pages.md`、`docs/vibe-coding/modules/styling-theme.md`
- 类型：feature

## 为什么改

团队已经通过 change fragment 记录每次有意义的功能变更，但纯 Markdown 日志不够直观。需要一个本地可视化入口，把一次变更影响的模块、文件、验证证据、Review 状态和风险放到同一张关系图里，方便开发、Review 和阶段复盘。

## 改了什么

- 新增 `/changes` 页面，提供变更时间线、日期/类型/作者/模块筛选、影响关系图和详情面板。
- 新增 `src/lib/change-impact-data.ts`，把现有 change fragment 整理为前端静态 `ChangeImpactRecord` 数据。
- 在 Header 和 `/docs` 本地文档中心增加“变更图”入口。
- 在 `src/styles.css` 增加 `changes-*` 页面专用样式，使用 CSS/SVG 实现 AI 科技感关系图，不引入新依赖。
- 同步更新路由与页面模块文档、样式与主题模块文档。

## 模块文档同步

- [ ] 不需要，原因：
- [x] 已更新：`docs/vibe-coding/modules/routing-pages.md`
- [x] 已更新：`docs/vibe-coding/modules/styling-theme.md`

## 验证方式

- 已通过：`npx biome check --write src\routes\changes.tsx src\lib\change-impact-data.ts src\components\Header.tsx src\routes\docs.tsx --max-diagnostics=80`
- 已通过：`npm run build`
- 已通过：`Invoke-WebRequest http://127.0.0.1:3002/changes` 返回 `200`，响应内容包含 `功能变更，不只是一条日志`。
- 已通过：Codex 内置浏览器访问 `/changes`，标题唯一、4 个筛选控件存在，类型筛选 `fix` 后时间线显示 `降低文档页粒子动画速度`。
- 已通过：移动端视口检查，`scrollWidth=375`、`clientWidth=375`，关系图节点 `nodeOverflowCount=0`。

## 风险和后续事项

- v1 使用静态数据，不自动解析 Markdown；新增 change fragment 后需要同步维护 `src/lib/change-impact-data.ts`。
- 关系图只覆盖最近几条代表性变更，不代表完整项目依赖图；新增 change fragment 后需要同步维护静态数据。
- 提交前需要通过独立提交准备流程补充 Code Reviewer 审查。

## 决策记录

- [x] 不需要新增 ADR，原因：这是本地可视化页面增强，不涉及架构级技术取舍。
- [ ] 已新增：
