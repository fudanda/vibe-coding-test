import { createFileRoute, Link } from "@tanstack/react-router";
import {
	BookOpenText,
	CalendarDays,
	FileClock,
	FileText,
	Layers3,
	LibraryBig,
	Sparkles,
} from "lucide-react";
import { projectDocGroups, projectDocs } from "../lib/project-docs";

export const Route = createFileRoute("/project-docs/")({
	component: ProjectDocsIndex,
});

const featuredCategories = [
	["模块文档", "描述当前实现事实和扩展方式"],
	["变更记录", "记录为什么改、改了什么和如何验证"],
	["决策记录", "沉淀重要技术取舍和回看条件"],
];

function ProjectDocsIndex() {
	const moduleCount =
		projectDocGroups.find((group) => group.category === "modules")?.docs
			.length ?? 0;
	const changeCount =
		projectDocGroups.find((group) => group.category === "changes")?.docs
			.length ?? 0;

	return (
		<main className="project-docs-page">
			<section className="project-docs-hero">
				<div className="page-wrap grid gap-8 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
					<div>
						<p className="island-kicker mb-3">Markdown Docs</p>
						<h1 className="display-title mb-5 text-5xl font-bold leading-tight text-[#d9fff7] sm:text-6xl">
							项目文档，现在可以直接阅读。
						</h1>
						<p className="m-0 max-w-2xl text-base leading-8 text-[rgba(216,255,247,0.74)] sm:text-lg">
							模块文档、变更记录、ADR 和 Review 说明都来自仓库内
							Markdown。页面会自动生成索引，并用统一渲染管线展示内容。
						</p>
					</div>

					<aside className="project-docs-orbit" aria-label="项目文档统计">
						<div className="project-docs-orbit-core">
							<LibraryBig size={30} aria-hidden="true" />
							<strong>{projectDocs.length}</strong>
							<span>Markdown 文件</span>
						</div>
						<div className="project-docs-orbit-node node-a">
							<Layers3 size={18} aria-hidden="true" />
							<span>{moduleCount} 个模块</span>
						</div>
						<div className="project-docs-orbit-node node-b">
							<FileClock size={18} aria-hidden="true" />
							<span>{changeCount} 条变更</span>
						</div>
						<div className="project-docs-orbit-node node-c">
							<Sparkles size={18} aria-hidden="true" />
							<span>统一渲染</span>
						</div>
					</aside>
				</div>
			</section>

			<section className="page-wrap px-4 py-12">
				<div className="project-docs-feature-grid">
					{featuredCategories.map(([title, desc]) => (
						<article key={title} className="project-docs-feature">
							<Sparkles size={18} aria-hidden="true" />
							<strong>{title}</strong>
							<span>{desc}</span>
						</article>
					))}
				</div>

				<div className="project-docs-groups">
					{projectDocGroups.map((group) => (
						<section key={group.category} className="project-docs-group">
							<div className="project-docs-group-head">
								<div>
									<p className="island-kicker mb-2">{group.category}</p>
									<h2>{group.label}</h2>
								</div>
								<span>{group.docs.length} 篇</span>
							</div>

							<div className="project-docs-card-grid">
								{group.docs.map((doc) => (
									<Link
										key={doc.id}
										to="/project-docs/$docId"
										params={{ docId: doc.id }}
										className="project-docs-card"
									>
										<div className="project-docs-card-icon">
											{doc.category === "changes" ? (
												<CalendarDays size={20} aria-hidden="true" />
											) : doc.category === "modules" ? (
												<BookOpenText size={20} aria-hidden="true" />
											) : (
												<FileText size={20} aria-hidden="true" />
											)}
										</div>
										<strong>{doc.title}</strong>
										<p>{doc.summary}</p>
										<code>{doc.path}</code>
									</Link>
								))}
							</div>
						</section>
					))}
				</div>
			</section>
		</main>
	);
}
