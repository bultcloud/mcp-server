import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Client } from "../client.js";
import { formatJSON, toolResult, toolError } from "../utils.js";

export function registerProjectTools(server: McpServer, client: Client) {
  server.registerTool("list-projects", {
    description: "List all projects in the workspace",
    annotations: { readOnlyHint: true },
  }, async () => {
    try {
      const data = await client.get("/api/v1/projects");
      return toolResult(formatJSON(data));
    } catch (e) {
      return toolError(e);
    }
  });

  server.registerTool("get-project", {
    description: "Get project details including full overview with services, volumes, and routes",
    inputSchema: { project_id: z.string().describe("The project ID") },
    annotations: { readOnlyHint: true },
  }, async ({ project_id }) => {
    try {
      const data = await client.get(`/api/v1/projects/${project_id}/overview`);
      return toolResult(formatJSON(data));
    } catch (e) {
      return toolError(e);
    }
  });

  server.registerTool("create-project", {
    description: "Create a new project",
    inputSchema: { name: z.string().describe("The project name") },
  }, async ({ name }) => {
    try {
      const data = await client.post("/api/v1/projects", { name });
      return toolResult(`Project created. ID: ${formatJSON(data)}`);
    } catch (e) {
      return toolError(e);
    }
  });

  server.registerTool("update-project", {
    description: "Update project name",
    inputSchema: {
      project_id: z.string().describe("The project ID"),
      name: z.string().describe("The new project name"),
    },
    annotations: { idempotentHint: true },
  }, async ({ project_id, name }) => {
    try {
      await client.put(`/api/v1/projects/${project_id}`, { name });
      return toolResult("Project updated successfully");
    } catch (e) {
      return toolError(e);
    }
  });

  server.registerTool("delete-project", {
    description: "Delete a project and all its resources",
    inputSchema: { project_id: z.string().describe("The project ID") },
    annotations: { destructiveHint: true },
  }, async ({ project_id }) => {
    try {
      await client.delete(`/api/v1/projects/${project_id}`);
      return toolResult("Project deleted successfully");
    } catch (e) {
      return toolError(e);
    }
  });

  server.registerTool("deploy-project", {
    description: "Deploy project changes (creates a version snapshot)",
    inputSchema: {
      project_id: z.string().describe("The project ID"),
      commit_message: z.string().optional().describe("Deployment commit message"),
    },
  }, async ({ project_id, commit_message }) => {
    try {
      await client.post(`/api/v1/projects/${project_id}/deploy`, {
        commit_message: commit_message ?? "",
        services: [],
      });
      return toolResult("Project deployment initiated successfully");
    } catch (e) {
      return toolError(e);
    }
  });

  server.registerTool("control-project", {
    description: "Control project lifecycle: start, stop, or discard changes",
    inputSchema: {
      project_id: z.string().describe("The project ID"),
      action: z.enum(["start", "stop", "discard"]).describe("Action: start, stop, or discard"),
    },
  }, async ({ project_id, action }) => {
    try {
      await client.post(`/api/v1/projects/${project_id}/${action}`, null);
      return toolResult(`Project ${action} completed successfully`);
    } catch (e) {
      return toolError(e);
    }
  });
}
