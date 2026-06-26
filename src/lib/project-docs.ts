export type ProjectDocCategory =
	| "modules"
	| "changes"
	| "decisions"
	| "reviews"
	| "templates"
	| "root";

export type ProjectDoc = {
	id: string;
	path: string;
	title: string;
	category: ProjectDocCategory;
	categoryLabel: string;
	content: string;
	summary: string;
	date?: string;
};

export type ProjectDocGroup = {
	category: ProjectDocCategory;
	label: string;
	docs: ProjectDoc[];
};

const categoryLabels: Record<ProjectDocCategory, string> = {
	modules: "模块文档",
	changes: "变更记录",
	decisions: "决策记录",
	reviews: "Review 文档",
	templates: "模板",
	root: "规则文档",
};

const categoryOrder: ProjectDocCategory[] = [
	"modules",
	"changes",
	"decisions",
	"reviews",
	"templates",
	"root",
];

const rawMarkdownModules = import.meta.glob("../../docs/vibe-coding/**/*.md", {
	eager: true,
	import: "default",
	query: "?raw",
}) as Record<string, string>;

function normalizeDocPath(path: string) {
	return path
		.replace(/\\/g, "/")
		.replace(/^.*docs\/vibe-coding\//, "docs/vibe-coding/");
}

function createDocId(path: string) {
	return path
		.replace(/^docs\/vibe-coding\//, "")
		.replace(/\.md$/, "")
		.toLowerCase()
		.replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function getTitle(content: string, path: string) {
	const title = content.match(/^#\s+(.+)$/m)?.[1]?.trim();

	if (title) {
		return title;
	}

	return (
		path.split("/").at(-1)?.replace(/\.md$/, "").replace(/[-_]/g, " ") ??
		"未命名文档"
	);
}

function getSummary(content: string) {
	return (
		content
			.split(/\r?\n/)
			.map((line) => line.trim())
			.find(
				(line) =>
					line.length > 0 &&
					!line.startsWith("#") &&
					!line.startsWith("- ") &&
					!line.startsWith("```") &&
					!line.startsWith("|"),
			) ?? "暂无摘要"
	);
}

function getCategory(path: string): ProjectDocCategory {
	if (path.includes("/modules/")) {
		return "modules";
	}

	if (path.includes("/changes/")) {
		return "changes";
	}

	if (path.includes("/decisions/")) {
		return "decisions";
	}

	if (path.includes("/reviews/")) {
		return "reviews";
	}

	if (path.includes("/templates/")) {
		return "templates";
	}

	return "root";
}

function getDate(content: string, path: string) {
	return (
		content.match(/^- 日期：(.+)$/m)?.[1]?.trim() ??
		path.match(/(\d{4}-\d{2}-\d{2})/)?.[1]
	);
}

function compareDocs(left: ProjectDoc, right: ProjectDoc) {
	if (left.category === "changes" && right.category === "changes") {
		return `${right.date ?? ""}-${right.path}`.localeCompare(
			`${left.date ?? ""}-${left.path}`,
			"zh-CN",
		);
	}

	return left.title.localeCompare(right.title, "zh-CN");
}

export const projectDocs: ProjectDoc[] = Object.entries(rawMarkdownModules)
	.map(([rawPath, content]) => {
		const path = normalizeDocPath(rawPath);
		const category = getCategory(path);

		return {
			id: createDocId(path),
			path,
			title: getTitle(content, path),
			category,
			categoryLabel: categoryLabels[category],
			content,
			summary: getSummary(content),
			date: getDate(content, path),
		};
	})
	.sort((left, right) => {
		const categoryDiff =
			categoryOrder.indexOf(left.category) -
			categoryOrder.indexOf(right.category);

		return categoryDiff === 0 ? compareDocs(left, right) : categoryDiff;
	});

export const projectDocGroups: ProjectDocGroup[] = categoryOrder
	.map((category) => ({
		category,
		label: categoryLabels[category],
		docs: projectDocs.filter((doc) => doc.category === category),
	}))
	.filter((group) => group.docs.length > 0);

export function findProjectDocById(id: string) {
	return projectDocs.find((doc) => doc.id === id);
}

function normalizeRelativePath(basePath: string, href: string) {
	const baseSegments = basePath.split("/").slice(0, -1);
	const hrefSegments = href.split("/");
	const output = [...baseSegments];

	for (const segment of hrefSegments) {
		if (!segment || segment === ".") {
			continue;
		}

		if (segment === "..") {
			output.pop();
			continue;
		}

		output.push(segment);
	}

	return output.join("/");
}

export function resolveProjectDocHref(currentPath: string, href: string) {
	if (
		href.startsWith("http://") ||
		href.startsWith("https://") ||
		href.startsWith("mailto:") ||
		href.startsWith("#")
	) {
		return href;
	}

	const [pathPart, hash] = href.split("#");

	if (!pathPart.endsWith(".md")) {
		return href;
	}

	const resolvedPath = normalizeRelativePath(currentPath, pathPart);
	const targetDoc = projectDocs.find((doc) => doc.path === resolvedPath);

	if (!targetDoc) {
		return href;
	}

	return `/project-docs/${targetDoc.id}${hash ? `#${hash}` : ""}`;
}
