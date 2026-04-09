import { describe, expect, it } from "vitest";
import {
	generateDefaultFilename,
	sanitizeFilename,
	validateAesthetic,
	validateParams,
	validateTheme,
	validateVisualType,
} from "../../src/utils/validators";

describe("validateVisualType", () => {
	it("should accept valid visual types", () => {
		expect(validateVisualType("architecture")).toBe("architecture");
		expect(validateVisualType("flowchart")).toBe("flowchart");
		expect(validateVisualType("table")).toBe("table");
	});

	it("should throw on invalid visual types", () => {
		expect(() => validateVisualType("invalid")).toThrow();
		expect(() => validateVisualType(123)).toThrow();
	});
});

describe("validateAesthetic", () => {
	it("should accept valid aesthetics", () => {
		expect(validateAesthetic("blueprint")).toBe("blueprint");
		expect(validateAesthetic("dracula")).toBe("dracula");
	});

	it("should default to blueprint when undefined", () => {
		expect(validateAesthetic(undefined)).toBe("blueprint");
	});

	it("should fallback to blueprint on invalid", () => {
		expect(validateAesthetic("invalid")).toBe("blueprint");
	});
});

describe("validateTheme", () => {
	it("should accept valid themes", () => {
		expect(validateTheme("light")).toBe("light");
		expect(validateTheme("dark")).toBe("dark");
		expect(validateTheme("auto")).toBe("auto");
	});

	it("should default to auto when undefined", () => {
		expect(validateTheme(undefined)).toBe("auto");
	});
});

describe("validateParams", () => {
	it("should validate required parameters", () => {
		const params = {
			type: "architecture",
			content: { sections: [] },
			title: "Test Architecture",
		};
		const result = validateParams(params);
		expect(result.type).toBe("architecture");
		expect(result.title).toBe("Test Architecture");
	});

	it("should throw on missing title", () => {
		expect(() =>
			validateParams({
				type: "architecture",
				content: {},
			}),
		).toThrow("title is required");
	});

	it("should throw on missing content", () => {
		expect(() =>
			validateParams({
				type: "architecture",
				title: "Test",
			}),
		).toThrow("content is required");
	});
});

describe("sanitizeFilename", () => {
	it("should sanitize special characters", () => {
		expect(sanitizeFilename("test/file:name.html")).toBe("test-file-name.html");
	});

	it("should add .html extension if missing", () => {
		expect(sanitizeFilename("myfile")).toBe("myfile.html");
	});

	it("should preserve existing .html extension", () => {
		expect(sanitizeFilename("myfile.html")).toBe("myfile.html");
	});
});

describe("generateDefaultFilename", () => {
	it("should generate filename with date", () => {
		const filename = generateDefaultFilename("Test Architecture");
		expect(filename).toMatch(/^\d{4}-\d{2}-\d{2}-test-architecture\.html$/);
	});

	it("should handle special characters in title", () => {
		const filename = generateDefaultFilename("Test: Special! File");
		expect(filename).toMatch(/test-special-file\.html$/);
	});
});
