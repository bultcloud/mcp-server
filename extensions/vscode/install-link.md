# VS Code MCP install link

VS Code supports direct MCP install links with the `vscode:mcp/install` URL
scheme.

Use this link to install Bult MCP without the VS Code extension package:

```text
vscode:mcp/install?%7B%22name%22%3A%22bult%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40bultcloud%2Fmcp-server%22%5D%2C%22env%22%3A%7B%22BULT_API_URL%22%3A%22https%3A%2F%2Fapp.bult.ai%22%2C%22BULT_API_TOKEN%22%3A%22your-token%22%7D%7D
```

Users should replace `your-token` with their Bult.ai API token after installing.
