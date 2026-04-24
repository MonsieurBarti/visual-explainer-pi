/**
 * Content normalizers — bridge LLM-friendly payloads into the structured
 * shapes that architecture and table templates expect.
 */

import type {
	ArchitectureContent,
	ArchitectureSection,
} from "../templates/architecture.js";
import type {
	TableContent,
	TableColumn,
	TableRow,
} from "../templates/data-table.js";
import { escapeHtml } from "../templates/shared.js";

// ── Table normalization ──────────────────────────────────────────────────────

/**
 * Normalize table content from LLM-friendly flat rows into the structured
 * { columns, rows } shape that generateTableTemplate expects.
 *
 * Accepted input shapes:
 *   1. Already structured: { columns: [...], rows: [...] }   → pass through
 *   2. Flat row array:     [{ col: val, ... }, ...]          → auto-derive columns from keys
 *   3. String:             "markdown or CSV-ish text"         → best-effort parse
 */
export function normalizeTableContent(raw: unknown): TableContent {
	// Shape 1 — already structured
	if (
		raw != null &&
		typeof raw === "object" &&
		!Array.isArray(raw) &&
		"columns" in (raw as Record<string, unknown>) &&
		"rows" in (raw as Record<string, unknown>)
	) {
		return raw as TableContent;
	}

	// Shape 2 — flat array of row objects
	if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "object" && raw[0] !== null) {
		const rows = raw as Record<string, unknown>[];
		const keySet = new Set<string>();
		for (const row of rows) {
			for (const key of Object.keys(row)) keySet.add(key);
		}
		const columns: TableColumn[] = [...keySet].map((key) => ({
			key,
			header: key
				.replace(/([a-z])([A-Z])/g, "$1 $2")
				.replace(/[_-]+/g, " ")
				.replace(/\b\w/g, (c) => c.toUpperCase()),
		}));

		const normalizedRows: TableRow[] = rows.map((row) => {
			const out: TableRow = {};
			for (const col of columns) {
				const cell = row[col.key];
				if (cell != null && typeof cell === "object" && "value" in (cell as Record<string, unknown>)) {
					out[col.key] = cell as { value: string; status?: "success" | "warning" | "error" | "neutral" };
				} else {
					out[col.key] = String(cell ?? "");
				}
			}
			return out;
		});

		return { columns, rows: normalizedRows };
	}

	// Shape 3 — string
	if (typeof raw === "string") {
		const trimmedStr = raw.trim();
		if ((trimmedStr.startsWith("{") || trimmedStr.startsWith("[")) && trimmedStr.length > 2) {
			try {
				const parsed = JSON.parse(trimmedStr);
				if (parsed != null && typeof parsed === "object") {
					return normalizeTableContent(parsed);
				}
			} catch {
				// Not valid JSON — fall through to delimiter parsing
			}
		}

		const lines = raw.trim().split("\n").filter((l) => l.trim().length > 0);
		if (lines.length === 0) {
			return { columns: [{ key: "content", header: "Content" }], rows: [{ content: raw }] };
		}

		const delim = lines[0]!.includes("|") ? "|" : "\t";
		const parseRow = (line: string) =>
			line.split(delim).map((cell) => cell.trim()).filter((c) => c.length > 0);

		const headerCells = parseRow(lines[0]!);
		const columns: TableColumn[] = headerCells.map((h, i) => ({
			key: `col${i}`,
			header: h,
		}));

		const dataLines = lines.slice(1).filter((l) => !/^[\s|:-]+$/.test(l));
		const rows: TableRow[] = dataLines.map((line) => {
			const cells = parseRow(line);
			const row: TableRow = {};
			for (let i = 0; i < columns.length; i++) {
				row[columns[i]!.key] = cells[i] ?? "";
			}
			return row;
		});

		return { columns, rows };
	}

	// Fallback
	return {
		columns: [{ key: "content", header: "Content" }],
		rows: [{ content: String(raw) }],
	};
}

// ── Architecture normalization ───────────────────────────────────────────────

/**
 * Convert simple markdown body text into architecture inner-card HTML.
 */
export function markdownToInnerCards(md: string): string {
	const lines = md.split("\n");
	const blocks: string[] = [];
	let currentList: string[] = [];

	const flushList = () => {
		if (currentList.length > 0) {
			const items = currentList
				.map((item) => `<li>${escapeHtml(item)}</li>`)
				.join("");
			blocks.push(`<ul class="node-list">${items}</ul>`);
			currentList = [];
		}
	};

	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed) {
			flushList();
			continue;
		}
		const bulletMatch = trimmed.match(/^[-*+]\s+(.+)/);
		if (bulletMatch) {
			currentList.push(bulletMatch[1]!);
		} else {
			flushList();
			blocks.push(
				`<div class="inner-card"><div class="desc">${escapeHtml(trimmed)}</div></div>`,
			);
		}
	}
	flushList();

	return blocks.join("\n");
}

