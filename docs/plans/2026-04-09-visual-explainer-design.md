# Visual Explainer PI Extension - Design Document

**Package:** `@the-forge-flow/visual-explainer-pi`  
**Date:** 2026-04-09  
**Status:** Approved for implementation

## Overview

A PI extension that generates beautiful, self-contained HTML pages for technical diagrams, architecture overviews, diff reviews, plan audits, data tables, and project recaps. Opens results in browser instead of using terminal ASCII art.

Based on [nicobailon/visual-explainer](https://github.com/nicobailon/visual-explainer) design principles and patterns.

## Architecture

### Package Structure
```
visual-explainer-pi/
├── src/
│   ├── index.ts              # Main extension export
│   ├── templates/
│   │   ├── architecture.ts   # CSS Grid architecture template
│   │   ├── mermaid.ts       # Mermaid-based templates
│   │   ├── data-table.ts    # HTML table template
│   │   ├── slide-deck.ts    # Slide deck template
│   │   └── shared.ts        # CSS variables, animations
│   ├── utils/
│   │   ├── file-writer.ts   # Temp file management
│   │   ├── browser-open.ts  # Cross-platform browser launch
│   │   └── validators.ts    # Input validation
│   └── types.ts             # TypeScript interfaces
├── tests/
│   ├── templates/           # Template unit tests
│   ├── utils/              # Utility tests
│   └── integration.test.ts  # End-to-end test
├── .github/workflows/
│   ├── ci.yml              # Test + lint + build
│   └── release.yml         # Release-please
├── docs/plans/              # Design documents
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── biome.json
└── lefthook.yml
```

### Technology Stack
- **Runtime:** Bun (following Lightpanda/GH patterns)
- **Testing:** Vitest with coverage
- **Linting:** Biome
- **Git Hooks:** Lefthook
- **CI/CD:** GitHub Actions
- **Release:** release-please

## Core Tool: `generate_visual`

### Interface
```typescript
name: "generate_visual"
label: "Generate Visual"
description: "Generate beautiful, self-contained HTML pages for diagrams, architecture overviews, diff reviews, data tables, and visual explanations."

parameters: {
  type: StringEnum([
    "architecture",     // CSS Grid card layout
    "flowchart",        // Mermaid flowchart
    "sequence",         // Mermaid sequence diagram
    "er",               // Mermaid ER diagram
    "state",            // Mermaid state machine
    "table",            // HTML data table
    "diff",             // Visual diff review
    "plan",             // Implementation plan
    "timeline",         // CSS timeline
    "dashboard",        // Chart.js metrics
    "slides",           // Slide deck presentation
    "mermaid_custom"    // Raw Mermaid syntax
  ]),
  content: string | object[],
  title: string,
  aesthetic?: "blueprint" | "editorial" | "paper" | "terminal" | "dracula" | "nord" | "solarized" | "gruvbox",
  theme?: "light" | "dark" | "auto",
  filename?: string
}
```

### Output
- Writes to `~/.agent/diagrams/{filename}.html`
- Opens in default browser
- Returns `{ filePath, previewSnippet, url }`

## Design System (from nicobailon/visual-explainer)

### Forbidden (AI Slop)
- Inter font as primary body font
- Indigo/violet accents (`#8b5cf6`, `#7c3aed`, `#a78bfa`)
- Cyan-magenta-pink gradient combinations
- Emoji icons in section headers
- Animated glowing box-shadows
- Gradient text on headings (`background-clip: text`)

### Required
- Distinctive font pairings:
  - DM Sans + Fira Code (technical, precise)
  - Instrument Serif + JetBrains Mono (editorial, refined)
  - IBM Plex Sans + IBM Plex Mono (reliable, readable)
  - Bricolage Grotesque + Fragment Mono (bold, characterful)
- Warm accent palettes:
  - Terracotta + sage (`#c2410c`, `#65a30d`)
  - Teal + slate (`#0891b2`, `#0369a1`)
  - Rose + cranberry (`#be123c`, `#881337`)
  - Amber + emerald (`#d97706`, `#059669`)
- Depth tiers: hero → elevated → default → recessed
- Staggered fade-in animations with `--i` CSS variable

### Template Rendering Approaches

| Content Type | Approach | Why |
|--------------|----------|-----|
| Architecture (text-heavy) | CSS Grid cards + flow arrows | Rich card content needs CSS control |
| Architecture (topology) | Mermaid with custom themeVariables | Visible connections need auto edge routing |
| Flowchart / pipeline | Mermaid | Automatic node positioning |
| Sequence diagram | Mermaid | Lifelines, messages need auto layout |
| ER / schema diagram | Mermaid | Relationship lines need auto-routing |
| State machine | Mermaid | State transitions with labeled edges |
| Mind map | Mermaid | Hierarchical branching |
| Data table | HTML `<table>` | Accessibility, copy-paste behavior |
| Dashboard | CSS Grid + Chart.js | Card grid with embedded charts |

### CSS Patterns (from original templates)
- CSS custom properties for full palette (bg, surface, border, text, text-dim, 3-5 accents with dim variants)
- Subtle gradients/radial backgrounds (not flat solid colors)
- Surface depth through lightness shifts (2-4% between levels)
- Low-opacity borders: `rgba(255,255,255,0.08)` dark, `rgba(0,0,0,0.08)` light
- Mermaid containers with zoom/pan controls (never bare `<pre class="mermaid">`)
- Responsive with `min-width: 0` on grid children
- Respect `prefers-reduced-motion`

## HTML Generation Pipeline

1. **Select Template** based on `type` parameter
2. **Apply Aesthetic** - Load CSS variables for chosen palette
3. **Inject Content** - Transform structured data to HTML/Mermaid/Chart.js
4. **Compose HTML** - Full self-contained document with embedded CSS/JS
5. **Write File** - Save to `~/.agent/diagrams/`
6. **Open Browser** - Cross-platform browser launch
7. **Return Result** - File path and metadata to LLM

## Error Handling

| Scenario | Response |
|----------|----------|
| Content > 50KB | Warn and truncate with notice |
| Table > 500 rows | Paginate with "Load more" button |
| Mermaid > 50 nodes | Suggest hybrid CSS+Mermaid approach |
| Invalid syntax | Return error with alternative suggestion |
| Missing directory | Auto-create `~/.agent/diagrams/` |
| Browser open fails | Return path + manual open instructions |

## Testing Strategy

1. **Unit Tests:** Template generators with snapshot testing
2. **Template Validation:** Verify CSS variables, responsive breakpoints
3. **Utility Tests:** Mocked `pi.exec` for browser open
4. **Integration Test:** Full tool execution with cleanup

## State Management

```typescript
interface ExtensionState {
  recentFiles: string[];        // Last 10 generated files
  tempDirs: string[];           // Track for cleanup
  defaultAesthetic: string;     // User preference
  defaultTheme: string;         // User preference
}
```

## Commands (Future)

- `/visual-clear-history` - Clear generated files
- `/visual-reopen` - Re-open recent file by index
- `/visual-set-default` - Set default aesthetic/theme

## Quality Checks

Before delivering:
- **Squint test:** Blur eyes, verify hierarchy
- **Swap test:** Would generic theme make it indistinguishable?
- **Both themes:** Toggle OS light/dark mode
- **No overflow:** Resize browser, check clipping
- **Mermaid zoom:** Verify controls present
- **Console clean:** No errors, no broken fonts

## References

- [nicobailon/visual-explainer](https://github.com/nicobailon/visual-explainer)
- [Lightpanda PI Extension](../Lightpanda/) - Project structure reference
- [Anthropic interface-design skill](https://github.com/Dammyjay93/interface-design)

## Implementation Notes

1. Templates stored as TypeScript template literals for type safety
2. Mermaid loaded via CDN (no bundle weight)
3. Chart.js optional for dashboard type only
4. Cross-platform browser detection (macOS/Linux/Windows)
5. Persistent storage in `~/.agent/diagrams/`
6. Auto-cleanup only on explicit command or shutdown
