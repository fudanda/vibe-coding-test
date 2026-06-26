import { describe, expect, it } from "vitest";
import { renderMarkdown } from "./markdown";

describe("renderMarkdown", () => {
	it("extracts heading ids from the rendered markup", async () => {
		const result = await renderMarkdown(`
# 文档

## a_b \`c\`

## 重复标题

## 重复标题
`);

		expect(result.headings).toHaveLength(4);

		for (const heading of result.headings) {
			expect(result.markup).toContain(`id="${heading.id}"`);
			expect(heading.text).not.toBe("");
		}
	});
});
