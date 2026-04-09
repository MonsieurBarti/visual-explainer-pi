/**
 * Shared CSS variables, animations, and utilities for all templates
 * Based on nicobailon/visual-explainer design system
 */

import type { Aesthetic, FontPairing, Palette } from "../types.js";

// Font pairings - distinctive combinations (never Inter as primary)
export const FONT_PAIRINGS: Record<Aesthetic, FontPairing> = {
	blueprint: {
		body: "'IBM Plex Sans', system-ui, sans-serif",
		mono: "'IBM Plex Mono', 'SF Mono', Consolas, monospace",
	},
	editorial: {
		body: "'Instrument Serif', Georgia, serif",
		mono: "'JetBrains Mono', 'SF Mono', Consolas, monospace",
	},
	paper: {
		body: "'Bricolage Grotesque', system-ui, sans-serif",
		mono: "'Fragment Mono', 'SF Mono', Consolas, monospace",
	},
	terminal: {
		body: "'JetBrains Mono', 'SF Mono', Consolas, monospace",
		mono: "'JetBrains Mono', 'SF Mono', Consolas, monospace",
	},
	dracula: {
		body: "'DM Sans', system-ui, sans-serif",
		mono: "'Fira Code', 'SF Mono', Consolas, monospace",
	},
	nord: {
		body: "'Plus Jakarta Sans', system-ui, sans-serif",
		mono: "'Azeret Mono', 'SF Mono', Consolas, monospace",
	},
	solarized: {
		body: "'IBM Plex Sans', system-ui, sans-serif",
		mono: "'IBM Plex Mono', 'SF Mono', Consolas, monospace",
	},
	gruvbox: {
		body: "'Bricolage Grotesque', system-ui, sans-serif",
		mono: "'Fragment Mono', 'SF Mono', Consolas, monospace",
	},
};

