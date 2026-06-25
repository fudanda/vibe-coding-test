# Drizzle 数据库模块

## 模块目标

Drizzle 数据库模块负责 SQLite 数据访问、演示表结构、服务端函数和数据库 demo 页面。

## 关键文件

- `src/db/schema.ts`
- `src/db/index.ts`
- `src/db/todos.ts`
- `src/db/demo-people.ts`
- `src/routes/demo/drizzle.tsx`
- `src/routes/demo/tanstack-query.tsx`
- `src/routes/demo/table.tsx`
- `drizzle.config.ts`
- `dev.db`

## 数据库连接

`src/db/index.ts` 使用 better-sqlite3 适配器创建 Drizzle 实例：

```ts
export const db = drizzle(process.env.DATABASE_URL!, { schema })
```

这里直接读取 `process.env.DATABASE_URL`。该变量必须在运行服务端函数前存在，否则数据库连接会失败。

`drizzle.config.ts` 会加载 `.env.local` 和 `.env`：

```ts
config({ path: ['.env.local', '.env'] })
```

然后把 `process.env.DATABASE_URL` 传给 Drizzle Kit。

## Schema

`src/db/schema.ts` 定义 `todos` 和 `demo_people` 两张演示表。

`todos` 表：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | integer primary key | 自增主键 |
| `title` | text not null | Todo 标题 |
| `createdAt` | integer timestamp | 默认 `unixepoch()` |

`demo_people` 表：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | integer primary key | 自增主键 |
| `firstName` | text not null | 名 |
| `lastName` | text not null | 姓 |
| `age` | integer not null | 年龄 |
| `visits` | integer not null | 访问次数 |
| `progress` | integer not null | 进度百分比 |
| `status` | text not null | 表格演示状态 |
| `createdAt` | integer timestamp | 默认 `unixepoch()` |

## 页面与服务端函数

`src/routes/demo/drizzle.tsx` 定义三个 server function：

- `getTodos`：GET，按 `createdAt` 倒序查询 todos。
- `createTodo`：POST，接收 `{ title: string }`，通过 `.validator()` 规范输入后插入 todos。
- `resetTodos`：POST，清空演示 todos、重置自增序列并恢复固定种子数据。

路由 loader 调用 `getTodos()`，页面通过 `Route.useLoaderData()` 读取数据。提交表单后调用 `createTodo`，成功后执行 `router.invalidate()` 刷新 loader 数据。

所有 route 文件都不应在顶层直接 import `src/db/*`。因为 `src/routeTree.gen.ts` 会在客户端导入 route 文件，顶层数据库 import 会把 `better-sqlite3` 带进浏览器 bundle，导致 `util.promisify` 等 Node API 错误。数据库访问应放在 `createServerFn().handler()` 内部动态 import。

页面当前呈现为数据库示例工作台，包含：

- 数据链路说明：Route Loader、Server Function、Drizzle ORM。
- 实时统计：记录数、最新写入 ID、数据入口数量。
- 写入面板：新增 Todo、重新读取、重置样例。
- Schema 面板：展示 `todos` 表字段。
- 记录面板：展示来自 SQLite 的真实记录和写入时间。

`src/db/todos.ts` 封装 Todo 演示数据访问，并在第一次访问时自动创建 `todos` 表和种子数据。这样本地 `dev.db` 只有表格演示数据时，访问 `/demo/drizzle` 也不会因为缺少 `todos` 表而报错。

`resetTodoItems()` 用于演示环境恢复数据：先删除当前 todos，再清理 `sqlite_sequence` 中的 `todos` 自增记录，最后写入固定种子数据。该函数只服务 demo 页，不应照搬到正式业务删除或重置流程。

`src/routes/demo/tanstack-query.tsx` 也通过 server function 读取 `src/db/todos.ts`，用于演示 React Query 从真实 SQLite 数据库查询数据。

`src/routes/demo/table.tsx` 定义表格 demo 的 server function：

- `getTablePeople`：GET，读取 `demo_people`。
- `createTablePerson`：POST，新增人员记录。
- `resetTablePeople`：POST，恢复固定样例数据。

`src/db/demo-people.ts` 封装表格 demo 的数据库访问，并在第一次访问时自动创建 `demo_people` 表和种子数据。

## 开发方式

新增表时：

1. 在 `src/db/schema.ts` 定义表。
2. 从 `src/db/index.ts` 的 schema 导出中自动纳入。
3. 运行 `npm run db:generate` 生成迁移。
4. 运行 `npm run db:migrate` 应用迁移。
5. 为页面或服务端函数补充查询逻辑。

新增写操作时：

- 使用 `createServerFn({ method: 'POST' })`。
- 添加输入校验，优先使用当前 TanStack Start 支持的 `.validator()`。
- 数据库模块只能在 server function handler 内动态 import，避免客户端加载 SQLite 驱动。
- 对空值、非法值和重复值做校验。
- 成功后刷新路由 loader 或 Query cache。

## 变更注意事项

- `dev.db` 是本地 SQLite 数据文件，通常不应提交到版本库。
- 当前 `createTodo` 的 validator 只做最小输入规范化，正式功能应使用 Zod 或等价校验。
- `todos` 和 `demo_people` 为了演示开箱可用，在运行时自动建表和种子；正式业务表应走 Drizzle migration。
- `resetTodos` 会清空演示数据并重置自增序列，只适合 demo，不适合生产业务数据。
- `createdAt` 使用 SQLite `unixepoch()`，读取后类型由 Drizzle timestamp mode 处理。
- 页面文案应保持和当前 SQLite 配置一致，不要写成 PostgreSQL。
- 不要在 route 顶层 import `#/db/todos`、`#/db/demo-people` 或其他数据库模块；否则浏览器控制台会出现 `better-sqlite3` / `util.promisify` 相关错误。

## 验证清单

- 配置 `DATABASE_URL`，例如本地 SQLite 文件路径。
- 启动 `npm run dev`，访问 `/demo/drizzle`。
- 确认本地数据库缺少 `todos` 表时，页面会自动创建表并显示样例 Todo。
- 新增 Todo 后确认列表刷新，且新数据在最上方。
- 点击“重新读取”确认 loader 可刷新真实数据库记录。
- 点击“重置样例”确认页面恢复 3 条固定样例，并且 ID 回到 `#1`、`#2`、`#3`。
- 构建日志不应再出现 `inputValidator` deprecated warning。
- 浏览器控制台不应出现 `promisify is not a function` 或 `better-sqlite3` 被客户端加载导致的错误。
- 访问 `/demo/table`，确认 `demo_people` 自动建表、种子数据展示、新增记录和重置样例可用。
