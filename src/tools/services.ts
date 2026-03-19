import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Client } from "../client.js";
import { formatJSON, toolResult, toolError } from "../utils.js";

export function registerServiceTools(server: McpServer, client: Client) {
  server.registerTool("list-services", {
    description: "List all services in a project",
    inputSchema: { project_id: z.string().describe("The project ID") },
    annotations: { readOnlyHint: true },
  }, async ({ project_id }) => {
    try {
      const data = await client.get(`/api/v1/projects/${project_id}/services`);
      return toolResult(formatJSON(data));
    } catch (e) {
      return toolError(e);
    }
  });

  server.registerTool("get-service", {
    description: "Get service details including configuration, environment variables, and ports",
    inputSchema: { service_id: z.string().describe("The service ID") },
    annotations: { readOnlyHint: true },
  }, async ({ service_id }) => {
    try {
      const data = await client.get(`/api/v1/projects/services/${service_id}`);
      return toolResult(formatJSON(data));
    } catch (e) {
      return toolError(e);
    }
  });

  server.registerTool("create-service", {
    description: "Create a new service in a project. Supports daemon services (from Docker image or Git repo) and database services (PostgreSQL, Redis, MySQL, MongoDB).",
    inputSchema: {
      project_id: z.string().describe("The project ID"),
      name: z.string().describe("Service name (lowercase, alphanumeric with hyphens/underscores)"),
      config: z
        .record(z.any())
        .describe(
          "Service configuration with 'kind' (daemon/database), 'deploy' (box_id, source_type: git/docker), and optionally 'envs', 'ports', 'files'",
        ),
    },
  }, async ({ project_id, name, config }) => {
    try {
      const data = await client.post(`/api/v1/projects/${project_id}/services`, { name, config });
      return toolResult(formatJSON(data));
    } catch (e) {
      return toolError(e);
    }
  });

  server.registerTool("update-service", {
    description: "Update service configuration",
    inputSchema: {
      service_id: z.string().describe("The service ID"),
      name: z.string().describe("Service name"),
      config: z.record(z.any()).describe("Updated service configuration"),
    },
    annotations: { idempotentHint: true },
  }, async ({ service_id, name, config }) => {
    try {
      const data = await client.put(`/api/v1/projects/services/${service_id}`, { name, config });
      return toolResult(`Service updated. ID: ${formatJSON(data)}`);
    } catch (e) {
      return toolError(e);
    }
  });

  server.registerTool("delete-service", {
    description: "Delete a service",
    inputSchema: { service_id: z.string().describe("The service ID") },
    annotations: { destructiveHint: true },
  }, async ({ service_id }) => {
    try {
      await client.delete(`/api/v1/projects/services/${service_id}`);
      return toolResult("Service deleted successfully");
    } catch (e) {
      return toolError(e);
    }
  });

  server.registerTool("control-service", {
    description: "Control service lifecycle: start, stop, or rebuild",
    inputSchema: {
      service_id: z.string().describe("The service ID"),
      action: z.enum(["start", "stop", "rebuild"]).describe("Action: start, stop, or rebuild"),
    },
  }, async ({ service_id, action }) => {
    try {
      await client.post(`/api/v1/projects/services/${service_id}/${action}`, null);
      return toolResult(`Service ${action} completed successfully`);
    } catch (e) {
      return toolError(e);
    }
  });
}
