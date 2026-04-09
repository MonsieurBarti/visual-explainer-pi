/**
 * Visual Explainer PI Extension
 *
 * Generates beautiful, self-contained HTML pages for diagrams, architecture,
 * diff reviews, plan audits, data tables, and project recaps.
 *
 * Based on nicobailon/visual-explainer design principles.
 */

import { StringEnum } from "@mariozechner/pi-ai";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { defineTool, formatSize, truncateHead } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";
import { generateArchitectureTemplate } from "./templates/architecture.js";
import { generateTableTemplate } from "./templates/data-table.js";
import { generateMermaidTemplate } from "./templates/mermaid.js";
import type { ExtensionState, GenerateResult, GenerateVisualParams } from "./types.js";
import { openInBrowser } from "./utils/browser-open.js";
import { createInitialState, writeHtmlFile } from "./utils/file-writer.js";
import { generateDefaultFilename, sanitizeFilename, validateParams } from "./utils/validators.js";

// Extension state
const state: ExtensionState = createInitialState();

/**
 * Generate visual HTML based on type and content
 */
async function generateVisual(
	params: GenerateVisualParams,
	pi: ExtensionAPI,
): Promise<GenerateResult> {
	// Determine if dark mode
	const isDark = params.theme === "dark" || (params.theme === "auto" && prefersDarkMode());

	// Generate HTML based on type
	let html: string;

	switch (params.type) {
		case "architecture":
			html = generateArchitectureTemplate(
				params.title,
				params.content as unknown as import("./templates/architecture.js").ArchitectureContent,
				params.aesthetic ?? "blueprint",
				isDark,
			);
			break;

		case "flowchart":
		case "sequence":
		case "er":
		case "state":
		case "mermaid_custom":
			html = generateMermaidTemplate(
				params.title,
				{
					mermaidSyntax: params.content as string,
					caption: `${params.type} diagram`,
				},
				params.aesthetic ?? "blueprint",
				isDark,
			);
			break;

		case "table":
			html = generateTableTemplate(
				params.title,
				params.content as unknown as import("./templates/data-table.js").TableContent,
				params.aesthetic ?? "blueprint",
				isDark,
			);
			break;

		case "diff":
			// For now, treat diff as architecture with special handling
			html = generateArchitectureTemplate(
				params.title,
				{
					sections: [
						{
							label: "Changes Overview",
							content: `<div class="inner-card"><div class="title">${escapeHtml(params.content as string).substring(0, 100)}...</div></div>`,
						},
					],
				},
				params.aesthetic ?? "blueprint",
				isDark,
			);
			break;

		case "plan":
			html = generateArchitectureTemplate(
				params.title,
				{
					sections: [
						{
							label: "Implementation Plan",
							content: `<div class="callout">${escapeHtml(params.content as string).substring(0, 200)}...</div>`,
							isHero: true,
						},
					],
				},
				params.aesthetic ?? "blueprint",
				isDark,
			);
			break;

		case "timeline":
		case "dashboard":
		case "slides":
			// Fallback to architecture template for now
			console.warn(`Type ${params.type} not fully implemented, using architecture template`);
			html = generateArchitectureTemplate(
				params.title,
				{
					sections: [
						{
							label: params.type,
							content: `<div class="inner-card"><div class="title">Content</div><div class="desc">${escapeHtml(String(params.content)).substring(0, 200)}...</div></div>`,
						},
					],
				},
				params.aesthetic ?? "blueprint",
				isDark,
			);
			break;

		default:
			throw new Error(`Unsupported visual type: ${params.type}`);
	}

	// Safety check: truncate if too large
	const truncated = truncateHead(html, { maxBytes: 50000, maxLines: 2000 });

	// Generate filename
	const filename = params.filename
		? sanitizeFilename(params.filename)
		: generateDefaultFilename(params.title);

	// Write file
	const filePath = await writeHtmlFile(filename, truncated.content, state);

	// Open in browser
	await openInBrowser(filePath, pi);

	// Generate preview snippet (first 500 chars of content summary)
	const previewSnippet = `Generated ${params.type} visualization: ${params.title}`;

	return {
		filePath,
		previewSnippet,
		url: `file://${filePath}`,
	};
}

