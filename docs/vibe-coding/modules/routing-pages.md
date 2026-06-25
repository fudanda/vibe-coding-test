# 路由与页面模块

## 模块目标

路由与页面模块负责 URL 到页面组件的映射、页面级 loader、文件路由生成和导航入口约束。

## 关键文件

- `src/routes/__root.tsx`
- `src/routes/index.tsx`
- `src/routes/about.tsx`
- `src/routes/demo/table.tsx`
- `src/routes/demo/store.tsx`
- `src/routes/demo/tanstack-query.tsx`
- `src/routes/demo/drizzle.tsx`
- `src/routeTree.gen.ts`
- `src/router.tsx`
- `tsr.config.json`

## 当前路由

| URL | 文件 | 说明 |
| --- | --- | --- |
| `/` | `src/routes/index.tsx` | Vibe Coding 项目介绍首页，展示协作流程、Codex 插件能力和验证门禁 |
| `/about` | `src/routes/about.tsx` | Vibe Coding 科技感介绍页，包含可交互 canvas 背景、协作链路、核心原则和工作流说明 |
| `/docs` | `src/routes/docs.tsx` | 本地文档中心，包含 AI 科技感粒子背景、AI Core/HUD、规则入口、流程入口和本地文档清单 |
| `/demo/table` | `src/routes/demo/table.tsx` | TanStack Table demo |
| `/demo/store` | `src/routes/demo/store.tsx` | TanStack Store demo |
| `/demo/tanstack-query` | `src/routes/demo/tanstack-query.tsx` | TanStack Query demo |
| `/demo/drizzle` | `src/routes/demo/drizzle.tsx` | Drizzle SQLite Todo demo |

`src/routeTree.gen.ts` 是自动生成文件，包含所有文件路由的类型映射。不要手动修改这个文件。

## 新增页面流程

1. 在 `src/routes` 下新增路由文件。
2. 使用 `createFileRoute('/path')` 定义页面。
3. 如果页面需要预加载数据，优先使用 route `loader`。
4. 如果页面需要服务端逻辑，使用 TanStack Start `createServerFn`。
5. 更新 Header 中的导航入口，或确认页面只通过内部跳转访问。
6. 运行路由生成或构建命令，确认 `routeTree.gen.ts` 更新。

示例：

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return <main>Settings</main>
}
```

## 页面开发约定

- 页面组件首选放在路由文件内部，只有被多个页面复用时再抽到 `src/components`。
- 页面根元素优先使用 `<main>`，便于语义化和可访问性。
- 页面级视觉容器复用 `page-wrap`、`island-shell` 或 demo 语义类。
- 首页是 Vibe Coding 的项目介绍页，首屏应保持清晰的项目名、协作价值、流程入口和验证门禁入口。
- About 页面是 Vibe Coding 的项目理念介绍页，首屏使用动态 canvas 背景，交互逻辑保留在 `src/routes/about.tsx` 内，样式使用 `about-*` 语义类。
- Docs 页面是本地文档中心，首屏使用可交互粒子背景、AI Core 面板、Agent Trace 控制台和 AI 信号带，交互逻辑保留在 `src/routes/docs.tsx` 内，样式使用 `docs-*` 语义类。
- 外链必须设置 `target="_blank"` 时，同时添加 `rel="noopener noreferrer"` 或 `rel="noreferrer"`。
- Demo 页面可以保留英文文案；正式业务页面建议统一中文。

## Loader 与数据流

当前 `src/routes/demo/drizzle.tsx` 使用 route `loader` 调用服务端函数 `getTodos()`：

```ts
export const Route = createFileRoute('/demo/drizzle')({
  component: DemoDrizzle,
  loader: async () => await getTodos(),
})
```

组件内通过 `Route.useLoaderData()` 读取 loader 数据。提交 Todo 后调用 `router.invalidate()` 触发重新加载。

## 验证清单

- 新增或移动路由后运行 `npm run build`。
- 检查 `src/routeTree.gen.ts` 是否包含新路径。
- 在浏览器访问新 URL，确认刷新页面也能正常进入。
- 如果路由出现在 Header，检查 active 状态是否正确。
