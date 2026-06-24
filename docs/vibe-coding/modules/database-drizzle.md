# Drizzle 数据库模块

## 模块目标

Drizzle 数据库模块负责 SQLite 数据访问、Todo 表结构、服务端函数和数据库 demo 页面。

## 关键文件

- `src/db/schema.ts`
- `src/db/index.ts`
- `src/routes/demo/drizzle.tsx`
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

`src/db/schema.ts` 定义 `todos` 表：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | integer primary key | 自增主键 |
| `title` | text not null | Todo 标题 |
| `createdAt` | integer timestamp | 默认 `unixepoch()` |

## 页面与服务端函数

`src/routes/demo/drizzle.tsx` 定义两个 server function：

- `getTodos`：GET，按 `createdAt` 倒序查询 todos。
- `createTodo`：POST，接收 `{ title: string }` 并插入 todos。

路由 loader 调用 `getTodos()`，页面通过 `Route.useLoaderData()` 读取数据。提交表单后调用 `createTodo`，成功后执行 `router.invalidate()` 刷新 loader 数据。

## 开发方式

新增表时：

1. 在 `src/db/schema.ts` 定义表。
2. 从 `src/db/index.ts` 的 schema 导出中自动纳入。
3. 运行 `npm run db:generate` 生成迁移。
4. 运行 `npm run db:migrate` 应用迁移。
5. 为页面或服务端函数补充查询逻辑。

新增写操作时：

- 使用 `createServerFn({ method: 'POST' })`。
- 添加 input validator。
- 对空值、非法值和重复值做校验。
- 成功后刷新路由 loader 或 Query cache。

## 变更注意事项

- `dev.db` 是本地 SQLite 数据文件，通常不应提交到版本库。
- 当前 `createTodo` 的 input validator 只是类型断言，没有做业务校验。正式功能应使用 Zod 或等价校验。
- `createdAt` 使用 SQLite `unixepoch()`，读取后类型由 Drizzle timestamp mode 处理。
- 页面文案里写了 PostgreSQL，但当前配置是 SQLite。正式文档或 UI 需要统一。

## 验证清单

- 配置 `DATABASE_URL`，例如本地 SQLite 文件路径。
- 运行 `npm run db:generate`。
- 运行 `npm run db:migrate`。
- 启动 `npm run dev`，访问 `/demo/drizzle`。
- 新增 Todo 后确认列表刷新，且新数据在最上方。

