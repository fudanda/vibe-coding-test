# 样式与主题模块

## 模块目标

样式与主题模块提供 Tailwind CSS 入口、全局字体、CSS 变量、深浅色主题、共享布局类和基础视觉规范。

## 关键文件

- `src/styles.css`
- `vite.config.ts`
- `components.json`
- `src/routes/__root.tsx`
- `src/components/ThemeToggle.tsx`

## 当前样式结构

`src/styles.css` 主要包含：

- Google Fonts：`Fraunces` 和 `Manrope`
- Tailwind CSS 4：`@import 'tailwindcss'`
- Tailwind Typography 插件：`@plugin '@tailwindcss/typography'`
- 动画扩展：`tw-animate-css`
- 深色变体：`@custom-variant dark (&:is(.dark *))`
- 浅色变量：`:root`
- 深色变量：`.dark`
- Tailwind inline theme 映射：`@theme inline`
- 全局 body 背景、文本、链接、code、pre 样式
- 共享类：`page-wrap`、`display-title`、`island-shell`、`feature-card`、`nav-link`、`rise-in`
- 首页专用类：`vibe-hero`、`vibe-step-card`、`vibe-terminal`、`vibe-review-panel`、`vibe-check-row`
- About 页面专用类：`about-tech-scene`、`about-tech-background`、`about-signal-panel`、`about-principle-card`、`about-timeline`、`about-command-panel`
- 数据库示例专用类：`db-console-shell`、`db-hero-panel`、`db-flow-panel`、`db-stat-card`、`db-mutation-panel`、`db-records-panel`
- 查询示例专用类：`query-console-shell`、`query-hero-panel`、`query-status-panel`、`query-stat-card`、`query-results-panel`、`query-source-panel`
- 表格示例专用类：`table-console-shell`、`table-hero-panel`、`table-flow-panel`、`table-stat-card`、`table-form-panel`、`table-data-panel`、`table-pagination-panel`、`table-debug-panel`
- 变更影响图专用类：`changes-page`、`changes-hero`、`changes-toolbar`、`changes-timeline-panel`、`changes-graph-panel`、`changes-detail-panel`
- 项目文档专用类：`project-docs-page`、`project-docs-hero`、`project-docs-card`、`project-doc-reader`、`project-markdown-body`

## 主题变量

项目使用两组变量：

- 业务视觉变量：例如 `--sea-ink`、`--lagoon`、`--surface`、`--line`
- 首页强调变量：例如 `--coral`、`--amber`、`--indigo`
- shadcn/Tailwind 兼容变量：例如 `--background`、`--foreground`、`--primary`、`--border`

深色主题通过 `.dark` 覆盖变量。`ThemeToggle` 和 `THEME_INIT_SCRIPT` 会控制根元素上的 `.light` / `.dark` 类。

## 共享类说明

