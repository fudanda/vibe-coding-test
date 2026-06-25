# UI 组件模块

## 模块目标

UI 组件模块提供应用级公共组件，包括顶部导航、页脚和主题切换。它们直接影响所有页面的一致性、可访问性和移动端体验。

## 关键文件

- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/components/ThemeToggle.tsx`

## Header

`Header` 是 sticky 顶部导航，包含：

- 品牌入口：`TanStack Start`
- 页面导航：`首页`、`关于`
- 本地文档入口：`文档` -> `/docs`
- Demo 下拉入口：`表格示例`、`状态示例`、`查询示例`、`数据库示例`
- 外部社交链接：X、GitHub
- 主题切换：`ThemeToggle`

站内导航使用 TanStack Router 的 `Link`，并通过 `activeProps` 设置激活态。

Demo 下拉当前使用原生 `<details>` 和 `<summary>`，不依赖额外组件库。它在移动端占整行，在桌面端作为右对齐浮层。

## Footer

`Footer` 显示当前年份、版权占位文案、Built with TanStack Start 文案和社交链接。

年份通过 `new Date().getFullYear()` 动态生成。正式项目中需要把 `Your name here` 替换为真实主体。

## ThemeToggle

`ThemeToggle` 支持三种模式：

- `light`
- `dark`
- `auto`

模式保存在 `window.localStorage.theme`。`auto` 模式会监听 `prefers-color-scheme`，跟随系统深浅色变化。

主题应用逻辑：

1. 移除 `document.documentElement` 上已有的 `light` / `dark`。
2. 根据当前模式添加解析后的主题类。
3. 非 `auto` 模式写入 `data-theme`。
4. 设置 `document.documentElement.style.colorScheme`。

## 开发方式

新增导航项时：

1. 如果是站内路由，使用 `Link`。
2. 如果是外链，使用 `<a>` 并补齐安全属性。
3. 如果页面应出现在 demo 下拉中，保持同一组视觉样式。
4. 移动端检查换行和下拉宽度。

修改主题切换时：

- 保持 `ThemeMode` 类型与 `THEME_INIT_SCRIPT` 支持的值一致。
- 同步检查 `src/routes/__root.tsx` 中的首屏主题初始化脚本。
- 不要在 SSR 阶段直接访问 `window`。

## 可访问性要求

- 图标链接必须保留 `sr-only` 文本。
- 主题按钮必须保留 `aria-label` 和 `title`。
- 下拉菜单的点击目标要在移动端可触达。
- Header sticky 后不能遮挡页面关键内容。

## 验证清单

- 点击首页、关于、各示例入口，确认导航成功。
- 在桌面和窄屏下检查 Header 是否换行正常。
- 连续点击 ThemeToggle，确认 `Light -> Dark -> Auto` 循环正确。
- 刷新页面后检查主题是否保持。
