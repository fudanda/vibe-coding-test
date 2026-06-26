import { describe, expect, it } from "vitest";
import { sanitizeMarkdownUrl } from "./Markdown";

describe("sanitizeMarkdownUrl", () => {
	it("rejects scriptable and protocol-relative urls", () => {
		expect(sanitizeMarkdownUrl("javascript:alert(1)")).toBeUndefined();
		expect(sanitizeMarkdownUrl("data:text/html,<svg>")).toBeUndefined();
		expect(sanitizeMarkdownUrl("vbscript:msgbox(1)")).toBeUndefined();
		expect(sanitizeMarkdownUrl("//example.com/file.md")).toBeUndefined();
	});

	it("allows safe document links", () => {
		expect(sanitizeMarkdownUrl("#section")).toBe("#section");
		expect(sanitizeMarkdownUrl("./modules/project-docs.md")).toBe(
			"./modules/project-docs.md",
		);
		expect(sanitizeMarkdownUrl("/project-docs/modules-project-docs")).toBe(
			"/project-docs/modules-project-docs",
		);
		expect(sanitizeMarkdownUrl("https://example.com/docs")).toBe(
			"https://example.com/docs",
		);
		expect(sanitizeMarkdownUrl("mailto:team@example.com")).toBe(
			"mailto:team@example.com",
		);
	});

	it("does not allow mailto or data urls for images", () => {
		expect(
			sanitizeMarkdownUrl("mailto:team@example.com", "image"),
		).toBeUndefined();
		expect(
			sanitizeMarkdownUrl("data:image/svg+xml,<svg></svg>", "image"),
		).toBeUndefined();
		expect(sanitizeMarkdownUrl("/images/doc.png", "image")).toBe(
			"/images/doc.png",
		);
	});
});
