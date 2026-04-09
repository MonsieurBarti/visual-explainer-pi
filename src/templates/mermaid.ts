/**
 * Mermaid template for flowcharts, sequence diagrams, ER diagrams, etc.
 * Based on nicobailon/visual-explainer mermaid-flowchart.html
 */

import type { Aesthetic } from "../types.js";
import {
	FONT_PAIRINGS,
	MERMAID_SHELL_CSS,
	MERMAID_SHELL_JS,
	PALETTES,
	escapeHtml,
	generateCSSVariables,
	generateHtmlShell,
} from "./shared.js";

export interface MermaidContent {
	mermaidSyntax: string;
	caption?: string;
}

export function generateMermaidTemplate(
	title: string,
	content: MermaidContent,
	aesthetic: Aesthetic,
	isDark: boolean,
): string {
	const palette = isDark ? PALETTES[aesthetic].dark : PALETTES[aesthetic].light;
	const fonts = FONT_PAIRINGS[aesthetic];
	const cssVars = generateCSSVariables(palette, fonts, isDark);

	const mermaidTheme = generateMermaidThemeVariables(palette);
	const bodyContent = generateBody(title, content);

	return generateHtmlShell(
		title,
		bodyContent,
		aesthetic,
		cssVars,
		`${MERMAID_SHELL_CSS}${getExtraCSS()}`,
		getMermaidScript(mermaidTheme, content.mermaidSyntax),
	);
}

function generateMermaidThemeVariables(palette: { [key: string]: string }): string {
	// Convert palette to Mermaid themeVariables format
	return `
    theme: 'base',
    themeVariables: {
      primaryColor: '${palette.surface}',
      primaryTextColor: '${palette.text}',
      primaryBorderColor: '${palette.accent}',
      lineColor: '${palette.textDim}',
      secondaryColor: '${palette.surface2}',
      tertiaryColor: '${palette.surfaceElevated}',
      fontFamily: 'var(--font-mono)',
      fontSize: '14px'
    },
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
      curve: 'basis'
    },
    sequence: {
      useMaxWidth: true,
      diagramMarginX: 50,
      diagramMarginY: 10
    }
  `;
}

function generateBody(title: string, content: MermaidContent): string {
	const captionHtml = content.caption
		? `<p class="caption">${escapeHtml(content.caption)}</p>`
		: "";

	return `
<div class="container">
  <h1>${escapeHtml(title)}</h1>
  <div class="diagram-shell" style="--i:0">
    <div class="mermaid-wrap">
      <div class="zoom-controls">
        <button class="zoom-btn" data-zoom="in" title="Zoom in">+</button>
        <button class="zoom-btn" data-zoom="out" title="Zoom out">−</button>
        <button class="zoom-btn" data-zoom="reset" title="Reset">⟲</button>
        <button class="zoom-btn" data-zoom="expand" title="Open in new tab">⛶</button>
      </div>
      <div class="mermaid-viewport">
        <div class="mermaid-canvas">
          <pre class="mermaid">${content.mermaidSyntax}</pre>
        </div>
      </div>
    </div>
  </div>
  ${captionHtml}
</div>
`;
}

function getExtraCSS(): string {
	return `
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  padding: 40px;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 24px;
  text-wrap: balance;
}

.caption {
  color: var(--text-dim);
  font-size: 14px;
  margin-top: 16px;
  text-align: center;
}

/* Mermaid overrides for theming */
.mermaid .node rect,
.mermaid .node circle,
.mermaid .node ellipse,
.mermaid .node polygon {
  fill: var(--surface) !important;
  stroke: var(--accent) !important;
  stroke-width: 2px !important;
}

.mermaid .node .label {
  color: var(--text) !important;
  font-family: var(--font-mono) !important;
}

.mermaid .edgePath .path {
  stroke: var(--text-dim) !important;
  stroke-width: 2px !important;
}

.mermaid .edgeLabel {
  background: var(--surface) !important;
  color: var(--text) !important;
}

/* Responsive */
@media (max-width: 768px) {
  body { padding: 20px; }
  h1 { font-size: 24px; }
}
`;
}

function getMermaidScript(themeConfig: string, mermaidSyntax: string): string {
	return `
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
  
  mermaid.initialize({
    startOnLoad: true,
    securityLevel: 'loose',
    ${themeConfig}
  });

  ${MERMAID_SHELL_JS}

  // Initialize controls after Mermaid renders
  setTimeout(() => {
    document.querySelectorAll('.mermaid-wrap').forEach(wrap => {
      initMermaidControls(wrap);
    });
  }, 500);
</script>
`;
}
