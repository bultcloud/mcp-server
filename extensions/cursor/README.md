# Bult.ai for Cursor

Deploy, manage, and debug Bult.ai cloud apps from Cursor.

This plugin packages the official Bult.ai MCP server and Bult agent skills so
Cursor can help deploy GitHub repositories, Docker images, databases, services,
routes, volumes, and logs.

## What It Includes

- Bult MCP server config using `@bultcloud/mcp-server`
- Agent skills for Bult CLI operation, projects, services, deploys, logs, and debugging
- Cursor rules for safe project/service selection and destructive actions

## Setup

After installing the plugin, configure the Bult MCP server with:

```json
{
  "mcpServers": {
    "bult": {
      "command": "npx",
      "args": ["-y", "@bultcloud/mcp-server"],
      "env": {
        "BULT_API_URL": "https://app.bult.ai",
        "BULT_API_TOKEN": "your-bult-api-token"
      }
    }
  }
}
```

## Example Prompts

- Deploy this GitHub repo to Bult and give me the public URL.
- Deploy the current project to Bult.
- Check why my deployment failed.
- Show the latest logs for my app.
- Deploy this Docker image to Bult.
- List my Bult projects and services.

## Links

- Bult.ai: https://bult.ai
- GitHub: https://github.com/bultcloud/mcp-server
- npm: https://www.npmjs.com/package/@bultcloud/mcp-server
