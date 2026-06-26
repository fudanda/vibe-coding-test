# 修复根路由 notFound 缺失告警

- 日期：2026-06-26
- 作者：fudanda
- AI 协助：Codex 用于定位 TanStack Router 告警、实现根路由兜底、同步文档和验证整理。
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）
- Review：AI：Codex/code-reviewer（无代码阻塞问题；曾指出本字段未更新，已修复）
- PR：未创建
- Commit：本地提交已生成，见提交结果
- 影响模块：`src/routes/__root.tsx`、`docs/vibe-coding/modules/app-shell.md`、`docs/vibe-coding/modules/routing-pages.md`
- 类型：fix

## 为什么改

访问不存在路由或下级 loader 抛出 `notFound()` 时，开发控制台持续输出 TanStack Router 警告：

```text
A notFoundError was encountered on the route with ID "__root__", but a notFoundComponent option was not configured
```

这会干扰开发者判断真实运行时错误，也会让本地 Vite 控制台持续刷 warning。

## 改了什么

- 在 `src/routes/__root.tsx` 的根路由配置中新增 `notFoundComponent: RootNotFound`。
- 新增中文 404 兜底页面，提供返回首页入口。
- 更新应用壳层和路由模块文档，明确根路由负责 notFound 兜底。

## 模块文档同步

- [ ] 不需要，原因：
- [x] 已更新：`docs/vibe-coding/modules/app-shell.md`
- [x] 已更新：`docs/vibe-coding/modules/routing-pages.md`

## 验证方式

- 已执行：`npm run build`，通过。Vite 仍提示存在超过 500 kB 的 client chunk，这是项目文档 Markdown 打包相关的既有风险。
- 已执行：`git diff --check`，通过；仅输出 Windows LF/CRLF 提示。
- 已执行：浏览器访问 `http://127.0.0.1:4176/__missing-vibe-route__`，确认显示中文“页面没有找到”兜底页、包含“返回首页”入口、没有回退到默认 `Not Found`。
- 已执行：浏览器访问 `http://127.0.0.1:4176/project-docs/modules-project-docs`，确认项目文档详情页仍正常渲染，Markdown body 存在。
- 已执行：读取浏览器 warning/error 日志，`notFoundComponent`、`defaultNotFoundComponent` 和 `A notFoundError was encountered` 相关日志数量为 0。

## 风险和后续事项

- 当前只增加根路由通用 404 兜底，不为每个子模块定制独立 404 页面。
- 根路由文件存在既有 Biome 全仓格式和 `dangerouslySetInnerHTML` 规则问题，本次不做无关重排和重构。

## 决策记录

- [x] 不需要新增 ADR，原因：本次是运行时告警修复，不涉及长期架构取舍。
- [ ] 已新增：
