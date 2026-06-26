# 新增项目文档 Markdown 渲染模块

- 日期：2026-06-26
- 作者：fudanda
- AI 协助：Codex 用于官方文档对齐、实现、模块文档同步和验证整理。
- Token 消耗：未记录（当前规则不使用 Codex goal 统计）
- Review：AI：Codex/code-reviewer（提交准备线程发现 Markdown 危险协议链接阻塞问题；已修复并补充测试，复查无剩余阻塞）
- PR：未创建
- Commit：待独立提交准备线程本地提交
- 影响模块：`src/routes/project-docs.tsx`、`src/routes/project-docs.index.tsx`、`src/routes/project-docs.$docId.tsx`、`src/components/Markdown.tsx`、`src/components/Markdown.test.ts`、`src/lib/markdown.ts`、`src/lib/markdown.test.ts`、`src/lib/project-docs.ts`、`src/components/Header.tsx`、`src/routes/docs.tsx`、`src/styles.css`、`package.json`、`package-lock.json`、`docs/vibe-coding/modules/*.md`
- 类型：feature

## 为什么改

现有 `/docs` 页面主要是本地文档入口，模块文档和变更记录仍需要在文件系统中打开。团队需要一个真正的项目文档模块，用 Markdown 渲染方式在应用内浏览模块文档、变更记录、ADR、Review 说明和模板。

## 改了什么

- 新增 `/project-docs` 项目文档索引页，按模块文档、变更记录、决策记录、Review 文档、模板和规则文档分组。
- 新增 `/project-docs/$docId` Markdown 详情页，展示正文、页面目录和同类文档。
- 将项目文档路由拆成父布局 `src/routes/project-docs.tsx`、索引页 `src/routes/project-docs.index.tsx` 和详情页 `src/routes/project-docs.$docId.tsx`，确保嵌套详情路由能正常渲染。
- 新增 `src/lib/project-docs.ts`，使用 Vite `import.meta.glob` 收集 `docs/vibe-coding/**/*.md`。
- 新增 `src/lib/markdown.ts` 和 `src/components/Markdown.tsx`，使用 unified 体系渲染 Markdown。
- Markdown 链接和图片 URL 增加协议白名单，过滤 `javascript:`、`data:`、`vbscript:` 和协议相对 URL；外链继续自动加 `target="_blank"` 和 `rel="noreferrer"`。
- 页面目录改为从 `rehype-slug` 渲染后的标题 `id` 回读，避免自定义 slug 和正文锚点不一致。
- 新增 Markdown 渲染和 URL 安全边界测试。
- Header 和 `/docs` 页面新增“项目文档”入口。
- 新增 `project-doc-*` 和 `project-markdown-body` 样式，支持 Markdown 正文、表格、代码块和移动端阅读。
- 安装 Markdown 渲染依赖：`unified`、`remark-parse`、`remark-gfm`、`remark-rehype`、`rehype-slug`、`rehype-autolink-headings`、`rehype-stringify`、`html-react-parser`。
- 同步新增项目文档模块文档，并更新路由、样式、UI 组件和工程化模块文档。

## 模块文档同步

- [ ] 不需要，原因：
- [x] 已更新：`docs/vibe-coding/modules/project-docs.md`
- [x] 已更新：`docs/vibe-coding/modules/README.md`
- [x] 已更新：`docs/vibe-coding/modules/routing-pages.md`
- [x] 已更新：`docs/vibe-coding/modules/styling-theme.md`
- [x] 已更新：`docs/vibe-coding/modules/ui-components.md`
- [x] 已更新：`docs/vibe-coding/modules/environment-tooling.md`

## 验证方式

- 已执行：`npx biome check src\lib\markdown.ts src\lib\project-docs.ts src\components\Markdown.tsx src\routes\project-docs.tsx src\routes\project-docs.index.tsx 'src\routes\project-docs.$docId.tsx' src\components\Header.tsx src\routes\docs.tsx --max-diagnostics=120`，通过。
- 已执行：`npx biome check src\lib\markdown.ts src\lib\markdown.test.ts src\lib\project-docs.ts src\components\Markdown.tsx src\components\Markdown.test.ts src\routes\project-docs.tsx src\routes\project-docs.index.tsx 'src\routes\project-docs.$docId.tsx' src\components\Header.tsx src\routes\docs.tsx --max-diagnostics=120`，通过。
- 已执行：`npx vitest run src\lib\markdown.test.ts src\components\Markdown.test.ts`，2 个测试文件 4 条用例通过。
- 已执行：`git diff --check`，通过；仅输出 Windows LF/CRLF 提示。
- 已执行：`npm run build`，通过。Vite 提示存在超过 500 kB 的 client chunk，原因是当前 v1 把本地 Markdown 构建进应用包；作为后续优化项记录。
- 已执行：`npm run check`，未通过。失败项来自现有全仓 Biome 配置/格式问题，包括 `biome.json` schema 版本提示、既有文件格式化差异、`src/routes/__root.tsx` 的 `dangerouslySetInnerHTML` 规则、`src/db/index.ts` 的非空断言和 `src/router.tsx` 未使用导入；本次新增和修改的目标文件已通过上面的定向 Biome 检查。
- 已执行：`Invoke-WebRequest http://127.0.0.1:4174/project-docs`，返回 200，包含“项目文档，现在可以直接阅读”。
- 已执行：`Invoke-WebRequest http://127.0.0.1:4174/project-docs/modules-project-docs`，返回 200，包含“项目文档模块”和 `project-markdown-body`。
- 已执行：浏览器访问 `http://127.0.0.1:4174/project-docs`，确认导航 active 为“项目文档”、卡片数量 62、包含模块文档和变更记录、无横向溢出、无控制台错误。
- 已执行：浏览器访问 `http://127.0.0.1:4174/project-docs/modules-project-docs`，确认 Markdown H1、8 个二级标题、1 个表格、9 个目录链接、6 个同类文档链接正常渲染，无控制台错误。
- 已执行：浏览器 390px 移动端视口检查详情页，确认正文和 reader 无横向溢出。

## 风险和后续事项

- 当前使用 `import.meta.glob` 构建时收集 Markdown；新增或删除文档后需要重新构建。
- 当前未引入 `content-collections`，如果后续需要更强的 frontmatter schema 和类型生成，可升级。
- `package-lock.json` 因新增 Markdown 依赖和 npm lockfile 重算变动较大；提交前已按 diff 范围确认未出现无关源码文件。
- `npm install` 后出现 4 个 moderate audit 提示；本次未执行 `npm audit fix --force`，避免引入破坏性升级。
- AI Review 原始阻塞问题已处理；剩余后续项是 Markdown 内容增长后的客户端包体优化和更完整的浏览器截图归档。

## 决策记录

- [x] 不需要新增 ADR，原因：本次是本地文档浏览能力增强，未引入需要长期取舍的架构决策。
- [ ] 已新增：
