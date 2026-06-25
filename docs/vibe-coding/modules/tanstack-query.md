# TanStack Query 模块

## 模块目标

TanStack Query 模块负责客户端查询状态、与 TanStack Router 的 SSR Query 集成，以及 Query Devtools 面板。

## 关键文件

- `src/integrations/tanstack-query/root-provider.tsx`
- `src/integrations/tanstack-query/devtools.tsx`
- `src/router.tsx`
- `src/routes/demo/tanstack-query.tsx`
- `src/routes/__root.tsx`
- `src/db/todos.ts`

## 当前实现

`root-provider.tsx` 暴露 `getContext()`：

```ts
export function getContext() {
  const queryClient = new QueryClient()

  return {
    queryClient,
  }
}
```

`src/router.tsx` 调用 `getContext()` 创建 router context，并执行：

```ts
setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient })
```

这让路由和 React Query 在 SSR 场景下共享 QueryClient。

`devtools.tsx` 暴露一个 TanStack Devtools 插件：

```tsx
export default {
  name: 'Tanstack Query',
  render: <ReactQueryDevtoolsPanel />,
}
```

根壳层在 `TanStackDevtools` 中注册该面板。

## Demo 页面

`src/routes/demo/tanstack-query.tsx` 使用 `useQuery`：

- `queryKey: ['query-demo', 'todos']`
- `queryFn` 调用 TanStack Start server function
- server function 通过 `src/db/todos.ts` 从 SQLite `todos` 表读取真实数据
- 页面提供 loading、error、empty、success、手动刷新、查询状态指标、数据链路和结果流展示

当前 demo 访问本地 SQLite 数据库。`src/db/todos.ts` 会在首次访问时自动创建 `todos` 演示表并写入种子数据，因此不需要先手动跑 migration 才能打开查询示例。

页面视觉是查询控制台风格：

- 顶部展示当前 query key、server function 和 SQLite 数据源。
- 状态卡片展示结果数量、最新记录编号和最近同步时间。
- 结果流按数据库记录展示标题、行号和 SQLite row id。
- 数据链路面板展示 `React Query -> Server Function -> SQLite todos` 的调用路径。

## 开发方式

新增查询时：

1. 给每类数据定义稳定的 `queryKey`。
2. 查询函数保持可复用，避免直接散落在 JSX 中。
3. 如果数据与路由强相关，考虑使用 route loader 或 Router + Query SSR 集成。
4. 对 mutation 后的数据刷新，优先使用 `queryClient.invalidateQueries` 或路由 `invalidate`。

建议的 query key 形式：

```ts
['todos']
['todo', todoId]
['users', { page, keyword }]
```

## 变更注意事项

- `getContext()` 当前每次创建新的 `QueryClient`，这符合按 router 实例隔离的思路；不要把它提升成跨请求共享的单例，避免 SSR 数据串扰。
- `TanstackQueryProvider` 当前是空组件，实际集成点在 `router.tsx`，不要误以为它已经包裹了 React tree。
- Query demo 依赖服务端函数和 SQLite；如果 `DATABASE_URL` 缺失或数据库无法打开，页面会进入 error 状态。
- `todos` 是演示表，运行时自动建表只用于本地 demo；正式业务数据仍应走 migration 和更严格的输入校验。

## 验证清单

- 访问 `/demo/tanstack-query`，确认列表展示来自 SQLite `todos` 表的真实记录。
- 点击“重新查询”，确认 React Query 能重新请求服务端函数。
- 检查状态卡片、查询链路和结果流在桌面、移动端都不重叠。
- 打开 TanStack Devtools，确认 Query 面板存在。
- 修改查询接口后，验证 loading、error、empty、success 四种状态。
- 修改 Query 集成后运行 `npm run build`。
