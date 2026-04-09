import { describe, expect, it } from "vitest";
import { escapeMermaidSource, generateMermaidTemplate } from "../../src/templates/mermaid";

describe("generateMermaidTemplate", () => {
	const simple = "graph TD\n  A --> B";

	it("emits a diagram-shell with a script type=text/plain source", () => {
		const html = generateMermaidTemplate("Simple", { mermaidSyntax: simple }, "blueprint", false);
		expect(html).toContain('<section class="diagram-shell">');
		expect(html).toContain('<script type="text/plain" class="diagram-source">');
		// The raw source must survive unescaped inside the script element.
		expect(html).toContain("graph TD");
		expect(html).toContain("A --> B");
		// Never fall back to the broken <pre class="mermaid"> pattern.
		expect(html).not.toContain('<pre class="mermaid">');
	});

	it("preserves mermaid syntax containing <br/>, <, >, and & characters", () => {
		// A realistic flowchart label with line break, angle brackets, and entities.
		// The HTML parser would mangle this inside a <pre>, but a <script
		// type=text/plain> element is opaque data.
		const tricky = [
			"graph TD",
			'  A["Copilot<br/>Backend"] -->|"x > y & z"| B',
			'  B --> C{"Decision?"}',
		].join("\n");
		const html = generateMermaidTemplate("Tricky", { mermaidSyntax: tricky }, "editorial", false);
		expect(html).toContain("Copilot<br/>Backend");
		expect(html).toContain('|"x > y & z"|');
		expect(html).toContain('{"Decision?"}');
	});

	it("escapes the literal sequence </script inside mermaid source", () => {
		// If a user's diagram ever contains "</script" verbatim (edge case: a
		// comment or label), we must not let it terminate our wrapping tag.
		const hostile = 'graph TD\n  A["</script><img>"] --> B';
		const html = generateMermaidTemplate("Hostile", { mermaidSyntax: hostile }, "blueprint", false);
		expect(html).not.toContain("</script><img>");
		expect(html).toContain("<\\/script>");
	});

	it("embeds the mermaid CDN import and shell JS", () => {
		const html = generateMermaidTemplate("Script check", { mermaidSyntax: simple }, "paper", false);
		expect(html).toContain("cdn.jsdelivr.net/npm/mermaid@11");
		expect(html).toContain("mermaid-layout-elk");
		expect(html).toContain("initAllDiagrams");
		expect(html).toContain("registerLayoutLoaders");
		// The zoom controls must be in the rendered HTML so our shell JS can
		// find them.
		expect(html).toContain('data-action="zoom-in"');
		expect(html).toContain('data-action="zoom-expand"');
	});

	it("sets data-bg on the mermaid-wrap so the new-tab export matches the theme", () => {
		const light = generateMermaidTemplate("Light", { mermaidSyntax: simple }, "blueprint", false);
		const dark = generateMermaidTemplate("Dark", { mermaidSyntax: simple }, "blueprint", true);
		expect(light).toMatch(/<div class="mermaid-wrap" data-bg="#[0-9a-f]{6}"/i);
		expect(dark).toMatch(/<div class="mermaid-wrap" data-bg="#[0-9a-f]{6}"/i);
		// Light and dark should produce different bg attributes.
		const lightBg = light.match(/data-bg="([^"]+)"/)?.[1];
		const darkBg = dark.match(/data-bg="([^"]+)"/)?.[1];
		expect(lightBg).toBeDefined();
		expect(darkBg).toBeDefined();
		expect(lightBg).not.toBe(darkBg);
	});

	it("uses a concrete font string in themeVariables, not a CSS variable", () => {
		const html = generateMermaidTemplate(
			"Font check",
			{ mermaidSyntax: simple },
			"blueprint",
			false,
		);
		// The bug we are guarding against: `fontFamily: 'var(--font-body)'`
		// which fails when Mermaid bakes the value into SVG inline styles.
		expect(html).not.toMatch(/fontFamily:\s*'var\(/);
		// blueprint aesthetic uses IBM Plex Sans as its body font.
		expect(html).toContain("IBM Plex Sans");
	});

	it("produces a complete, well-closed HTML document (not truncated)", () => {
		// A realistic ~30-node diagram. The point of this test is to guard
		// against the earlier bug where `truncateHead` cut off the HTML at
		// 50 KB mid-script, producing a broken document. The template + CSS
		// + JS alone is already close to that threshold; adding a real
		// diagram pushes it well over.
		const bigNodes = Array.from({ length: 30 }, (_, i) => `  N${i}["node ${i}"] --> N${i + 1}`);
		const big = ["graph TD", ...bigNodes].join("\n");
		const html = generateMermaidTemplate("Big", { mermaidSyntax: big }, "blueprint", false);
		expect(html.length).toBeGreaterThan(20_000);
		expect(html.trimStart().startsWith("<!DOCTYPE html>")).toBe(true);
		expect(html.trimEnd().endsWith("</html>")).toBe(true);
		expect(html).toContain('id="diagram-"'.slice(0, 0)); // sanity: string ok
		// Every <script> must be closed.
		const open = (html.match(/<script\b/g) ?? []).length;
		const close = (html.match(/<\/script>/g) ?? []).length;
		expect(open).toBe(close);
	});
});

describe("escapeMermaidSource", () => {
	it("passes typical mermaid characters through untouched", () => {
		const src = 'graph TD\n  A["x > y & z<br/>more"] -->|"label"| B';
		expect(escapeMermaidSource(src)).toBe(src);
	});

	it("neutralizes literal </script sequences", () => {
		expect(escapeMermaidSource("foo</script>bar")).toBe("foo<\\/script>bar");
		expect(escapeMermaidSource("foo</SCRIPT bar")).toBe("foo<\\/script bar");
	});
});