| 类名 | 用途 |
| --- | --- |
| `page-wrap` | 页面最大宽度和水平居中 |
| `display-title` | 标题字体，使用 Fraunces |
| `island-shell` | 半透明面板、边框、阴影 |
| `feature-card` | 首页特性卡片 |
| `nav-link` | Header 导航链接和 active 下划线 |
| `rise-in` | 入场动画 |
| `vibe-hero` | Vibe Coding 首页首屏真实图片背景 |
| `vibe-step-card` | Vibe Coding 流程阶段卡片 |
| `vibe-terminal` | Codex 插件流程终端展示 |
| `vibe-review-panel` | 验证门禁说明面板 |
| `vibe-check-row` | 验证检查项行 |
| `about-tech-scene` | About 页面科技感首屏容器 |
| `about-tech-background` | About 页面动态 canvas 背景挂载层 |
| `about-signal-panel` | About 页面 Codex 协作链路面板 |
| `about-principle-card` | About 页面核心原则卡片 |
| `about-timeline` | About 页面工作流阶段网格 |
| `about-command-panel` | About 页面伪代码终端展示 |
| `db-console-shell` | 数据库示例页面动态网格和扫描背景容器 |
| `db-hero-panel` | 数据库示例页面主说明和数据库路径面板 |
| `db-flow-panel` | 数据库示例页面 Route Loader / Server Function / Drizzle 链路面板 |
| `db-stat-card` | 数据库示例页面记录数、最新写入和入口统计卡片 |
| `db-mutation-panel` | 数据库示例页面写入、刷新和重置操作面板 |
| `db-records-panel` | 数据库示例页面真实 SQLite 记录列表面板 |
| `db-schema-panel` | 数据库示例页面 `todos` schema 展示面板 |
| `db-action-button` | 数据库示例页面写入、刷新和重置按钮 |
| `table-console-shell` | 表格示例页面动态网格背景容器 |
| `table-hero-panel` | 表格示例页面主说明和全局搜索面板 |
| `table-flow-panel` | 表格示例页面数据链路面板 |
| `table-stat-card` | 表格示例页面数据库统计卡片 |
| `table-form-panel` | 表格示例页面新增记录和数据操作表单 |
| `table-data-panel` | 表格示例页面 TanStack Table 数据面板 |
| `table-pagination-panel` | 表格示例页面分页控制面板 |
| `table-debug-panel` | 表格示例页面筛选状态 JSON 折叠面板 |
| `query-console-shell` | 查询示例页面动态网格背景容器 |
| `query-hero-panel` | 查询示例页面主说明面板 |
| `query-status-panel` | 查询示例页面刷新控制面板 |
| `query-stat-card` | 查询示例页面状态指标卡片 |
| `query-results-panel` | 查询示例页面真实数据结果流 |
| `query-source-panel` | 查询示例页面数据链路面板 |
| `changes-page` | 功能变更影响图页面根容器 |
| `changes-hero` | 变更影响图页面 AI 科技感首屏 |
| `changes-toolbar` | 变更筛选工具栏 |
| `changes-timeline-panel` | 变更时间线列表面板 |
| `changes-graph-panel` | 变更影响关系图容器 |
| `changes-detail-panel` | 变更详情面板 |
| `project-docs-page` | 项目文档索引页面根容器 |
| `project-docs-hero` | 项目文档索引页 AI 科技感首屏 |
| `project-docs-card` | 项目文档索引页单篇文档入口 |
| `project-doc-reader` | Markdown 详情页正文容器 |
| `project-markdown-body` | Markdown 正文排版、表格、代码块和链接样式 |

## 当前注意事项

部分 Demo 页面中仍使用 `demo-page`、`demo-panel`、`demo-input`、`demo-button` 等语义类名，但当前 `src/styles.css` 没有统一定义这些类。它们现在更像占位类名。

数据库示例、表格示例和查询示例已经分别使用 `db-*`、`table-*`、`query-*` 页面专用类承载视觉规则。后续如果多个 demo 页面出现相同视觉模式，再考虑在 `src/styles.css` 中新增一个 `@layer components`，集中定义共享类，避免每个 demo 页面重复写 Tailwind class。

## 开发方式

新增样式时按优先级选择：

1. 页面局部布局：直接使用 Tailwind utility class。
2. 多处复用的视觉模式：新增共享类。
3. 主题色、边框、背景、文字色：优先新增或复用 CSS 变量。
4. shadcn 组件相关颜色：保持 `components.json` 和 `@theme inline` 变量兼容。

不要在多个组件中复制大段复杂 class。重复出现三次以上的视觉模式，应考虑抽成共享类或组件。

## 验证清单

- 浅色、深色、auto 三种主题都检查一遍。
- 检查首页、About、四个 demo 页面。
- 首页首屏使用远程 Unsplash 图片作为背景；如果生产环境不允许外链图片，需要替换为本地静态资源。
- About 首屏使用本地 canvas 绘制动态网络背景，不依赖远程图片或新增依赖；验证时应确认桌面和移动端截图非空、文字不重叠。
- 数据库示例页面使用 CSS 动态网格背景和 `db-*` 类，不依赖远程图片或新增依赖；桌面和移动端都应确认写入表单、schema 和记录列表不溢出。
- 查询示例页面使用 CSS 动态网格背景和 `query-*` 类，不依赖远程图片或新增依赖。
- 表格示例页面使用 CSS 动态网格背景和 `table-*` 类，不依赖远程图片或新增依赖；桌面和移动端都应确认表格可横向滚动、表单不溢出。
- Docs 页面使用低速 canvas 粒子背景和 `docs-*` 类，不依赖远程图片或新增依赖；应确认粒子、数据包和扫描线不会移动过快。
- Changes 页面使用 CSS/SVG 关系图和 `changes-*` 类，不依赖远程图片或新增依赖；桌面和移动端都应确认筛选、节点、详情面板不重叠。
- Project Docs 页面使用 `project-doc-*` 和 `project-markdown-body` 类；桌面和移动端都应确认 Markdown 标题、表格、代码块、长路径和侧边目录不溢出。
- 在移动端宽度检查 Header、表格、表单是否溢出。
- 修改 `styles.css` 后运行 `npm run build`。