// Palettes - warm, distinctive colors (never indigo/violet/pink as primary)
export const PALETTES: Record<Aesthetic, { light: Palette; dark: Palette }> = {
	blueprint: {
		light: {
			bg: "#faf7f5",
			surface: "#ffffff",
			surface2: "#f5f0ec",
			surfaceElevated: "#fff9f5",
			border: "rgba(0,0,0,0.07)",
			borderBright: "rgba(0,0,0,0.14)",
			text: "#292017",
			textDim: "#8a7e72",
			accent: "#c2410c",
			accentDim: "rgba(194,65,12,0.07)", // terracotta
			green: "#4d7c0f",
			greenDim: "rgba(77,124,15,0.07)",
			orange: "#b45309",
			orangeDim: "rgba(180,83,9,0.07)",
			teal: "#0f766e",
			tealDim: "rgba(15,118,110,0.07)",
			plum: "#9f1239",
			plumDim: "rgba(159,18,57,0.07)",
		},
		dark: {
			bg: "#1a1412",
			surface: "#231d1a",
			surface2: "#2e2622",
			surfaceElevated: "#352d28",
			border: "rgba(255,255,255,0.06)",
			borderBright: "rgba(255,255,255,0.12)",
			text: "#ede5dd",
			textDim: "#a69889",
			accent: "#fb923c",
			accentDim: "rgba(251,146,60,0.12)",
			green: "#a3e635",
			greenDim: "rgba(163,230,53,0.1)",
			orange: "#fbbf24",
			orangeDim: "rgba(251,191,36,0.1)",
			teal: "#5eead4",
			tealDim: "rgba(94,234,212,0.1)",
			plum: "#fda4af",
			plumDim: "rgba(253,164,175,0.1)",
		},
	},
	editorial: {
		light: {
			bg: "#faf9f7",
			surface: "#ffffff",
			surface2: "#f5f3f0",
			surfaceElevated: "#fffcf7",
			border: "rgba(0,0,0,0.06)",
			borderBright: "rgba(0,0,0,0.12)",
			text: "#1c1917",
			textDim: "#78716c",
			accent: "#1e3a5f",
			accentDim: "rgba(30,58,95,0.08)", // deep blue
			green: "#4d7c0f",
			greenDim: "rgba(77,124,15,0.08)",
			orange: "#d4a73a",
			orangeDim: "rgba(212,167,58,0.08)", // gold
			teal: "#0891b2",
			tealDim: "rgba(8,145,178,0.08)",
			plum: "#be123c",
			plumDim: "rgba(190,18,60,0.08)", // rose
		},
		dark: {
			bg: "#0c0a09",
			surface: "#1c1917",
			surface2: "#292524",
			surfaceElevated: "#44403c",
			border: "rgba(255,255,255,0.06)",
			borderBright: "rgba(255,255,255,0.1)",
			text: "#fafaf9",
			textDim: "#a8a29e",
			accent: "#60a5fa",
			accentDim: "rgba(96,165,250,0.12)",
			green: "#a3e635",
			greenDim: "rgba(163,230,53,0.1)",
			orange: "#fcd34d",
			orangeDim: "rgba(252,211,77,0.1)",
			teal: "#67e8f9",
			tealDim: "rgba(103,232,249,0.1)",
			plum: "#fda4af",
			plumDim: "rgba(253,164,175,0.1)",
		},
	},
	paper: {
		light: {
			bg: "#faf7f2",
			surface: "#ffffff",
			surface2: "#f5f0e8",
			surfaceElevated: "#fffaf0",
			border: "rgba(0,0,0,0.06)",
			borderBright: "rgba(0,0,0,0.1)",
			text: "#292524",
			textDim: "#78716c",
			accent: "#65a30d",
			accentDim: "rgba(101,163,13,0.08)", // sage
			green: "#059669",
			greenDim: "rgba(5,150,105,0.08)",
			orange: "#c2410c",
			orangeDim: "rgba(194,65,12,0.08)", // terracotta
			teal: "#0d9488",
			tealDim: "rgba(13,148,136,0.08)",
			plum: "#be123c",
			plumDim: "rgba(190,18,60,0.08)",
		},
		dark: {
			bg: "#1c1917",
			surface: "#292524",
			surface2: "#44403c",
			surfaceElevated: "#57534e",
			border: "rgba(255,255,255,0.05)",
			borderBright: "rgba(255,255,255,0.1)",
			text: "#fafaf9",
			textDim: "#a8a29e",
			accent: "#bef264",
			accentDim: "rgba(190,242,100,0.1)",
			green: "#34d399",
			greenDim: "rgba(52,211,153,0.1)",
			orange: "#fb923c",
			orangeDim: "rgba(251,146,60,0.1)",
			teal: "#5eead4",
			tealDim: "rgba(94,234,212,0.1)",
			plum: "#fda4af",
			plumDim: "rgba(253,164,175,0.1)",
		},
	},
	terminal: {
		light: {
			bg: "#fafaf9",
			surface: "#ffffff",
			surface2: "#f5f5f4",
			surfaceElevated: "#e7e5e4",
			border: "rgba(0,0,0,0.08)",
			borderBright: "rgba(0,0,0,0.15)",
			text: "#1c1917",
			textDim: "#78716c",
			accent: "#16a34a",
			accentDim: "rgba(22,163,74,0.1)", // green terminal
			green: "#15803d",
			greenDim: "rgba(21,128,61,0.1)",
			orange: "#ea580c",
			orangeDim: "rgba(234,88,12,0.1)",
			teal: "#0d9488",
			tealDim: "rgba(13,148,136,0.1)",
			plum: "#be123c",
			plumDim: "rgba(190,18,60,0.1)",
		},
		dark: {
			bg: "#0c0a09",
			surface: "#1c1917",
			surface2: "#292524",
			surfaceElevated: "#44403c",
			border: "rgba(34,197,94,0.2)",
			borderBright: "rgba(34,197,94,0.3)",
			text: "#4ade80",
			textDim: "#22c55e", // green text for terminal
			accent: "#22c55e",
			accentDim: "rgba(34,197,94,0.15)",
			green: "#86efac",
			greenDim: "rgba(134,239,172,0.15)",
			orange: "#fb923c",
			orangeDim: "rgba(251,146,60,0.15)",
			teal: "#5eead4",
			tealDim: "rgba(94,234,212,0.15)",
			plum: "#f87171",
			plumDim: "rgba(248,113,113,0.15)",
		},
	},
	dracula: {
		light: {
			bg: "#f8f8f2",
			surface: "#ffffff",
			surface2: "#f0f0ea",
			surfaceElevated: "#e8e8e2",
			border: "rgba(0,0,0,0.08)",
			borderBright: "rgba(0,0,0,0.15)",
			text: "#282a36",
			textDim: "#6272a4",
			accent: "#bd93f9",
			accentDim: "rgba(189,147,249,0.12)", // purple (dracula's signature)
			green: "#50fa7b",
			greenDim: "rgba(80,250,123,0.12)",
			orange: "#ffb86c",
			orangeDim: "rgba(255,184,108,0.12)",
			teal: "#8be9fd",
			tealDim: "rgba(139,233,253,0.12)",
			plum: "#ff79c6",
			plumDim: "rgba(255,121,198,0.12)",
		},
		dark: {
			bg: "#282a36",
			surface: "#44475a",
			surface2: "#6272a4",
			surfaceElevated: "#717895",
			border: "rgba(248,248,242,0.1)",
			borderBright: "rgba(248,248,242,0.2)",
			text: "#f8f8f2",
			textDim: "#6272a4",
			accent: "#bd93f9",
			accentDim: "rgba(189,147,249,0.2)",
			green: "#50fa7b",
			greenDim: "rgba(80,250,123,0.2)",
			orange: "#ffb86c",
			orangeDim: "rgba(255,184,108,0.2)",
			teal: "#8be9fd",
			tealDim: "rgba(139,233,253,0.2)",
			plum: "#ff79c6",
			plumDim: "rgba(255,121,198,0.2)",
		},
	},
	nord: {
		light: {
			bg: "#f9fafb",
			surface: "#ffffff",
			surface2: "#f3f4f6",
			surfaceElevated: "#e5e7eb",
			border: "rgba(0,0,0,0.06)",
			borderBright: "rgba(0,0,0,0.12)",
			text: "#1f2937",
			textDim: "#6b7280",
			accent: "#5e81ac",
			accentDim: "rgba(94,129,172,0.1)", // nord blue
			green: "#a3be8c",
			greenDim: "rgba(163,190,140,0.1)",
			orange: "#d08770",
			orangeDim: "rgba(208,135,112,0.1)", // nord orange
			teal: "#88c0d0",
			tealDim: "rgba(136,192,208,0.1)",
			plum: "#b48ead",
			plumDim: "rgba(180,142,173,0.1)", // nord purple
		},
		dark: {
			bg: "#2e3440",
			surface: "#3b4252",
			surface2: "#434c5e",
			surfaceElevated: "#4c566a",
			border: "rgba(216,222,233,0.1)",
			borderBright: "rgba(216,222,233,0.2)",
			text: "#d8dee9",
			textDim: "#81a1c1",
			accent: "#81a1c1",
			accentDim: "rgba(129,161,193,0.2)",
			green: "#a3be8c",
			greenDim: "rgba(163,190,140,0.2)",
			orange: "#d08770",
			orangeDim: "rgba(208,135,112,0.2)",
			teal: "#88c0d0",
			tealDim: "rgba(136,192,208,0.2)",
			plum: "#b48ead",
			plumDim: "rgba(180,142,173,0.2)",
		},
	},
	solarized: {
		light: {
			bg: "#fdf6e3",
			surface: "#ffffff",
			surface2: "#eee8d5",
			surfaceElevated: "#e5dfcd",
			border: "rgba(0,0,0,0.06)",
			borderBright: "rgba(0,0,0,0.12)",
			text: "#073642",
			textDim: "#586e75",
			accent: "#268bd2",
			accentDim: "rgba(38,139,210,0.1)", // solarized blue
			green: "#859900",
			greenDim: "rgba(133,153,0,0.1)",
			orange: "#cb4b16",
			orangeDim: "rgba(203,75,22,0.1)",
			teal: "#2aa198",
			tealDim: "rgba(42,161,152,0.1)",
			plum: "#d33682",
			plumDim: "rgba(211,54,130,0.1)",
		},
		dark: {
			bg: "#002b36",
			surface: "#073642",
			surface2: "#586e75",
			surfaceElevated: "#657b83",
			border: "rgba(253,246,227,0.1)",
			borderBright: "rgba(253,246,227,0.2)",
			text: "#fdf6e3",
			textDim: "#93a1a1",
			accent: "#268bd2",
			accentDim: "rgba(38,139,210,0.2)",
			green: "#859900",
			greenDim: "rgba(133,153,0,0.2)",
			orange: "#cb4b16",
			orangeDim: "rgba(203,75,22,0.2)",
			teal: "#2aa198",
			tealDim: "rgba(42,161,152,0.2)",
			plum: "#d33682",
			plumDim: "rgba(211,54,130,0.2)",
		},
	},
	gruvbox: {
		light: {
			bg: "#fbf1c7",
			surface: "#ffffff",
			surface2: "#f2e5bc",
			surfaceElevated: "#ebdbb2",
			border: "rgba(0,0,0,0.06)",
			borderBright: "rgba(0,0,0,0.12)",
			text: "#3c3836",
			textDim: "#7c6f64",
			accent: "#458588",
			accentDim: "rgba(69,133,136,0.1)", // gruvbox blue
			green: "#98971a",
			greenDim: "rgba(152,151,26,0.1)",
			orange: "#d65d0e",
			orangeDim: "rgba(214,93,14,0.1)",
			teal: "#689d6a",
			tealDim: "rgba(104,157,106,0.1)",
			plum: "#b16286",
			plumDim: "rgba(177,98,134,0.1)",
		},
		dark: {
			bg: "#282828",
			surface: "#3c3836",
			surface2: "#504945",
			surfaceElevated: "#665c54",
			border: "rgba(235,219,178,0.1)",
			borderBright: "rgba(235,219,178,0.2)",
			text: "#ebdbb2",
			textDim: "#a89984",
			accent: "#83a598",
			accentDim: "rgba(131,165,152,0.2)",
			green: "#b8bb26",
			greenDim: "rgba(184,187,38,0.2)",
			orange: "#fe8019",
			orangeDim: "rgba(254,128,25,0.2)",
			teal: "#8ec07c",
			tealDim: "rgba(142,192,124,0.2)",
			plum: "#d3869b",
			plumDim: "rgba(211,134,155,0.2)",
		},
	},
};

