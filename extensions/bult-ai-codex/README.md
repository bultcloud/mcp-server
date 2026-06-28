# Bult.ai for Codex

Deploy, manage, and debug Bult.ai cloud apps from Codex.

This plugin bundles:

- Bult MCP server config using `@bultcloud/mcp-server`
- Bult CLI operator skill
- Bult project management skill
- Bult service management skill
- Bult deploy, logs, and debugging skill

## Install From This Repo

After this repo is pushed, users can add it as a Codex plugin marketplace source:

```bash
codex plugin marketplace add bultcloud/mcp-server --sparse .agents/plugins --sparse extensions/bult-ai-codex
```

Then open the Codex plugin browser:

```text
/plugins
```

Install `Bult.ai`.

## Configure

The bundled MCP server expects:

```text
BULT_API_URL=https://app.bult.ai
BULT_API_TOKEN=your-bult-api-token
```

Never commit real API tokens.

## Example Prompts

- Deploy this GitHub repo to Bult and give me the public URL.
- Deploy the current project to Bult.
- Check why my deployment failed.
- Show the latest logs for my app.
- List my Bult projects and services.
