import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, FileText, ListTree } from "lucide-react";
import { useMemo } from "react";
import { Markdown } from "../components/Markdown";
import { renderMarkdown } from "../lib/markdown";
import {
	findProjectDocById,
	projectDocGroups,
	resolveProjectDocHref,
} from "../lib/project-docs";

export const Route = createFileRoute("/project-docs/$docId")({
	loader: async ({ params }) => {
		const doc = findProjectDocById(params.docId);

		if (!doc) {
			throw notFound();
		}

		return {
			doc,
			headings: (await renderMarkdown(doc.content)).headings,
		};
	},
	component: ProjectDocDetail,
});

function ProjectDocDetail() {
	const { doc, headings } = Route.useLoaderData();
	const relatedDocs = useMemo(
		() =>
			projectDocGroups
				.find((group) => group.category === doc.category)
				?.docs.filter((item) => item.id !== doc.id)
				.slice(0, 6) ?? [],
		[doc],
	);

	return (
		<main className="project-doc-detail-page">
			<section className="project-doc-detail-hero">
				<div className="page-wrap px-4 py-10">
					<Link to="/project-docs" className="project-doc-back-link">
						<ArrowLeft size={18} aria-hidden="true" />
						返回项目文档
					</Link>
					<p className="island-kicker mt-8 mb-3">{doc.categoryLabel}</p>
					<h1 className="display-title m-0 max-w-4xl text-4xl font-bold leading-tight text-[#d9fff7] sm:text-6xl">
						{doc.title}
					</h1>
					<p className="mt-5 max-w-3xl text-base leading-8 text-[rgba(216,255,247,0.74)]">
						{doc.summary}
					</p>
				</div>
			</section>

			<section className="page-wrap grid gap-5 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
				<article className="project-doc-reader">
					<div className="project-doc-reader-meta">
						<FileText size={18} aria-hidden="true" />
						<code>{doc.path}</code>
					</div>
					<Markdown
						content={doc.content}
						className="project-markdown-body prose"
						resolveHref={(href) => resolveProjectDocHref(doc.path, href)}
					/>
				</article>

				<aside className="project-doc-aside">
					<section className="project-doc-aside-panel">
						<div className="project-doc-aside-title">
							<ListTree size={18} aria-hidden="true" />
							<strong>页面目录</strong>
						</div>
						{headings.length === 0 ? (
							<p>当前文档没有标题目录。</p>
						) : (
							<nav aria-label="当前文档目录">
								{headings.slice(0, 12).map((heading) => (
									<a
										key={`${heading.id}-${heading.text}`}
										href={`#${heading.id}`}
										style={{
											paddingLeft: `${Math.max(0, heading.level - 1) * 0.7}rem`,
										}}
									>
										{heading.text}
									</a>
								))}
							</nav>
						)}
					</section>

					<section className="project-doc-aside-panel">
						<div className="project-doc-aside-title">
							<FileText size={18} aria-hidden="true" />
							<strong>同类文档</strong>
						</div>
						<div className="project-doc-related">
							{relatedDocs.map((item) => (
								<Link
									key={item.id}
									to="/project-docs/$docId"
									params={{ docId: item.id }}
								>
									{item.title}
								</Link>
							))}
						</div>
					</section>
				</aside>
			</section>
		</main>
	);
}
