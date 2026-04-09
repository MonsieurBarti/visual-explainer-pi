<div align="center">
  <img src="https://raw.githubusercontent.com/MonsieurBarti/The-Forge-Flow-CC/refs/heads/main/assets/forge-banner.png" alt="The Forge Flow - Visual Explainer PI" width="100%">

  <h1>🎨 Visual Explainer PI</h1>

  <p>
    <strong>PI extension for generating beautiful HTML visualizations</strong>
  </p>

  <p>
    <a href="https://github.com/MonsieurBarti/visual-explainer-pi/actions/workflows/ci.yml">
      <img src="https://img.shields.io/github/actions/workflow/status/MonsieurBarti/visual-explainer-pi/ci.yml?label=CI&style=flat-square" alt="CI Status">
    </a>
    <a href="https://www.npmjs.com/package/@the-forge-flow/visual-explainer-pi">
      <img src="https://img.shields.io/npm/v/@the-forge-flow/visual-explainer-pi?style=flat-square" alt="npm version">
    </a>
    <a href="LICENSE">
      <img src="https://img.shields.io/github/license/MonsieurBarti/visual-explainer-pi?style=flat-square" alt="License">
    </a>
  </p>
</div>

---

Turns complex terminal output into styled, self-contained HTML pages for diagrams, architecture overviews, diff reviews, data tables, and project recaps. Built on top of the design system from [nicobailon/visual-explainer](https://github.com/nicobailon/visual-explainer).

## ✨ Features

- **🎨 11 Visual Types**: architecture, flowchart, sequence, ER, state, table, diff, plan, timeline, dashboard, slides
- **🖌️ 8 Aesthetic Palettes**: blueprint, editorial, paper, terminal, dracula, nord, solarized, gruvbox
- **📄 Self-Contained HTML**: single file with embedded CSS/JS, opens in any browser
- **🧜 Mermaid Integration**: automatic diagrams with zoom/pan controls
- **📊 Data Tables**: responsive tables with sticky headers and status indicators
- **🤖 PI-native**: seamless integration with PI's tool system, abort-signal aware, output truncated to PI's limits

## 📦 Installation

### 1. Install the extension with `pi install`

PI discovers the extension automatically once installed as a pi package. By default this installs globally into `~/.pi/agent/`; pass `-l` to install into the current project (`.pi/`) instead.

**From npm (recommended):**

```bash
pi install npm:@the-forge-flow/visual-explainer-pi
```

**From GitHub (tracks `main`):**

```bash
pi install git:github.com/MonsieurBarti/visual-explainer-pi
```

**Pin to a specific version:**

```bash
# npm — pin to a published version
pi install npm:@the-forge-flow/visual-explainer-pi@0.1.0

# git — pin to a release tag
pi install git:github.com/MonsieurBarti/visual-explainer-pi@visual-explainer-pi-v0.1.0
```

Then reload PI with `/reload` (or restart it). On the next session you should see a notification that `Visual explainer ready`.

**Manage installed packages:**

```bash
pi list    # show installed packages
pi update  # update non-pinned packages
pi remove npm:@the-forge-flow/visual-explainer-pi
pi config  # enable/disable individual extensions, skills, prompts, themes
```

> For project-scoped installs, package filtering, and more, see the [pi packages doc](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/packages.md).

## 🚀 Usage

The extension registers a single `generate_visual` tool that the LLM can call directly. It also exposes two slash commands to reopen recently generated files.

### `generate_visual`

```typescript
// Render a technical architecture diagram
generate_visual({
  type: "architecture",
  title: "Auth System Overview",
  aesthetic: "blueprint",
  content: {
    sections: [
      { label: "Edge", content: "<div class=\"inner-card\">API Gateway</div>" },
      { label: "Core", content: "<div class=\"inner-card\">Auth Service</div>", isHero: true },
    ],
  },
});

// Render a Mermaid flowchart
generate_visual({
  type: "flowchart",
  title: "Data Pipeline",
  aesthetic: "editorial",
  content: "graph LR; A[Ingest] --> B[Transform] --> C[Store]",
});

// Render a comparison table
generate_visual({
  type: "table",
  title: "API Endpoints",
  aesthetic: "paper",
  content: [
    { method: "GET", path: "/users", status: "stable" },
    { method: "POST", path: "/users", status: "beta" },
  ],
});
```

### Tool Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | enum | Visual type: `architecture`, `flowchart`, `sequence`, `er`, `state`, `table`, `diff`, `plan`, `timeline`, `dashboard`, `slides`, `mermaid_custom` |
| `content` | string \| array | Raw content (mermaid syntax, markdown) or structured data rows |
| `title` | string | Title for the visualization |
| `aesthetic` | enum | Palette: `blueprint`, `editorial`, `paper`, `terminal`, `dracula`, `nord`, `solarized`, `gruvbox` |
| `theme` | enum | `light`, `dark`, or `auto` |
| `filename` | string | Optional output filename (auto-generated if omitted) |

### Slash Commands

- `/visual-reopen <n>` — re-open a recently generated visual by index (1-10)
- `/visual-list` — list recently generated visuals

### Output Location

Generated HTML files are saved to `~/.agent/diagrams/` and automatically opened in your default browser.

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  LLM Request│────▶│ generate_visual  │────▶│   Browser   │
│  (via PI)   │     │  (defineTool)    │     │   (HTML)    │
└─────────────┘     └────────┬─────────┘     └─────────────┘
                             │
                    ┌────────▼─────────┐
                    │ Palette + Template│
                    │ HTML Generation   │
                    │ File Written      │
                    └───────────────────┘
```

Every tool call:

1. Validates parameters (`type`, `content`, `aesthetic`, `theme`).
2. Picks a template (`architecture`, `mermaid`, `data-table`) and a palette.
3. Generates a self-contained HTML document with embedded CSS/JS.
4. Truncates output to PI's ~50KB/2000-line limit via `truncateHead`.
5. Writes the file to `~/.agent/diagrams/` and opens it in the default browser.

## 🎨 Design Principles

Inherited from [nicobailon/visual-explainer](https://github.com/nicobailon/visual-explainer):

- **Typography First** — distinctive font pairings (never Inter as primary)
- **Warm Palettes** — terracotta, sage, teal, rose (never indigo/violet/pink defaults)
- **Depth Hierarchy** — hero → elevated → default → recessed visual weight
- **No AI Slop** — forbidden: gradient text, emoji headers, neon glows, animated shadows
- **Accessibility** — respects `prefers-reduced-motion`, semantic HTML tables

## 🧪 Development

```bash
# Install dependencies (also wires lefthook git hooks)
bun install

# Run tests
bun test

# Lint & format
bun run check

# Typecheck
bun run typecheck

# Build for publish
bun run build
```

## 📁 Project Structure

```
src/
├── index.ts              # Extension entry, tool registration, state
├── types.ts              # TypeScript type definitions
├── templates/
│   ├── architecture.ts   # CSS Grid card layout
│   ├── data-table.ts     # HTML table template
│   ├── mermaid.ts        # Mermaid diagram wrapper
│   └── shared.ts         # Palettes, fonts, CSS variables
└── utils/
    ├── browser-open.ts   # Cross-platform browser launcher
    ├── file-writer.ts    # Temp file + state management
    └── validators.ts     # Input validation
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing`)
3. Commit with conventional commits (`git commit -m "feat: add something"`)
4. Push to the branch (`git push origin feat/amazing`)
5. Open a Pull Request

## 🙏 Credits

This extension re-uses the visual design system (palettes, typography, layout primitives) from [**nicobailon/visual-explainer**](https://github.com/nicobailon/visual-explainer) by [Nico Bailon](https://github.com/nicobailon). The PI integration layer (tool API, validators, templates re-implementation, tests) is original work. Huge thanks to Nico for the beautiful aesthetic foundation.

## 📜 License

MIT © [MonsieurBarti](https://github.com/MonsieurBarti)

---

<div align="center">
  <sub>Built with ⚡ by <a href="https://github.com/MonsieurBarti">MonsieurBarti</a></sub>
</div>
