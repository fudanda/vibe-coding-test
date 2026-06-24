# TanStack Store 模块

## 模块目标

TanStack Store 模块演示轻量全局状态、派生状态和自定义 Devtools 面板。

## 关键文件

- `src/lib/demo-store.ts`
- `src/lib/demo-store-devtools.tsx`
- `src/routes/demo/store.tsx`
- `src/routes/__root.tsx`

## 当前状态模型

`src/lib/demo-store.ts` 定义了两个 Store：

```ts
export const store = new Store({
  firstName: 'Jane',
  lastName: 'Smith',
})

export const fullName = new Store(
  `${store.state.firstName} ${store.state.lastName}`,
)
```

`store.subscribe` 监听基础状态变化，并更新派生状态 `fullName`。

## 页面交互

`src/routes/demo/store.tsx` 包含三个局部组件：

- `FirstName`：读取并更新 `firstName`
- `LastName`：读取并更新 `lastName`
- `FullName`：读取派生状态 `fullName`

组件通过 `useStore(store, selector)` 订阅状态，输入框变更时调用 `store.setState`。

## Devtools

`src/lib/demo-store-devtools.tsx` 使用 `EventClient` 自定义 Devtools 插件：

- 插件 ID：`store-devtools`
- 事件：`store-devtools:state`
- 面板展示 `firstName`、`lastName`、`fullName`

根壳层在 `TanStackDevtools` 里注册 `StoreDevtools`。

## 开发方式

扩展 store 时：

1. 先确认状态是否真的需要跨组件共享。
2. 基础状态放在主 `store`。
3. 派生状态可以使用独立 Store，但要保持订阅更新逻辑集中。
4. 页面组件只通过 selector 读取需要的字段，减少不必要渲染。
5. 如果状态需要调试，同步扩展 Devtools 事件 payload。

## 变更注意事项

- `store.setState` 当前使用对象展开更新，新增嵌套对象时要避免浅拷贝误伤。
- 派生状态由订阅手动维护，新增派生字段时要确保所有来源字段变化都会触发更新。
- Devtools 事件类型 `EventMap` 要和 emit payload 保持一致。

## 验证清单

- 访问 `/demo/store`。
- 修改 First Name 和 Last Name，确认 Full Name 实时变化。
- 打开 TanStack Devtools，确认 Store 面板同步显示最新状态。
- 修改 store 后运行 `npm run build`。

