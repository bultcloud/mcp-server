# @bultcloud/mcp-server

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Official Model Context Protocol (MCP) server for [Bult](https://bult.ai).
It lets MCP clients manage Bult projects, services, volumes, routes,
templates, deployments, logs, and builds through the Bult Cloud API.

## Features

- Project lifecycle tools: list, inspect, create, update, delete, deploy, start,
  stop, and discard changes.
- Service management for daemon and database services, including Docker image and
  Git-based deployments.
- Persistent volumes, route/domain mappings, templates, service logs, and build
  history.
- MCP tool annotations for read-only, idempotent, and destructive operations
  where supported.
- Works over stdio with Claude Desktop, Claude Code, and other MCP-compatible
  clients.

## Requirements

- Node.js 18 or newer.
- Bult API token.

## Installation

If you install the package globally, use the `bult-mcp` binary:

```bash
npm install -g @bultcloud/mcp-server
bult-mcp
```

You can also run it with `npx` from MCP client configs:

```bash
npx -y @bultcloud/mcp-server
```

## Configuration

The server reads its configuration from environment variables.

| Variable | Required | Description |
| --- | --- | --- |
| `BULT_API_URL` | Yes | Bult API base URL, `https://api.bult.ai`. |
| `BULT_API_TOKEN` | Yes | API token used for Bearer authentication. |

The server exits during startup if either variable is missing.

## MCP Client Setup

### Claude Desktop

Add the server to `claude_desktop_config.json`.

Using `npx`:

```json
{
  "mcpServers": {
    "bult-cloud": {
      "command": "npx",
      "args": ["-y", "@bultcloud/mcp-server"],
      "env": {
        "BULT_API_URL": "https://api.bult.ai",
        "BULT_API_TOKEN": "your-token"
      }
    }
  }
}
```

### Claude Code

Using `npx`:

```bash
claude mcp add bult-cloud \
  -e BULT_API_URL=https://api.bult.ai \
  -e BULT_API_TOKEN=your-token \
  -- npx -y @bultcloud/mcp-server
```

### Codex CLI

Using `npx`:

```bash
codex mcp add \
  --env BULT_API_URL=https://api.bult.ai \
  --env BULT_API_TOKEN=your-token \
  bult-cloud \
  -- npx -y @bultcloud/mcp-server
```

## Available Tools

### Projects

| Tool | Description |
| --- | --- |
| `list-projects` | List all projects in the workspace. |
| `get-project` | Get a project overview with services, volumes, and routes. |
| `create-project` | Create a new project. |
| `update-project` | Update a project name. |
| `delete-project` | Delete a project and all of its resources. |
| `deploy-project` | Deploy project changes and create a version snapshot. |
| `control-project` | Start, stop, or discard project changes. |

### Services

| Tool | Description |
| --- | --- |
| `list-services` | List all services in a project. |
| `get-service` | Get service details and configuration. |
| `create-service` | Create a daemon or database service. |
| `update-service` | Update service configuration. |
| `delete-service` | Delete a service. |
| `control-service` | Start, stop, or rebuild a service. |

### Volumes

| Tool | Description |
| --- | --- |
| `create-volume` | Create a persistent storage volume. |
| `update-volume` | Update a volume name or size. |
| `delete-volume` | Delete a volume. |
| `wipe-volume` | Irreversibly wipe all data from a volume. |

### Routes

| Tool | Description |
| --- | --- |
| `create-route` | Create a domain or path mapping for a service. |
| `update-route` | Update route configuration. |
| `delete-route` | Delete a route. |

### Templates

| Tool | Description |
| --- | --- |
| `list-templates` | List available project templates. |
| `apply-template` | Apply a template to a project. |

### Logs and Builds

| Tool | Description |
| --- | --- |
| `get-service-logs` | Read service logs with cursor-based pagination. |
| `list-builds` | List build history for a service. |

## Development

```bash
npm run dev      # run with tsx, no build step
npm run build    # compile TypeScript to dist/
npm run lint     # type-check without emitting files
```

Project layout:

```text
src/index.ts          MCP server entrypoint
src/client.ts         Bult API client
src/tools/*.ts        MCP tool registrations by resource type
```

## Security

`BULT_API_TOKEN` grants access to your Bult resources. Keep it out of
source control, shell history, issue reports, and screenshots. Prefer scoped or
rotatable tokens when available.

Some tools can create, delete, deploy, stop, or wipe resources. Review tool calls
from your MCP client before approving destructive actions.

## Contributing

Issues and pull requests are welcome at
[github.com/bultcloud/mcp-server](https://github.com/bultcloud/mcp-server).

Before opening a pull request, run:

```bash
npm run lint
npm run build
```

## License

This project is licensed under the [MIT License](LICENSE).
