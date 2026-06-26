import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export type MarkdownHeading = {
	id: string;
	text: string;
	level: number;
};

export type MarkdownResult = {
	markup: string;
	headings: MarkdownHeading[];
};

const renderedHeadingPattern =
	/<h([1-6])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;

function decodeHtmlEntities(text: string) {
	return text
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'");
}

function stripHtmlTags(markup: string) {
	return decodeHtmlEntities(markup.replace(/<[^>]*>/g, "")).trim();
}

function extractRenderedHeadings(markup: string) {
	const headings: MarkdownHeading[] = [];

	for (const match of markup.matchAll(renderedHeadingPattern)) {
		const level = Number(match[1]);
		const id = decodeHtmlEntities(match[2]);
		const text = stripHtmlTags(match[3]);

		if (!id || !text) {
			continue;
		}

		headings.push({
			id,
			text,
			level,
		});
	}

	return headings;
}

export async function renderMarkdown(content: string): Promise<MarkdownResult> {
	const result = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkRehype)
		.use(rehypeSlug)
		.use(rehypeAutolinkHeadings, {
			behavior: "wrap",
			properties: { className: ["markdown-anchor"] },
		})
		.use(rehypeStringify)
		.process(content);
	const markup = String(result);

	return {
		markup,
		headings: extractRenderedHeadings(markup),
	};
}
