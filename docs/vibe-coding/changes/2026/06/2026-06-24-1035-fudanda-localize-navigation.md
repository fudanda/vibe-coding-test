# 将导航菜单改为中文

- 日期：2026-06-24
- 作者：fudanda
- AI 协助：Codex
- Token 消耗：未记录（本次任务未创建 Codex goal）
- Review：
- PR：
- Commit：
- 影响模块：`src/components/Header.tsx`、应用壳层文档
- 类型：docs

## 为什么改

`vibe-coding-test` 首页和 About 页面已经面向 Vibe Coding 项目做了中文化展示，但公共导航仍保留英文菜单。需要把导航菜单改成中文，保持演示项目体验一致。

## 改了什么

- 将 Header 顶部菜单 `Home`、`About`、`Docs`、`Demos` 改为 `首页`、`关于`、`文档`、`示例`。
- 将 demo 下拉菜单改为 `表格示例`、`状态示例`、`查询示例`、`数据库示例`。
- 同步更新应用壳层模块文档中的公共导航说明。

## 模块文档同步

- [ ] 不需要，原因：
- [x] 已更新：`docs/vibe-coding/modules/app-shell.md`

## 验证方式

- `rg "首页|关于|文档|示例|表格示例|状态示例|查询示例|数据库示例|>Home<|>About<|>Docs<|>Demos<|>Store<|>Drizzle<" src/components/Header.tsx` 能检索到中文导航文案，未检索到旧英文可见菜单。
- `npx biome check src/components/Header.tsx --max-diagnostics=50` 通过。
- `Invoke-WebRequest http://localhost:3002/about` 返回 `200`，响应内容包含 `首页`、`关于`、`文档`、`示例`。

## 风险和后续事项

- 品牌名 `TanStack Start` 保留为产品标识，未翻译。
- X / GitHub 图标的无障碍隐藏文本仍是英文，后续如果要做完整中文化可以单独处理。

## 决策记录

- [x] 不需要新增 ADR，原因：这是公共导航文案本地化，不涉及技术取舍。
- [ ] 已新增：
