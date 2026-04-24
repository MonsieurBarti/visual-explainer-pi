import { describe, expect, it } from "vitest";
import {
	normalizeArchitectureContent,
	normalizeArchitectureSection,
	normalizeTableContent,
	markdownToInnerCards,
} from "../../src/utils/normalizers";

// ── normalizeArchitectureContent ─────────────────────────────────────────────

describe("normalizeArchitectureContent", () => {
	describe("structured {sections} input (the bug-fix case)", () => {
		it("should normalize {sections: [{title, description, items: string[]}]}", () => {
			const result = normalizeArchitectureContent({
				sections: [
					{
						title: "Frontend",
						description: "Portal applications",
						items: ["Next.js Portal", "React Components", "TailwindCSS"],
					},
					{
						title: "Backend",
						description: "Core services",
						items: ["Temporal Workflows", "GraphQL API"],
					},
				],
			});

			expect(result.sections).toHaveLength(2);
			expect(result.sections[0]!.label).toBe("Frontend");
			expect(result.sections[0]!.content).toContain("Portal applications");
			expect(result.sections[0]!.content).toContain("Next.js Portal");
			expect(result.sections[0]!.content).toContain("React Components");
			expect(result.sections[0]!.content).toContain("TailwindCSS");
			expect(result.sections[0]!.isHero).toBe(true);

			expect(result.sections[1]!.label).toBe("Backend");
			expect(result.sections[1]!.content).toContain("Core services");
			expect(result.sections[1]!.isHero).toBe(false);
		});

		it("should normalize {sections: [{title, items: [{name, detail}]}]}", () => {
			const result = normalizeArchitectureContent({
				sections: [
					{
						title: "Services",
						items: [
							{ name: "Auth", detail: "OAuth2 + OIDC" },
							{ name: "Gateway", description: "API gateway" },
						],
					},
				],
			});

			expect(result.sections).toHaveLength(1);
			expect(result.sections[0]!.content).toContain("Auth");
			expect(result.sections[0]!.content).toContain("OAuth2");
			expect(result.sections[0]!.content).toContain("Gateway");
			expect(result.sections[0]!.content).toContain("API gateway");
		});

		it("should pass through flowArrows when present", () => {
			const arrows = [{ from: 0, to: 1, label: "calls" }];
			const result = normalizeArchitectureContent({
				sections: [{ title: "A", items: ["x"] }],
				flowArrows: arrows,
			});
			expect(result.flowArrows).toEqual(arrows);
		});

		it("should handle sections with pre-built HTML content", () => {
			const result = normalizeArchitectureContent({
				sections: [
					{
						label: "Ready",
						content: '<div class="custom">Already HTML</div>',
					},
				],
			});
			expect(result.sections[0]!.label).toBe("Ready");
			expect(result.sections[0]!.content).toContain("Already HTML");
		});
	});

	describe("markdown string input", () => {
		it("should parse ## headings into sections", () => {
			const md = "## Database\n- PostgreSQL\n- Redis\n\n## API\nGraphQL endpoint";
			const result = normalizeArchitectureContent(md);

			expect(result.sections).toHaveLength(2);
			expect(result.sections[0]!.label).toBe("Database");
			expect(result.sections[0]!.content).toContain("PostgreSQL");
			expect(result.sections[1]!.label).toBe("API");
		});

		it("should wrap plain string as single section", () => {
			const result = normalizeArchitectureContent("Just a simple description");
			expect(result.sections).toHaveLength(1);
			expect(result.sections[0]!.label).toBe("Overview");
			expect(result.sections[0]!.content).toContain("Just a simple description");
		});
	});

	describe("edge cases", () => {
		it("should handle null/undefined gracefully", () => {
			const result = normalizeArchitectureContent(null);
			expect(result.sections).toHaveLength(1);
			expect(result.sections[0]!.label).toBe("Content");
		});

		it("should handle empty sections array", () => {
			const result = normalizeArchitectureContent({ sections: [] });
			expect(result.sections).toHaveLength(0);
		});

		it("should handle stringified JSON", () => {
			const json = JSON.stringify({
				sections: [{ label: "Test", content: "<div>hi</div>" }],
			});
			const result = normalizeArchitectureContent(json);
			expect(result.sections).toHaveLength(1);
		});
	});
});

// ── normalizeArchitectureSection ─────────────────────────────────────────────

