/**
 * Data table template for structured data display
 * Based on nicobailon/visual-explainer data-table.html
 */

import type { Aesthetic } from "../types.js";
import {
	FONT_PAIRINGS,
	PALETTES,
	escapeHtml,
	generateCSSVariables,
	generateHtmlShell,
} from "./shared.js";

export interface TableColumn {
	key: string;
	header: string;
	width?: string;
	align?: "left" | "center" | "right";
}

export interface TableRow {
	[key: string]: string | { value: string; status?: "success" | "warning" | "error" | "neutral" };
}

export interface TableContent {
	columns: TableColumn[];
	rows: TableRow[];
	caption?: string;
	stickyHeader?: boolean;
}

export function generateTableTemplate(
	title: string,
	content: TableContent,
	aesthetic: Aesthetic,
	isDark: boolean,
): string {
	const palette = isDark ? PALETTES[aesthetic].dark : PALETTES[aesthetic].light;
	const fonts = FONT_PAIRINGS[aesthetic];
	const cssVars = generateCSSVariables(palette, fonts, isDark);

	const bodyContent = generateBody(title, content);

	return generateHtmlShell(title, bodyContent, aesthetic, cssVars, getExtraCSS());
}

function generateBody(title: string, content: TableContent): string {
	const colgroup = content.columns
		.map((col) => `<col${col.width ? ` style="width:${col.width}"` : ""}>`)
		.join("");

	const thead = content.columns
		.map((col) => {
			const align = col.align ? ` align="${col.align}"` : "";
			return `<th${align}>${escapeHtml(col.header)}</th>`;
		})
		.join("");

	const tbody = content.rows
		.map((row, i) => {
			const cells = content.columns
				.map((col) => {
					const cellData = row[col.key];
					let value: string;
					let statusClass = "";

					if (typeof cellData === "object" && cellData !== null) {
						value = cellData.value;
						if (cellData.status) {
							statusClass = ` status-${cellData.status}`;
						}
					} else {
						value = String(cellData ?? "");
					}

					const align = col.align ? ` align="${col.align}"` : "";
					return `<td class="cell${statusClass}"${align}>${formatCellValue(value)}</td>`;
				})
				.join("");
			return `<tr style="--i:${i}">${cells}</tr>`;
		})
		.join("");

	const captionHtml = content.caption
		? `<p class="caption">${escapeHtml(content.caption)}</p>`
		: "";

	return `
<div class="container">
  <h1>${escapeHtml(title)}</h1>
  <div class="table-wrap" style="--i:0">
    <table${content.stickyHeader ? ' class="sticky-header"' : ""}>
      <colgroup>${colgroup}</colgroup>
      <thead>
        <tr>${thead}</tr>
      </thead>
      <tbody>
        ${tbody}
      </tbody>
    </table>
  </div>
  ${captionHtml}
</div>
`;
}

function formatCellValue(value: string): string {
	// Check if value contains code-like content (backticks)
	if (value.includes("`")) {
		return value.replace(/`([^`]+)`/g, "<code>$1</code>");
	}
	return escapeHtml(value);
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

.table-wrap {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow-x: auto;
  animation: fadeUp 0.4s ease-out both;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

/* Header */
thead {
  background: var(--surface2);
}

th {
  padding: 14px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-dim);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}

th[align="center"] { text-align: center; }
th[align="right"] { text-align: right; font-variant-numeric: tabular-nums; }

/* Body */
tbody tr {
  animation: fadeUp 0.4s ease-out both;
  animation-delay: calc(var(--i, 0) * 0.04s);
}

tbody tr:nth-child(even) {
  background: var(--surface2);
}

tbody tr:hover {
  background: var(--surface-elevated);
}

td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
}

td[align="center"] { text-align: center; }
td[align="right"] { text-align: right; font-variant-numeric: tabular-nums; }

/* Cell content */
.cell {
  line-height: 1.5;
}

.cell code {
  font-family: var(--font-mono);
  font-size: 12px;
  background: var(--accent-dim);
  color: var(--accent);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

/* Status indicators */
.status-success {
  color: var(--green);
  font-weight: 500;
}

.status-success::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--green);
  margin-right: 6px;
}

.status-warning {
  color: var(--orange);
  font-weight: 500;
}

.status-warning::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--orange);
  margin-right: 6px;
}

.status-error {
  color: var(--plum);
  font-weight: 500;
}

.status-error::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--plum);
  margin-right: 6px;
}

.status-neutral {
  color: var(--text-dim);
}

/* Sticky header */
table.sticky-header thead {
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Animation */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-delay: 0ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* Responsive */
@media (max-width: 768px) {
  body { padding: 20px; }
  h1 { font-size: 24px; }
  th, td { padding: 10px 12px; font-size: 13px; }
}
`;
}
