# TanStack Store 模块

## 模块目标

TanStack Store 模块演示轻量全局状态、派生状态、自定义 Devtools 面板，以及状态在页面控制台中的实时传播。

## 关键文件

- `src/lib/demo-store.ts`
- `src/lib/demo-store-devtools.tsx`
- `src/routes/demo/store.tsx`
- `src/routes/__root.tsx`

## 当前状态模型

`src/lib/demo-store.ts` 定义了基础 Store、派生 Store 和更新工具函数。

基础状态包含：

| 字段 | 含义 |
| --- | --- |
| `firstName` | 成员名 |
| `lastName` | 成员姓 |
| `role` | 当前协作角色 |
| `mode` | 当前任务阶段 |
| `focus` | 当前关注任务 |
| `confidence` | 当前信心分 |

派生状态包含：

```ts
export const fullName = new Store(
  `${store.state.firstName} ${store.state.lastName}`,
)

export const statusSummary = new Store(...)
```

`store.subscribe` 监听基础状态变化，并同步更新 `fullName` 和 `statusSummary`。

页面通过 `updateDemoStore(patch)` 更新基础状态，通过 `resetDemoStore()` 恢复默认演示数据。

## 页面交互

`src/routes/demo/store.tsx` 是状态控制台页面，包含：

- 顶部说明区：展示 TanStack Store、selector 订阅和派生状态的演示目标。
- 当前状态区：展示头像缩写、完整姓名、角色、状态摘要和信心进度。
- 指标卡：展示基础字段数量、派生状态数量和当前信心分。
- 编辑基础状态区：修改姓名、角色、阶段、关注任务和信心分。
- 状态传播链路：展示基础 Store、派生 Store、自定义 Devtools Event 的关系。
- Live JSON：展示当前基础状态和派生状态快照。

页面组件通过 `useStore(store, selector)` 订阅基础状态，通过 `useStore(fullName)` 和 `useStore(statusSummary)` 读取派生状态。

## Devtools

`src/lib/demo-store-devtools.tsx` 使用 `EventClient` 自定义 Devtools 插件：

- 插件 ID：`store-devtools`
- 事件：`store-devtools:state`
- 面板展示 `firstName`、`lastName`、`role`、`mode`、`focus`、`confidence`、`fullName` 和 `statusSummary`

根壳层在 `TanStackDevtools` 里注册 `StoreDevtools`。

## 开发方式

扩展 store 时：

1. 先确认状态是否真的需要跨组件共享。
2. 基础状态放在主 `store`。
3. 派生状态可以使用独立 Store，但要保持订阅更新逻辑集中。
4. 页面组件只通过 selector 读取需要的字段，减少不必要渲染。
5. 如果状态需要调试，同步扩展 Devtools 事件 payload 和 Live JSON 展示。

## 变更注意事项

- `store.setState` 当前使用对象展开更新，新增嵌套对象时要避免浅拷贝误伤。
- 派生状态由订阅手动维护，新增派生字段时要确保所有来源字段变化都会触发更新。
- Devtools 事件类型 `EventMap` 要和 emit payload 保持一致。
- 页面 UI 和 Devtools 面板都依赖同一个状态模型，新增字段时要同时检查页面、Devtools 和文档。

## 验证清单

- 访问 `/demo/store`。
- 修改姓名、角色、阶段、关注任务和信心分，确认当前状态、状态摘要和 Live JSON 实时变化。
- 打开 TanStack Devtools，确认 Store 面板同步显示最新状态。
- 修改 store 后运行 `npm run build`。