describe("normalizeArchitectureSection", () => {
	it("should accept title as alias for label", () => {
		const section = normalizeArchitectureSection({ title: "My Title" }, 0);
		expect(section.label).toBe("My Title");
	});

	it("should cycle label colors based on index", () => {
		const s0 = normalizeArchitectureSection({ title: "A" }, 0);
		const s1 = normalizeArchitectureSection({ title: "B" }, 1);
		const s2 = normalizeArchitectureSection({ title: "C" }, 2);
		expect(s0.labelColor).toBe("accent");
		expect(s1.labelColor).toBe("green");
		expect(s2.labelColor).toBe("orange");
	});

	it("should respect explicit labelColor", () => {
		const section = normalizeArchitectureSection(
			{ title: "X", labelColor: "plum" },
			0,
		);
		expect(section.labelColor).toBe("plum");
	});

	it("should mark first section (index 0) as hero", () => {
		expect(normalizeArchitectureSection({ title: "A" }, 0).isHero).toBe(true);
		expect(normalizeArchitectureSection({ title: "B" }, 1).isHero).toBe(false);
	});

	it("should convert string items into inner-card HTML", () => {
		const section = normalizeArchitectureSection(
			{ title: "Stack", items: ["React", "Node.js"] },
			0,
		);
		expect(section.content).toContain("inner-card");
		expect(section.content).toContain("React");
		expect(section.content).toContain("Node.js");
	});

	it("should convert object items with name/detail", () => {
		const section = normalizeArchitectureSection(
			{
				title: "Stack",
				items: [{ name: "DB", detail: "PostgreSQL 16" }],
			},
			0,
		);
		expect(section.content).toContain("DB");
		expect(section.content).toContain("PostgreSQL 16");
	});

	it("should prepend description as callout", () => {
		const section = normalizeArchitectureSection(
			{ title: "Foo", description: "Important note", items: ["bar"] },
			0,
		);
		expect(section.content).toContain("Important note");
		expect(section.content.indexOf("Important note")).toBeLessThan(
			section.content.indexOf("bar"),
		);
	});

	it("should escape HTML in items", () => {
		const section = normalizeArchitectureSection(
			{ title: "XSS", items: ["<script>alert(1)</script>"] },
			0,
		);
		expect(section.content).toContain("&lt;script&gt;");
		expect(section.content).not.toContain("<script>");
	});
});

// ── normalizeTableContent ────────────────────────────────────────────────────

describe("normalizeTableContent", () => {
	it("should pass through already-structured content", () => {
		const input = {
			columns: [{ key: "name", header: "Name" }],
			rows: [{ name: "Alice" }],
		};
		const result = normalizeTableContent(input);
		expect(result).toBe(input); // same reference
	});

	it("should derive columns from flat row array", () => {
		const result = normalizeTableContent([
			{ name: "Alice", age: 30 },
			{ name: "Bob", age: 25 },
		]);

		expect(result.columns).toHaveLength(2);
		expect(result.columns[0]!.key).toBe("name");
		expect(result.columns[0]!.header).toBe("Name");
		expect(result.columns[1]!.key).toBe("age");
		expect(result.columns[1]!.header).toBe("Age");
		expect(result.rows).toHaveLength(2);
		expect(result.rows[0]!.name).toBe("Alice");
		expect(result.rows[0]!.age).toBe("30");
	});

	it("should convert camelCase keys to Title Case headers", () => {
		const result = normalizeTableContent([{ firstName: "Jo", lastName: "Doe" }]);
		expect(result.columns[0]!.header).toBe("First Name");
		expect(result.columns[1]!.header).toBe("Last Name");
	});

	it("should preserve status objects in cells", () => {
		const result = normalizeTableContent([
			{ status: { value: "OK", status: "success" } },
		]);
		expect(result.rows[0]!.status).toEqual({ value: "OK", status: "success" });
	});

	it("should parse pipe-delimited markdown table string", () => {
		const md = "Name | Age\n---|---\nAlice | 30\nBob | 25";
		const result = normalizeTableContent(md);

		expect(result.columns).toHaveLength(2);
		expect(result.columns[0]!.header).toBe("Name");
		expect(result.rows).toHaveLength(2);
		expect(result.rows[0]!.col0).toBe("Alice");
	});

	it("should parse stringified JSON array", () => {
		const json = JSON.stringify([{ x: 1 }, { x: 2 }]);
		const result = normalizeTableContent(json);
		expect(result.columns[0]!.key).toBe("x");
		expect(result.rows).toHaveLength(2);
	});

	it("should handle null gracefully", () => {
		const result = normalizeTableContent(null);
		expect(result.columns).toHaveLength(1);
		expect(result.rows).toHaveLength(1);
	});

	it("should collect keys across rows with different shapes", () => {
		const result = normalizeTableContent([
			{ a: 1 },
			{ a: 2, b: 3 },
		]);
		expect(result.columns).toHaveLength(2);
		expect(result.rows[0]!.b).toBe("");
	});
});

// ── markdownToInnerCards ─────────────────────────────────────────────────────

describe("markdownToInnerCards", () => {
	it("should convert bullet list to node-list", () => {
		const html = markdownToInnerCards("- Alpha\n- Beta");
		expect(html).toContain("<ul");
		expect(html).toContain("Alpha");
		expect(html).toContain("Beta");
	});

	it("should convert plain lines to inner-cards", () => {
		const html = markdownToInnerCards("Hello world");
		expect(html).toContain("inner-card");
		expect(html).toContain("Hello world");
	});

	it("should handle mixed bullets and paragraphs", () => {
		const html = markdownToInnerCards("Intro\n\n- Item 1\n- Item 2\n\nConclusion");
		expect(html).toContain("Intro");
		expect(html).toContain("Item 1");
		expect(html).toContain("Conclusion");
	});
});