/**
 * Normalize a single architecture section.
 */
export function normalizeArchitectureSection(
	section: Record<string, unknown>,
	index: number,
): ArchitectureSection {
	const colors: Array<"accent" | "green" | "orange" | "teal" | "plum"> = [
		"accent",
		"green",
		"orange",
		"teal",
		"plum",
	];

	const label = String(section.label ?? section.title ?? `Section ${index + 1}`);
	const labelColor = (section.labelColor as ArchitectureSection["labelColor"]) ??
		colors[index % colors.length];

	let contentHtml: string;

	if (typeof section.content === "string" && section.content.trim().length > 0) {
		const c = section.content.trim();
		if (/<[a-z][\s\S]*>/i.test(c)) {
			contentHtml = c;
		} else {
			contentHtml = markdownToInnerCards(c);
		}
	} else if (Array.isArray(section.items)) {
		const items = section.items as Array<Record<string, unknown> | string>;
		const cards = items.map((item) => {
			if (typeof item === "string") {
				return `<div class="inner-card"><div class="desc">${escapeHtml(item)}</div></div>`;
			}
			const name = String(item.name ?? item.title ?? item.label ?? "");
			const detail = String(item.detail ?? item.description ?? item.desc ?? "");
			return [
				'<div class="inner-card">',
				name ? `<div class="title">${escapeHtml(name)}</div>` : "",
				detail ? `<div class="desc">${escapeHtml(detail)}</div>` : "",
				"</div>",
			].join("");
		});
		contentHtml = `<div class="inner-grid">${cards.join("\n")}</div>`;
	} else {
		contentHtml = `<div class="callout">${escapeHtml(String(section.content ?? ""))}</div>`;
	}

	if (typeof section.description === "string" && section.description.trim().length > 0) {
		contentHtml = `<div class="callout" style="margin-bottom:12px">${escapeHtml(section.description)}</div>\n${contentHtml}`;
	}

	return {
		label,
		labelColor,
		content: contentHtml,
		isHero: section.isHero === true || index === 0,
		isRecessed: section.isRecessed === true,
	};
}

/**
 * Normalize architecture content from LLM-friendly shapes into the
 * structured { sections } shape that generateArchitectureTemplate expects.
 */
export function normalizeArchitectureContent(raw: unknown): ArchitectureContent {
	// Shape 1 — object with sections array
	if (
		raw != null &&
		typeof raw === "object" &&
		!Array.isArray(raw) &&
		"sections" in (raw as Record<string, unknown>)
	) {
		const obj = raw as Record<string, unknown>;
		const rawSections = obj.sections;
		if (Array.isArray(rawSections)) {
			const sections = rawSections.map((s, i) =>
				normalizeArchitectureSection(s as Record<string, unknown>, i),
			);
			return {
				sections,
				flowArrows: Array.isArray(obj.flowArrows)
					? (obj.flowArrows as ArchitectureContent["flowArrows"])
					: undefined,
			};
		}
	}

	if (typeof raw === "string") {
		const text = raw.trim();

		if (text.startsWith("{") && text.includes('"sections"')) {
			try {
				const parsed = JSON.parse(text);
				if (parsed != null && typeof parsed === "object" && "sections" in parsed) {
					return parsed as ArchitectureContent;
				}
			} catch {
				// fall through
			}
		}

		// Shape 2 — markdown with ## headings
		if (/^#{1,3}\s/m.test(text)) {
			const sections: ArchitectureContent["sections"] = [];
			const parts = text.split(/^(?=#{1,3}\s)/m);
			const colors: Array<"accent" | "green" | "orange" | "teal" | "plum"> = [
				"accent",
				"green",
				"orange",
				"teal",
				"plum",
			];
			for (const part of parts) {
				const trimmed = part.trim();
				if (!trimmed) continue;

				const headingMatch = trimmed.match(/^#{1,3}\s+(.+)/);
				const label = headingMatch ? headingMatch[1]!.trim() : "Section";
				const body = headingMatch
					? trimmed.slice(headingMatch[0].length).trim()
					: trimmed;

				const contentHtml = markdownToInnerCards(body);
				sections.push({
					label,
					content: contentHtml,
					labelColor: colors[sections.length % colors.length],
					isHero: sections.length === 0,
				});
			}
			return { sections };
		}

		// Shape 3 — plain string
		return {
			sections: [
				{
					label: "Overview",
					content: `<div class="callout">${escapeHtml(text)}</div>`,
					isHero: true,
				},
			],
		};
	}

	// Fallback
	return {
		sections: [
			{
				label: "Content",
				content: `<div class="callout">${escapeHtml(String(raw))}</div>`,
			},
		],
	};
}
