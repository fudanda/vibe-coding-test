# 项目文档模块

## 模块目标

项目文档模块负责把仓库内 `docs/vibe-coding/**/*.md` 文件生成为可浏览的本地文档站点。它让团队可以在应用内阅读模块文档、变更记录、ADR、Review 说明和模板，而不是只在文件系统里查找 Markdown。

## 关键文件

- `src/routes/project-docs.tsx`
- `src/routes/project-docs.index.tsx`
- `src/routes/project-docs.$docId.tsx`
- `src/components/Markdown.tsx`
- `src/lib/markdown.ts`
- `src/lib/project-docs.ts`
- `docs/vibe-coding/**/*.md`

## 当前路由

| URL | 说明 |
| --- | --- |
| `/project-docs` | 项目文档索引页，按模块文档、变更记录、决策记录、Review 文档、模板和规则文档分组。父路由 `src/routes/project-docs.tsx` 只负责渲染 `Outlet`，索引内容在 `src/routes/project-docs.index.tsx` |
| `/project-docs/$docId` | 单篇 Markdown 文档详情页，展示正文、页面目录和同类文档 |

## 数据来源

`src/lib/project-docs.ts` 使用 Vite `import.meta.glob("../../docs/vibe-coding/**/*.md", { eager: true, import: "default", query: "?raw" })` 在构建时收集仓库内 Markdown。

每个 Markdown 会被转换为 `ProjectDoc`：

- `id`：根据文档路径生成，用于 `/project-docs/$docId`
- `path`：原始文档路径
- `title`：优先读取首个 `#` 标题
- `category`：根据路径归类为 `modules`、`changes`、`decisions`、`reviews`、`templates` 或 `root`
- `summary`：读取正文中第一段非标题文本
- `date`：优先读取 `- 日期：`，否则从文件名中提取日期

## Markdown 渲染

`src/lib/markdown.ts` 使用 unified 体系：

- `remark-parse` 解析 Markdown
- `remark-gfm` 支持表格、任务列表等 GitHub Flavored Markdown
- `remark-rehype` 转换为 HTML AST
- `rehype-slug` 为标题生成锚点
- `rehype-autolink-headings` 为标题加可点击锚点
- `rehype-stringify` 输出 HTML 字符串

`src/components/Markdown.tsx` 使用 `html-react-parser` 把 HTML 字符串渲染为 React 节点，并统一处理：

- 外链自动加 `target="_blank"` 和 `rel="noreferrer"`
- 链接 URL 只允许 `http:`、`https:`、`mailto:`、相对路径和 `#` 锚点
- 图片 URL 只允许 `http:`、`https:`、相对路径和 `#` 锚点
- `javascript:`、`data:`、`vbscript:`、协议相对 URL 和包含控制字符的 URL 会被移除
- 图片使用 `loading="lazy"`
- 相对 `.md` 链接通过 `resolveProjectDocHref()` 转换为 `/project-docs/$docId`

页面目录的 heading id 从渲染后的 HTML 标题节点读取，避免手写 slug 规则和 `rehype-slug` 生成的正文锚点不一致。

## 设计边界

- v1 不引入 content-collections，不生成额外内容缓存文件。
- v1 不支持远程 Markdown 拉取，只渲染仓库内文档。
- v1 不做代码高亮主题切换；代码块使用现有 CSS 深色块展示。
- Markdown 文件新增、删除或改名后，需要重新构建应用才能反映到文档索引。

## 开发方式

新增一类文档时：

1. 把 Markdown 放入 `docs/vibe-coding/` 下合适目录。
2. 如果是新目录类型，在 `src/lib/project-docs.ts` 增加 category 和 label。
3. 如果需要新视觉结构，在 `src/styles.css` 中扩展 `project-doc-*` 样式。
4. 运行 `npm run build`，确认索引和详情页可以生成。

## 验证清单

- `/project-docs` 能显示模块文档和变更记录分组。
- 点击模块文档能进入 `/project-docs/$docId`。
- Markdown 标题、列表、表格、代码块渲染正常。
- 页面目录锚点能跳转到对应标题。
- 相对 `.md` 链接能跳转到项目文档详情页。
- `npx vitest run src\lib\markdown.test.ts src\components\Markdown.test.ts` 覆盖危险 URL 过滤和标题锚点一致性。
- 移动端检查正文、表格、代码块和长路径不横向撑破页面。