function prefersDarkMode(): boolean {
	// This runs on the server, so we default to light
	// In a real implementation, this could check system preferences
	return false;
}

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

/**
 * Main extension export
 */
export default function visualExplainerExtension(pi: ExtensionAPI) {
	// Initialize on session start
	pi.on("session_start", async (_event, ctx) => {
		if (ctx.hasUI) {
			ctx.ui.notify("Visual explainer ready", "info");
		}
	});

	// Register generate_visual tool
	const generateVisualTool = defineTool({
		name: "generate_visual",
		label: "Generate Visual",
		description:
			"Generate beautiful, self-contained HTML pages for diagrams, architecture overviews, diff reviews, data tables, and visual explanations. Opens result in browser. Based on nicobailon/visual-explainer design principles.",
		promptSnippet: "Create a visual diagram/architecture/table",
		promptGuidelines: [
			"Use this tool when the user asks for diagrams, architecture views, or data tables",
			"Proactively use for complex tables (4+ rows, 3+ columns) instead of ASCII",
			"Choose aesthetic based on context: blueprint (technical), editorial (formal), paper (warm), terminal (retro), dracula/nord/solarized/gruvbox (IDE themes)",
			"Content can be structured data (for tables) or mermaid syntax (for diagrams)",
		],
		parameters: Type.Object({
			type: StringEnum(
				[
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
				] as const,
				{ description: "Type of visualization to generate" },
			),
			content: Type.Union([
				Type.String({ description: "Raw content (mermaid syntax, markdown)" }),
				Type.Array(Type.Record(Type.String(), Type.Unknown()), {
					description: "Structured data rows for tables",
				}),
			]),
			title: Type.String({ description: "Title for the visualization" }),
			aesthetic: Type.Optional(
				StringEnum(
					[
						"blueprint",
						"editorial",
						"paper",
						"terminal",
						"dracula",
						"nord",
						"solarized",
						"gruvbox",
					] as const,
					{ description: "Visual aesthetic/theme palette" },
				),
			),
			theme: Type.Optional(
				StringEnum(["light", "dark", "auto"] as const, {
					description: "Color theme mode",
				}),
			),
			filename: Type.Optional(
				Type.String({ description: "Output filename (auto-generated if omitted)" }),
			),
		}),

		async execute(_toolCallId, rawParams, _signal, _onUpdate, _ctx) {
			// Validate parameters
			const params = validateParams(rawParams);

			// Generate visual
			const result = await generateVisual(params, pi);

			return {
				content: [
					{
						type: "text",
						text: `${result.previewSnippet}\n\nOpened in browser: ${result.url}\nFile: ${result.filePath}`,
					},
				],
				details: {
					type: params.type,
					title: params.title,
					aesthetic: params.aesthetic,
					theme: params.theme,
					filePath: result.filePath,
					url: result.url,
				},
			};
		},
	});

	pi.registerTool(generateVisualTool);

	// Register reopen command for recent files
	pi.registerCommand("visual-reopen", {
		description: "Re-open a recently generated visual by index (1-10)",
		handler: async (args, ctx) => {
			const index = Number.parseInt(args, 10) - 1;
			if (index < 0 || index >= state.recentFiles.length) {
				if (ctx.hasUI) {
					ctx.ui.notify(`Invalid index. Use 1-${state.recentFiles.length}`, "error");
				}
				return;
			}
			const filePath = state.recentFiles[index];
			await openInBrowser(filePath, pi);
			if (ctx.hasUI) {
				ctx.ui.notify(`Re-opened: ${filePath}`, "info");
			}
		},
	});

	// Register list command
	pi.registerCommand("visual-list", {
		description: "List recently generated visuals",
		handler: async (_args, ctx) => {
			if (state.recentFiles.length === 0) {
				if (ctx.hasUI) {
					ctx.ui.notify("No recent visuals", "warning");
				}
				return;
			}
			const list = state.recentFiles.map((f, i) => `${i + 1}. ${f}`).join("\n");
			if (ctx.hasUI) {
				ctx.ui.notify(`Recent visuals:\n${list}`, "info");
			}
		},
	});

	// Cleanup on shutdown
	pi.on("session_shutdown", async () => {
		// Note: We don't delete the HTML files - they persist for user reference
		// Only cleanup would be if we created any temp directories
		state.tempDirs = [];
	});
}
