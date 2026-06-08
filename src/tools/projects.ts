import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Client } from "../client.js";
import { formatJSON, toolResult, toolError } from "../utils.js";

export function registerProjectTools(server: McpServer, client: Client) {
  server.registerTool("list-projects", {
    description: "List Bult.ai hosting projects in the workspace so an AI agent can choose where to deploy, inspect status, or manage services.",
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
    description: "Get a Bult project overview, including services, volumes, routes, deployment status, and public URL information.",
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
    description: "Create a new Bult project for cloud hosting deployments from GitHub repositories, Docker images, templates, or databases.",
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
    description: "Update a Bult project name to keep deployment and hosting workspaces organized.",
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
    description: "Delete a Bult project and all related cloud hosting resources, including services, routes, volumes, deployments, and public URLs.",
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
    description: "Deploy pending Bult project changes, create a version snapshot, and make updated app services available on their public URLs.",
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
    description: "Control a Bult project lifecycle by starting services, stopping cloud hosting resources, or discarding pending deployment changes.",
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
