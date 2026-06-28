const vscode = require("vscode");

const PROVIDER_ID = "bultMcp";
const TOKEN_KEY = "bultMcp.apiToken";

function activate(context) {
  const changed = new vscode.EventEmitter();

  context.subscriptions.push(
    vscode.commands.registerCommand("bultMcp.setApiToken", async () => {
      const token = await vscode.window.showInputBox({
        title: "Bult.ai API Token",
        prompt: "Enter your Bult.ai API token.",
        password: true,
        ignoreFocusOut: true,
        validateInput: (value) => (value.trim() ? undefined : "API token is required."),
      });

      if (!token) {
        return;
      }

      await context.secrets.store(TOKEN_KEY, token.trim());
      changed.fire();
      vscode.window.showInformationMessage("Bult.ai MCP API token saved.");
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("bultMcp.clearApiToken", async () => {
      await context.secrets.delete(TOKEN_KEY);
      changed.fire();
      vscode.window.showInformationMessage("Bult.ai MCP API token removed.");
    }),
  );

  context.subscriptions.push(
    vscode.lm.registerMcpServerDefinitionProvider(PROVIDER_ID, {
      onDidChangeMcpServerDefinitions: changed.event,

      async provideMcpServerDefinitions() {
        return [
          new vscode.McpStdioServerDefinition(
            "Bult.ai MCP Server",
            "npx",
            ["-y", "@bultcloud/mcp-server@latest"],
            await getServerEnv(context),
            "1.0.1",
          ),
        ];
      },

      async resolveMcpServerDefinition(server) {
        let token = await context.secrets.get(TOKEN_KEY);
        if (!token) {
          const action = await vscode.window.showWarningMessage(
            "Bult.ai MCP needs an API token before it can start.",
            "Set API Token",
            "Cancel",
          );

          if (action !== "Set API Token") {
            return undefined;
          }

          await vscode.commands.executeCommand("bultMcp.setApiToken");
          token = await context.secrets.get(TOKEN_KEY);
          if (!token) {
            return undefined;
          }
        }

        return new vscode.McpStdioServerDefinition(
          server.label,
          "npx",
          ["-y", "@bultcloud/mcp-server@latest"],
          await getServerEnv(context),
          "1.0.1",
        );
      },
    }),
  );
}

function deactivate() {}

async function getServerEnv(context) {
  const config = vscode.workspace.getConfiguration("bultMcp");
  const apiUrl = config.get("apiUrl", "https://app.bult.ai");
  const token = await context.secrets.get(TOKEN_KEY);

  return {
    BULT_API_URL: apiUrl,
    BULT_API_TOKEN: token || "",
  };
}

module.exports = {
  activate,
  deactivate,
};
