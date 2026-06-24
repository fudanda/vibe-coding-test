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

## 当前注意事项

Demo 页面中使用了 `demo-page`、`demo-panel`、`demo-input`、`demo-button` 等语义类名，但当前 `src/styles.css` 没有定义这些类。它们现在更像占位类名。

如果后续要稳定 demo 页面视觉，建议在 `src/styles.css` 中新增一个 `@layer components`，集中定义这些 `demo-*` 类，避免每个 demo 页面重复写 Tailwind class。

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
- 在移动端宽度检查 Header、表格、表单是否溢出。
- 修改 `styles.css` 后运行 `npm run build`。
