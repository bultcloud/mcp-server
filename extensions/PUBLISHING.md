# Extension and Plugin Publishing

This repo contains publishing artifacts for Cursor, Codex, Claude Code, and
Claude Desktop.

## Cursor Marketplace

Artifact:

```text
extensions/cursor
```

Submit:

```text
https://cursor.directory/plugins/new
```

Use:

- Name: Bult.ai
- Description: Deploy, manage, and debug Bult.ai cloud apps from Cursor with MCP tools and agent skills.
- Repository: https://github.com/bultcloud/mcp-server
- Package path: `extensions/cursor`

## Codex Plugin

Artifact:

```text
extensions/bult-ai-codex
.agents/plugins/marketplace.json
```

Distribution:

```bash
codex plugin marketplace add bultcloud/mcp-server --sparse .agents/plugins --sparse extensions/bult-ai-codex
```

Then open:

```text
/plugins
```

Install `Bult.ai`.

## Claude Code Plugin

Artifact:

```text
extensions/claude-code
.claude-plugin/marketplace.json
```

The plugin includes Bult skills, slash commands, and MCP config.

Submit or distribute through a Claude Code plugin marketplace using this repo
and the marketplace metadata in `.claude-plugin/marketplace.json`.

## Claude Desktop MCPB

Artifact:

```text
bult-ai-mcp-server-1.0.1.mcpb
```

Submit:

```text
https://clau.de/desktop-extention-submission
```

Before submitting, install the MCPB in Claude Desktop once with a real Bult API
token and verify that `list-projects` works.