// Shared CSS for all templates
export const SHARED_CSS = `
/* Reset */
* { margin: 0; padding: 0; box-sizing: border-box; }

/* Animation keyframes */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeScale {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-delay: 0ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* Base styles */
body {
  min-height: 100vh;
  line-height: 1.6;
}

/* Section card base */
.section {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px 24px;
  animation: fadeUp 0.4s ease-out both;
  animation-delay: calc(var(--i, 0) * 0.06s);
}

.section--hero {
  background: var(--surface-elevated);
  border-color: color-mix(in srgb, var(--border) 50%, var(--accent) 50%);
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  padding: 28px 32px;
}

.section--recessed {
  background: var(--surface2);
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.04);
}

/* Section labels with dot indicators */
.section-label {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-label .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

/* Flow arrows */
.flow-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: var(--text-dim);
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 4px 0;
  animation: fadeUp 0.4s ease-out both;
  animation-delay: calc(var(--i, 0) * 0.06s);
}

.flow-arrow svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: var(--border-bright);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Code styling */
code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  background: var(--accent-dim);
  color: var(--accent);
  padding: 2px 6px;
  border-radius: 4px;
}

/* Responsive */
@media (max-width: 768px) {
  body { padding: 20px; }
  .section { padding: 16px 20px; }
  .section--hero { padding: 20px 24px; }
}
`;

