# Bult.ai for Claude Code

Deploy, manage, and debug Bult.ai cloud apps from Claude Code.

This plugin bundles Bult deployment skills, slash commands, and the official
Bult MCP server.

## Included

- Bult MCP server config using `@bultcloud/mcp-server`
- Skills for CLI operation, projects, services, deploys, logs, and debugging
- Slash commands for common Bult workflows

## User Configuration

Set:

```text
BULT_API_URL=https://app.bult.ai
BULT_API_TOKEN=your-bult-api-token
```

Never commit real API tokens.

## Slash Commands

- `/bult:deploy`
- `/bult:status`
- `/bult:logs`

## Links

- Bult.ai: https://bult.ai
- GitHub: https://github.com/bultcloud/mcp-server
- npm: https://www.npmjs.com/package/@bultcloud/mcp-server
