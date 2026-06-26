import parse, {
	domToReact,
	Element,
	type HTMLReactParserOptions,
} from "html-react-parser";
import { useEffect, useState } from "react";
import { type MarkdownResult, renderMarkdown } from "../lib/markdown";

type MarkdownProps = {
	content: string;
	className?: string;
	resolveHref?: (href: string) => string;
};

const urlProtocolPattern = /^([a-z][a-z0-9+.-]*):/i;

type MarkdownUrlKind = "link" | "image";

export function sanitizeMarkdownUrl(
	url: string | undefined,
	kind: MarkdownUrlKind = "link",
) {
	if (!url) {
		return undefined;
	}

	const trimmedUrl = url.trim();

	if (!trimmedUrl || hasControlCharacter(trimmedUrl)) {
		return undefined;
	}

	if (trimmedUrl.startsWith("//")) {
		return undefined;
	}

	const protocol = trimmedUrl.match(urlProtocolPattern)?.[1]?.toLowerCase();

	if (!protocol) {
		return trimmedUrl;
	}

	if (protocol === "http" || protocol === "https") {
		return trimmedUrl;
	}

	if (kind === "link" && protocol === "mailto") {
		return trimmedUrl;
	}

	return undefined;
}

function hasControlCharacter(value: string) {
	return [...value].some((character) => {
		const codePoint = character.codePointAt(0) ?? 0;

		return codePoint < 32 || codePoint === 127;
	});
}

export function Markdown({ content, className, resolveHref }: MarkdownProps) {
	const [result, setResult] = useState<MarkdownResult | null>(null);

	useEffect(() => {
		let ignore = false;

		setResult(null);
		renderMarkdown(content).then((nextResult) => {
			if (!ignore) {
				setResult(nextResult);
			}
		});

		return () => {
			ignore = true;
		};
	}, [content]);

	if (!result) {
		return <div className={className}>正在渲染 Markdown...</div>;
	}

	const options: HTMLReactParserOptions = {
		replace: (domNode) => {
			if (!(domNode instanceof Element)) {
				return undefined;
			}

			if (domNode.name === "a") {
				const rawHref = domNode.attribs.href;
				const href = sanitizeMarkdownUrl(
					rawHref && resolveHref ? resolveHref(rawHref) : rawHref,
				);
				const isExternal =
					typeof href === "string" && /^https?:\/\//.test(href);
				const { href: _rawHref, ...safeAttribs } = domNode.attribs;

				return (
					<a
						{...safeAttribs}
						href={href}
						rel={isExternal ? "noreferrer" : domNode.attribs.rel}
						target={isExternal ? "_blank" : domNode.attribs.target}
					>
						{domToReact(domNode.children, options)}
					</a>
				);
			}

			if (domNode.name === "img") {
				const src = sanitizeMarkdownUrl(domNode.attribs.src, "image");
				const { src: _rawSrc, ...safeAttribs } = domNode.attribs;

				return (
					<img
						{...safeAttribs}
						alt={domNode.attribs.alt ?? ""}
						loading="lazy"
						src={src}
					/>
				);
			}

			return undefined;
		},
	};

	return <div className={className}>{parse(result.markup, options)}</div>;
}
