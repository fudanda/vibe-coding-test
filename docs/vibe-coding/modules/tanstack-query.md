# TanStack Query 模块

## 模块目标

TanStack Query 模块负责客户端查询状态、与 TanStack Router 的 SSR Query 集成，以及 Query Devtools 面板。

## 关键文件

- `src/integrations/tanstack-query/root-provider.tsx`
- `src/integrations/tanstack-query/devtools.tsx`
- `src/router.tsx`
- `src/routes/demo/tanstack-query.tsx`
- `src/routes/__root.tsx`

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

- `queryKey: ['todos']`
- `queryFn` 返回本地 Promise 数据
- `initialData: []`

当前 demo 不访问远程接口，适合演示 Query 的基础渲染流程。

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
- Query demo 的 `initialData: []` 会让页面无 loading 状态，正式接口需要补齐 loading、error、empty 状态。

## 验证清单

- 访问 `/demo/tanstack-query`，确认列表展示 Alice、Bob、Charlie。
- 打开 TanStack Devtools，确认 Query 面板存在。
- 新增真实接口查询后，验证 loading、error、success 三种状态。
- 修改 Query 集成后运行 `npm run build`。

