# 降低文档页粒子动画速度

- 日期：2026-06-25
- 作者：fudanda
- Review：AI：Codex/code-reviewer（独立提交准备对话：019efdff-31a0-7152-989e-6cd74da2a251；Code Reviewer 线程：019efe00-21ac-75d2-a079-def8b4631c1e；未发现阻塞问题）
- PR：未创建
- Commit：本地提交见最终结果
- 独立提交准备对话：019efdff-31a0-7152-989e-6cd74da2a251
- 影响模块：`src/routes/docs.tsx`、`docs/vibe-coding/modules/routing-pages.md`、`docs/vibe-coding/modules/styling-theme.md`
- 类型：fix
- AI 协助：Codex 用于定位粒子动画实现、调整速度参数和补充文档记录。
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）

## 为什么改

文档页的粒子、数据包和扫描线运动速度偏快，影响阅读稳定性和页面质感。需要保留 AI 科技感，同时让背景节奏更沉稳。

## 改了什么

- 在 `/docs` 粒子背景中加入统一 `motionScale`，把整体动画节奏降低到原来的约四成。
- 同步降低粒子漂移速度、自动焦点移动、数据包移动、扫描线和时间驱动的波动速度。
- 更新路由和样式模块文档，说明 Docs 页面使用低速可交互粒子背景。

## 模块文档同步

- [x] 已更新：`docs/vibe-coding/modules/routing-pages.md`
- [x] 已更新：`docs/vibe-coding/modules/styling-theme.md`

## 验证方式

- 已通过：`npx biome check src\routes\docs.tsx docs\vibe-coding\modules\routing-pages.md docs\vibe-coding\modules\styling-theme.md`
- 已通过：`npm run build`
- 已通过：`Invoke-WebRequest http://127.0.0.1:3002/docs` 返回 `200`，页面内容包含 `Vibe Coding AI 文档中枢`。
- 已执行：Codex App `create_thread` 创建独立提交准备对话 `019efdff-31a0-7152-989e-6cd74da2a251`。
- 已通过：Code Reviewer 预审，线程 `019efe00-21ac-75d2-a079-def8b4631c1e` 未发现阻塞或非阻塞问题。

## 风险和后续事项

- 本次只调整动画速度，不改变页面结构和文档入口。
- 提交前已通过独立提交准备流程补充 Code Reviewer 审查。
