/**
 * Input validation utilities for visual-explainer
 */

import type { Aesthetic, GenerateVisualParams, Theme, VisualType } from "../types.js";

const VALID_VISUAL_TYPES: VisualType[] = [
	"architecture",
	"flowchart",
	"sequence",
	"er",
	"state",
	"table",
	"diff",
	"plan",
	"timeline",
	"dashboard",
	"slides",
	"mermaid_custom",
];

const VALID_AESTHETICS: Aesthetic[] = [
	"blueprint",
	"editorial",
	"paper",
	"terminal",
	"dracula",
	"nord",
	"solarized",
	"gruvbox",
];

const VALID_THEMES: Theme[] = ["light", "dark", "auto"];

export function validateVisualType(type: unknown): VisualType {
	if (typeof type !== "string" || !VALID_VISUAL_TYPES.includes(type as VisualType)) {
		throw new Error(
			`Invalid visual type: ${type}. Must be one of: ${VALID_VISUAL_TYPES.join(", ")}`,
		);
	}
	return type as VisualType;
}

export function validateAesthetic(aesthetic: unknown): Aesthetic {
	if (aesthetic === undefined) return "blueprint";
	if (typeof aesthetic !== "string" || !VALID_AESTHETICS.includes(aesthetic as Aesthetic)) {
		console.warn(`Invalid aesthetic: ${aesthetic}. Falling back to "blueprint"`);
		return "blueprint";
	}
	return aesthetic as Aesthetic;
}

export function validateTheme(theme: unknown): Theme {
	if (theme === undefined) return "auto";
	if (typeof theme !== "string" || !VALID_THEMES.includes(theme as Theme)) {
		console.warn(`Invalid theme: ${theme}. Falling back to "auto"`);
		return "auto";
	}
	return theme as Theme;
}

export function validateParams(params: unknown): GenerateVisualParams {
	if (!params || typeof params !== "object") {
		throw new Error("Parameters must be an object");
	}

	const p = params as Record<string, unknown>;

	// Required fields
	if (!p.title || typeof p.title !== "string") {
		throw new Error("title is required and must be a string");
	}

	if (!p.content) {
		throw new Error("content is required");
	}

	const type = validateVisualType(p.type);
	const aesthetic = validateAesthetic(p.aesthetic);
	const theme = validateTheme(p.theme);

	return {
		type,
		content: p.content as string | Record<string, unknown>[],
		title: p.title,
		aesthetic,
		theme,
		filename: p.filename && typeof p.filename === "string" ? p.filename : undefined,
	};
}

export function sanitizeFilename(filename: string): string {
	// Remove any path components and sanitize
	const base = filename.replace(/^[./\\]+/, "").replace(/[\\/:*?"<>|]/g, "-");
	// Ensure .html extension
	if (!base.endsWith(".html")) {
		return `${base}.html`;
	}
	return base;
}

export function generateDefaultFilename(title: string): string {
	const timestamp = new Date().toISOString().split("T")[0];
	const sanitized = title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
	return `${timestamp}-${sanitized || "visual"}.html`;
}
