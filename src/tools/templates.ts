import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Client } from "../client.js";
import { toolResult, toolError, formatJSON } from "../utils.js";

export function registerTemplateTools(server: McpServer, client: Client) {
  server.registerTool("list-templates", {
    description: "List available project templates",
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
    description: "Apply a template to a project, creating preconfigured services, volumes, and routes",
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
