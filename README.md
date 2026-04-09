# @the-forge-flow/visual-explainer-pi

**PI extension for generating beautiful HTML visualizations.**

Turns complex terminal output into styled HTML pages for diagrams, architecture overviews, diff reviews, data tables, and project recaps. Based on [nicobailon/visual-explainer](https://github.com/nicobailon/visual-explainer) design principles.

## Features

- **11 Visual Types**: architecture, flowchart, sequence, ER, state, table, diff, plan, timeline, dashboard, slides
- **8 Aesthetic Palettes**: blueprint, editorial, paper, terminal, dracula, nord, solarized, gruvbox
- **Self-Contained HTML**: Single file with embedded CSS/JS, opens in any browser
- **Mermaid Integration**: Automatic diagrams with zoom/pan controls
- **Data Tables**: Responsive tables with sticky headers and status indicators
- **Proactive Tables**: Auto-converts complex ASCII tables (4+ rows, 3+ columns) to HTML

## Installation

```bash
pi install npm:@the-forge-flow/visual-explainer-pi
```

## Usage

The extension registers a `generate_visual` tool that the LLM can call:

```
> Generate an architecture diagram of our auth system
> Create a flowchart showing the data pipeline
> Show me a table comparing the API endpoints
```

### Tool Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | enum | Visual type: architecture, flowchart, sequence, er, state, table, diff, plan, timeline, dashboard, slides, mermaid_custom |
| `content` | string/array | Raw content (mermaid syntax, markdown) or structured data rows |
| `title` | string | Title for the visualization |
| `aesthetic` | enum | Visual palette: blueprint, editorial, paper, terminal, dracula, nord, solarized, gruvbox |
| `theme` | enum | light, dark, or auto |
| `filename` | string | Optional output filename |

### Slash Commands

- `/visual-reopen <n>` - Re-open recently generated visual (1-10)
- `/visual-list` - List recently generated visuals

## Output Location

Generated HTML files are saved to `~/.agent/diagrams/` and automatically opened in your default browser.

## Design Principles

Based on [nicobailon/visual-explainer](https://github.com/nicobailon/visual-explainer):

- **Typography First**: Distinctive font pairings (never Inter as primary)
- **Warm Palettes**: Terracotta, sage, teal, rose (never indigo/violet/pink defaults)
- **Depth Hierarchy**: Hero → elevated → default → recessed visual weight
- **No AI Slop**: Forbidden: gradient text, emoji headers, neon glows, animated shadows
- **Accessibility**: Respects `prefers-reduced-motion`, semantic HTML tables

## Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Build
bun run build

# Lint
bun run check
```

## License

MIT - see [LICENSE](./LICENSE)

## Credits

- Design system from [nicobailon/visual-explainer](https://github.com/nicobailon/visual-explainer)
- Project structure based on [monsieurbarti/Lightpanda-PI](https://github.com/monsieurbarti/Lightpanda-PI)