// Mermaid zoom/pan CSS and JS
export const MERMAID_SHELL_CSS = `
.diagram-shell {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.mermaid-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 24px;
}

.mermaid-viewport {
  overflow: hidden;
  cursor: grab;
}

.mermaid-viewport:active {
  cursor: grabbing;
}

.mermaid-canvas {
  transform-origin: center center;
  transition: transform 0.1s ease-out;
}

.zoom-controls {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 6px;
  z-index: 10;
}

.zoom-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  color: var(--text);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.zoom-btn:hover {
  background: var(--surface2);
  border-color: var(--border-bright);
}
`;

export const MERMAID_SHELL_JS = `
function initMermaidControls(wrap) {
  const viewport = wrap.querySelector('.mermaid-viewport');
  const canvas = wrap.querySelector('.mermaid-canvas');
  let scale = 1;
  let isDragging = false;
  let startX, startY, translateX = 0, translateY = 0;

  function updateTransform() {
    canvas.style.transform = \`translate(\${translateX}px, \${translateY}px) scale(\${scale})\`;
  }

  wrap.querySelector('[data-zoom="in"]').onclick = () => { scale *= 1.2; updateTransform(); };
  wrap.querySelector('[data-zoom="out"]').onclick = () => { scale /= 1.2; updateTransform(); };
  wrap.querySelector('[data-zoom="reset"]').onclick = () => { scale = 1; translateX = 0; translateY = 0; updateTransform(); };
  wrap.querySelector('[data-zoom="expand"]').onclick = () => openMermaidInNewTab(wrap);

  viewport.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    viewport.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateTransform();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    viewport.style.cursor = 'grab';
  });

  viewport.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      scale *= e.deltaY > 0 ? 0.9 : 1.1;
      updateTransform();
    }
  }, { passive: false });
}

function openMermaidInNewTab(wrap) {
  const svg = wrap.querySelector('svg');
  if (!svg) return;
  const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
`;

