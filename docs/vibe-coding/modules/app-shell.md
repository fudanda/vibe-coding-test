# 应用壳层模块

## 模块目标

应用壳层负责整个应用的根文档结构、全局样式加载、公共导航、页脚、TanStack Devtools 和路由上下文声明。它是所有页面共享的运行外壳。

## 关键文件

- `src/routes/__root.tsx`
- `src/router.tsx`
- `src/styles.css`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/lib/demo-store-devtools.tsx`
- `src/integrations/tanstack-query/devtools.tsx`

## 当前实现

`src/routes/__root.tsx` 使用 `createRootRouteWithContext` 定义根路由，并声明 `MyRouterContext`：

```ts
interface MyRouterContext {
  queryClient: QueryClient
}
```

根路由通过 `head` 注入基础 meta、标题和 `styles.css`。`shellComponent` 渲染完整 HTML：

- `<html lang="en" suppressHydrationWarning>`
- `<head>` 内先执行主题初始化脚本，再渲染 `HeadContent`
- `<body>` 内渲染 `Header`、页面内容、`Footer`、`TanStackDevtools` 和 `Scripts`

主题初始化脚本会在 React hydration 前读取 `localStorage.theme`，避免页面首次渲染时主题闪烁。

根路由配置了 `notFoundComponent`，当未知 URL 或下级 loader 抛出 `notFound()` 时，会渲染中文 404 兜底页，避免 TanStack Router 使用默认 `<p>Not Found</p>` 并在开发控制台持续输出缺少 notFound 组件的警告。

`src/components/Header.tsx` 提供公共导航。当前可见菜单使用中文：

- `首页` -> `/`
- `关于` -> `/about`
- `文档` -> `/docs` 本地文档中心
- `示例` -> 下拉菜单，包含 `表格示例`、`状态示例`、`查询示例`、`数据库示例`

`src/router.tsx` 负责创建 TanStack Router，并把 QueryClient 放进 router context：

- `routeTree` 来自 `src/routeTree.gen.ts`
- `scrollRestoration: true`
- `defaultPreload: 'intent'`
- `setupRouterSsrQueryIntegration` 负责 Router 与 React Query 的 SSR 集成

## 开发方式

新增全局 Provider 时，优先判断它属于哪一层：

- 和路由上下文有关：放在 `src/router.tsx` 的 context 构建逻辑里。
- 和 HTML 文档结构有关：放在 `src/routes/__root.tsx`。
- 只是 UI 级全局组件：放在 `RootDocument` 的 `<body>` 中。

不要把页面专属状态放进应用壳层。根壳层只放跨页面稳定存在的能力，例如主题、导航、Devtools、全局数据客户端。

## 变更注意事项

- `THEME_INIT_SCRIPT` 运行在浏览器环境，必须保持可直接内联执行，不要引用外部变量。
- 如果修改 `MyRouterContext`，需要同步检查 `src/router.tsx` 中的 `getContext()` 返回值。
- 如果新增会抛出 `notFound()` 的页面或 loader，确认根路由 404 兜底仍能渲染，并检查控制台没有 `notFoundComponent` 缺失警告。
- `TanStackDevtools` 当前注册了 Router、Store、Query 三个面板，删除 demo 模块时要同步清理对应 devtools 插件。
- 根文档语言当前是 `en`，如果项目正式中文化，可以改为 `zh-CN` 并检查 SEO/meta 文案。

## 验证清单

- 运行 `npm run build`，确认 SSR 构建通过。
- 启动 `npm run dev` 后检查首页、About 和 demo 页面是否都能渲染 Header/Footer。
- 访问一个不存在的 URL，确认显示中文 404 兜底页且控制台没有 notFound 组件缺失警告。
- 切换主题后刷新页面，确认主题不会闪烁回默认值。
- 打开 TanStack Devtools，确认 Router、Store、Query 面板能正常显示。
