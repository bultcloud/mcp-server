import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Client } from "../client.js";
import { toolResult, toolError, formatJSON } from "../utils.js";

export function registerTemplateTools(server: McpServer, client: Client) {
  server.registerTool("list-templates", {
    description: "List available Bult app and database templates for fast cloud hosting setup and one-click deployments.",
    annotations: { readOnlyHint: true },
  }, async () => {
    try {
      const data = await client.get("/api/v1/projects/templates");
      return toolResult(formatJSON(data));
    } catch (e) {
      return toolError(e);
    }
  });

  server.registerTool("apply-template", {
    description: "Apply a Bult template to a project, creating preconfigured services, databases, volumes, routes, and deployable cloud hosting resources.",
    inputSchema: {
      project_id: z.string().describe("The project ID"),
      template_id: z.string().describe("The template ID"),
    },
  }, async ({ project_id, template_id }) => {
    try {
      await client.post(`/api/v1/projects/${project_id}/${template_id}/apply`, {});
      return toolResult("Template applied successfully");
    } catch (e) {
      return toolError(e);
    }
  });
}