// Helper to generate CSS variables from palette
export function generateCSSVariables(
	palette: Palette,
	fonts: FontPairing,
	isDark: boolean,
): string {
	const themeBlock = isDark ? "@media (prefers-color-scheme: dark) { :root {" : ":root {";
	const closeBlock = isDark ? "} }" : "}";

	return `${themeBlock}
  --font-body: ${fonts.body};
  --font-mono: ${fonts.mono};
  --bg: ${palette.bg};
  --surface: ${palette.surface};
  --surface2: ${palette.surface2};
  --surface-elevated: ${palette.surfaceElevated};
  --border: ${palette.border};
  --border-bright: ${palette.borderBright};
  --text: ${palette.text};
  --text-dim: ${palette.textDim};
  --accent: ${palette.accent};
  --accent-dim: ${palette.accentDim};
  --green: ${palette.green};
  --green-dim: ${palette.greenDim};
  --orange: ${palette.orange};
  --orange-dim: ${palette.orangeDim};
  --teal: ${palette.teal};
  --teal-dim: ${palette.tealDim};
  --plum: ${palette.plum};
  --plum-dim: ${palette.plumDim};
${closeBlock}`;
}

// HTML shell generator
export function generateHtmlShell(
	title: string,
	bodyContent: string,
	aesthetic: string,
	cssVariables: string,
	extraHead = "",
	extraScripts = "",
): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=Instrument+Serif&family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&family=Fira+Code:wght@400;500;600&family=Bricolage+Grotesque:wght@400;500;600;700&family=Fragment+Mono&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Azeret+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
${cssVariables}
${SHARED_CSS}
${extraHead}
</style>
</head>
<body>
${bodyContent}
${extraScripts}
</body>
</html>`;
}

// Escape HTML entities
export function escapeHtml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}
