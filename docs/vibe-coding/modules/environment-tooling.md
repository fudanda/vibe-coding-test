# 环境与工程化模块

## 模块目标

环境与工程化模块负责开发服务器、构建插件、TypeScript、路径别名、环境变量校验、代码检查、shadcn 配置和项目脚本。

## 关键文件

- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `biome.json`
- `components.json`
- `src/env.ts`
- `drizzle.config.ts`
- `tsr.config.json`
- `.gitignore`

## npm 脚本

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动 Vite dev server，端口 3000 |
| `npm run generate-routes` | 生成 TanStack Router 路由树 |
| `npm run build` | 生产构建 |
| `npm run preview` | 预览构建产物 |
| `npm run test` | 运行 Vitest |
| `npm run format` | Biome 格式化 |
| `npm run lint` | Biome lint |
| `npm run check` | Biome check |
| `npm run db:generate` | 生成 Drizzle migration |
| `npm run db:migrate` | 执行 Drizzle migration |
| `npm run db:push` | 推送 schema 到数据库 |
| `npm run db:pull` | 从数据库拉取 schema |
| `npm run db:studio` | 打开 Drizzle Studio |

## Vite 配置

`vite.config.ts` 当前配置：

- `resolve.tsconfigPaths: true`
- `server.host: '0.0.0.0'`
- 插件顺序：`devtools()`、`tailwindcss()`、`tanstackStart()`、`viteReact()`

`server.host: '0.0.0.0'` 允许局域网或容器环境访问开发服务。开发时仍通过 `npm run dev` 启动，默认端口来自 package script 的 `--port 3000`。

## TypeScript 配置

`tsconfig.json` 使用：

- `target: ES2022`
- `jsx: react-jsx`
- `moduleResolution: bundler`
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- 路径别名：`#/*` 和 `@/*` 都指向 `./src/*`

项目代码中主要使用 `#/*`，例如：

```ts
import { makeData } from '#/data/demo-table-data'
```

## 环境变量

`src/env.ts` 使用 `@t3-oss/env-core` 和 Zod 定义：

- 服务端：`SERVER_URL`，可选 URL
- 客户端：`VITE_APP_TITLE`，可选非空字符串
- 客户端变量前缀：`VITE_`
- `emptyStringAsUndefined: true`

注意：数据库模块使用的 `DATABASE_URL` 当前不在 `src/env.ts` 中，而是通过 `process.env.DATABASE_URL` 直接读取。数据库相关校验需要单独关注。

## Biome

`biome.json` 当前：

- 启用 formatter 和 linter
- 缩进使用 tab
- JavaScript/TypeScript 引号格式为 double
- 排除 `src/routeTree.gen.ts` 和 `src/styles.css`
- includes 主要覆盖 `src`、`.vscode`、`index.html`、`vite.config.ts`

如果新增 docs 目录，默认不会被当前 Biome includes 检查。

## Git 忽略规则

`.gitignore` 当前忽略：

- 依赖和构建产物：`node_modules`、`dist`、`dist-ssr`、`.output`、`.vinxi`、`.nitro`、`.wrangler`
- 本地环境和临时配置：`.env`、`*.local`、`__unconfig*`、`todos.json`
- 本地数据库和验证产物：`dev.db`、`output/`

`dev.db` 是本地 SQLite 数据文件，`output/` 用于存放 Playwright 截图等本地验证证据。它们可以作为 PR 描述中的验证证据引用，但默认不提交到版本库。

## shadcn 配置

`components.json` 配置：

- 风格：`new-york`
- TSX：启用
- Tailwind CSS 入口：`src/styles.css`
- baseColor：`zinc`
- iconLibrary：`lucide`
- 别名：`#/components`、`#/lib/utils`、`#/components/ui` 等

新增 shadcn 组件时，优先使用配置中的别名和 `cn` 工具函数。

## 开发方式

新增依赖前先确认是否已有 TanStack、Tailwind、shadcn 或现有工具能满足需求。当前项目是 starter，依赖越少越容易维护。

新增工程配置时：

1. 明确配置属于 Vite、TypeScript、Biome、TanStack Router、Drizzle 还是 shadcn。
2. 保持配置文件职责单一。
3. 修改后运行最相关命令验证。
4. 如果影响开发体验，在 README 或模块文档中补充说明。

## 验证清单

- 修改 Vite 或插件配置后运行 `npm run build`。
- 修改 TS 路径或类型规则后运行 `npm run build` 和 `npm run check`。
- 修改 Biome 配置后运行 `npm run check`。
- 修改 Drizzle 配置后运行 `npm run db:generate` 或 `npm run db:studio`。
- 修改环境变量 schema 后检查启动、构建和相关页面。
