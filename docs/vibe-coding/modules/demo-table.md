# TanStack Table 模块

## 模块目标

 TanStack Table 模块演示从真实 SQLite 数据库读取表格数据，并在客户端完成模糊搜索、列过滤、排序和分页。页面以数据工作台形式展示数据库记录、数据链路、统计指标、新增记录、重新读取和重置样例数据等能力。

## 关键文件

- `src/routes/demo/table.tsx`
- `src/data/demo-table-data.ts`
- `src/db/demo-people.ts`
- `src/db/schema.ts`

## 数据模型

`src/data/demo-table-data.ts` 定义表格行类型和种子数据：

```ts
export type Person = DemoPersonSeed & {
  id: number
}
```

`src/db/schema.ts` 定义 `demo_people` 表：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | integer primary key | 自增主键 |
| `firstName` | text not null | 名 |
| `lastName` | text not null | 姓 |
| `age` | integer not null | 年龄 |
| `visits` | integer not null | 访问次数 |
| `progress` | integer not null | 进度百分比 |
| `status` | text not null | `relationship`、`complicated` 或 `single` |
| `createdAt` | integer timestamp | 默认 `unixepoch()` |

`src/db/demo-people.ts` 在第一次访问表格接口时执行 `CREATE TABLE IF NOT EXISTS demo_people`，并在表为空时写入固定样例数据。这样本地 `dev.db` 没有迁移记录时，表格 demo 仍可开箱验证。

## 接口能力

`src/routes/demo/table.tsx` 定义三个 TanStack Start server function：

- `getTablePeople`：GET，读取 `demo_people` 全量演示数据。
- `createTablePerson`：POST，接收表单数据，规范化后插入 `demo_people`。
- `resetTablePeople`：POST，清空并恢复固定样例数据。

页面 loader 调用 `getTablePeople()`，新增或重置成功后调用 `router.invalidate()` 重新读取数据库。

## 页面展示

`/demo/table` 当前采用表格工作台布局：

- 顶部说明区展示 `demo_people` 数据来源、SQLite live 状态和全局搜索入口。
- 数据链路面板展示 `Route Loader -> Server Function -> TanStack Table` 的执行路径。
- 指标卡展示数据库记录数、当前过滤结果、平均进度和访问合计。
- Mutation 表单支持新增一条数据库记录、重新读取接口和重置样例数据。
- 表格区域支持列头排序、列过滤、进度条、状态标签、空结果提示和横向滚动。
- 分页区支持首页、上一页、下一页、末页、页码跳转和 page size 切换。
- 调试区通过折叠面板展示当前 `columnFilters` 和 `globalFilter` JSON。

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
- `age`
- `visits`
- `progress`
- `status`

其中 `fullName` 使用 accessor function 拼接姓名，并使用 fuzzy filter/sort。

状态字段在页面上显示为中文标签：

| 数据值 | 页面标签 |
| --- | --- |
| `relationship` | 稳定 |
| `complicated` | 需跟进 |
| `single` | 新线索 |

## 数据流

1. 访问 `/demo/table`。
2. 路由 loader 调用 `getTablePeople()`。
3. `src/db/demo-people.ts` 确保 `demo_people` 表存在，并在空表时写入种子数据。
4. 页面通过 `Route.useLoaderData()` 把数据库记录交给 TanStack Table。
5. 用户执行搜索、列过滤、排序或分页时，由 TanStack Table 在客户端计算当前 row model。
6. 用户新增或重置数据后，server function 写入 SQLite，并通过 `router.invalidate()` 刷新 loader 数据。

## 开发方式

新增列时：

1. 更新 `src/data/demo-table-data.ts` 的类型和种子数据。
2. 更新 `src/db/schema.ts` 的 `demoPeople` 表。
3. 更新 `src/db/demo-people.ts` 的建表 SQL、select 字段和输入规范化逻辑。
4. 在 `src/routes/demo/table.tsx` 的 `columns` 中添加 `accessorKey` 或 `accessorFn`。
5. 运行本模块相关检查和 `npm run build`。

如果演示数据变成正式业务数据，需要重新判断：

- 是否仍然客户端分页、过滤和排序。
- 是否改为服务端分页、过滤和排序。
- 是否需要正式迁移文件，而不是运行时 `CREATE TABLE IF NOT EXISTS`。
- 是否需要更严格的 Zod 校验、唯一约束和错误提示。

## 变更注意事项

- `demo_people` 是演示表，运行时自动建表是为了降低本地验证成本；正式业务表应走 Drizzle 迁移。
- `dev.db` 是本地 SQLite 数据文件，通常不应提交到版本库。
- 表格容器需要处理横向滚动，否则新增列后容易溢出。
- 新增 server function 时优先使用 `validator()`，不要新增已废弃的 `inputValidator()`。

## 验证清单

- 访问 `/demo/table`，确认页面展示“真实数据库表格示例”。
- 确认页面包含 `demo_people` 表说明或种子数据。
- 使用全局搜索，确认结果过滤正确。
- 点击列头，确认排序切换正常。
- 使用列过滤输入框，确认单列过滤正确。
- 使用分页按钮、页码输入和 page size 下拉。
- 新增记录后确认表格刷新，并且记录写入 SQLite。
- 点击“重新读取接口”后确认 loader 数据刷新。
- 点击“重置样例”后确认恢复固定样例数据。
- 展开“查看当前筛选状态 JSON”，确认当前过滤状态可读。
- 修改表格或数据库逻辑后运行 `npx biome check src/routes/demo/table.tsx src/db/demo-people.ts src/db/schema.ts src/data/demo-table-data.ts` 和 `npm run build`。
