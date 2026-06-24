# TanStack Table 模块

## 模块目标

TanStack Table 模块演示客户端大数据表格、模糊搜索、列过滤、排序、分页和数据刷新。

## 关键文件

- `src/routes/demo/table.tsx`
- `src/data/demo-table-data.ts`

## 数据模型

`src/data/demo-table-data.ts` 定义 `Person`：

```ts
export type Person = {
  id: number
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: 'relationship' | 'complicated' | 'single'
  subRows?: Person[]
}
```

`makeData(...lens)` 使用 `@faker-js/faker` 生成测试数据。当前页面初始生成 5000 行，点击 Refresh Data 会生成 50000 行用于压力测试。

## 表格能力

`src/routes/demo/table.tsx` 使用 `useReactTable`，启用：

- `getCoreRowModel`
- `getFilteredRowModel`
- `getSortedRowModel`
- `getPaginationRowModel`
- 全局过滤：`globalFilterFn: 'fuzzy'`
- 自定义过滤：`fuzzyFilter`
- 自定义排序：`fuzzySort`
- 分页控制
- 防抖输入：`DebouncedInput`

当前列包括：

- `id`
- `firstName`
- `lastName`
- `fullName`

其中 `fullName` 使用 accessor function 拼接姓名，并使用 fuzzy filter/sort。

## 数据流

1. 页面初始化时调用 `makeData(5_000)`。
2. 用户输入全局搜索或列搜索。
3. `DebouncedInput` 延迟 500ms 调用过滤更新。
4. TanStack Table 计算过滤、排序、分页后的 row model。
5. 页面渲染当前页 rows。

当 `fullName` 列被过滤时，`useEffect` 会自动把排序切换到 `fullName`，确保模糊匹配结果按 rank 排列。

## 开发方式

新增列时：

1. 更新 `Person` 类型。
2. 在 `makeData` 中生成字段。
3. 在 `columns` 中添加 `accessorKey` 或 `accessorFn`。
4. 选择合适的 `filterFn` 和 `sortingFn`。
5. 检查大数据量下的交互性能。

如果接入真实后端数据，需要重新判断：

- 是否仍然客户端分页。
- 是否改为服务端分页、过滤和排序。
- 是否保留 `faker` demo 数据。
- 是否需要加载态和错误态。

## 变更注意事项

- 当前 fuzzy filter 使用 `any`，正式代码可以按表格数据类型进一步收紧。
- 50000 行数据用于压力测试，移动端或低性能设备上可能明显卡顿。
- 表格容器需要处理横向滚动，否则新增列后容易溢出。
- 当前 debug 配置打开了 `debugTable` 和 `debugHeaders`，正式环境可考虑关闭。

## 验证清单

- 访问 `/demo/table`。
- 使用全局搜索，确认结果过滤正确。
- 点击列头，确认排序切换正常。
- 使用分页按钮、页码输入和 page size 下拉。
- 点击 Refresh Data 后确认大数据量下页面仍可操作。
- 修改表格逻辑后运行 `npm run build`。

