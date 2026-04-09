import { describe, expect, it } from "vitest";
import { SHARED_CSS, escapeHtml, generateCSSVariables } from "../../src/templates/shared";

describe("escapeHtml", () => {
	it("should escape HTML special characters", () => {
		expect(escapeHtml("<script>alert('xss')</script>")).toBe(
			"&lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;",
		);
	});

	it("should escape ampersands", () => {
		expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
	});

	it("should escape quotes", () => {
		expect(escapeHtml('Say "hello"')).toBe("Say &quot;hello&quot;");
	});
});

describe("SHARED_CSS", () => {
	it("should contain animation keyframes", () => {
		expect(SHARED_CSS).toContain("@keyframes fadeUp");
	});

	it("should contain reduced motion support", () => {
		expect(SHARED_CSS).toContain("prefers-reduced-motion");
	});

	it("should contain section styles", () => {
		expect(SHARED_CSS).toContain(".section");
		expect(SHARED_CSS).toContain(".section-label");
	});
});

describe("generateCSSVariables", () => {
	const mockPalette = {
		bg: "#faf7f5",
		surface: "#ffffff",
		surface2: "#f5f0ec",
		surfaceElevated: "#fff9f5",
		border: "rgba(0,0,0,0.07)",
		borderBright: "rgba(0,0,0,0.14)",
		text: "#292017",
		textDim: "#8a7e72",
		accent: "#c2410c",
		accentDim: "rgba(194,65,12,0.07)",
		green: "#4d7c0f",
		greenDim: "rgba(77,124,15,0.07)",
		orange: "#b45309",
		orangeDim: "rgba(180,83,9,0.07)",
		teal: "#0f766e",
		tealDim: "rgba(15,118,110,0.07)",
		plum: "#9f1239",
		plumDim: "rgba(159,18,57,0.07)",
	};

	const mockFonts = { body: "'Test Sans'", mono: "'Test Mono'" };

	it("should generate :root block for light theme", () => {
		const css = generateCSSVariables(mockPalette, mockFonts, false);
		expect(css).toContain(":root {");
		expect(css).toContain("--bg: #faf7f5");
		expect(css).toContain("--font-body: 'Test Sans'");
	});

	it("should generate media query for dark theme", () => {
		const css = generateCSSVariables(mockPalette, mockFonts, true);
		expect(css).toContain("@media (prefers-color-scheme: dark)");
	});
});
