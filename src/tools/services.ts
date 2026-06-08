import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Client } from "../client.js";
import { formatJSON, toolResult, toolError } from "../utils.js";

export function registerServiceTools(server: McpServer, client: Client) {
  server.registerTool("list-services", {
    description: "List services in a Bult project, including app, database, GitHub repository, Docker image, and cloud hosting deployment targets.",
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
    description: "Get Bult service details including deployment configuration, environment variables, ports, status, logs context, and public URL routing data.",
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
    description: "Create a Bult.ai service. Supports daemon apps from a GitHub repository or Docker image, plus PostgreSQL, Redis, MySQL, and MongoDB database services.",
    inputSchema: {
      project_id: z.string().describe("The project ID"),
      name: z.string().describe("Service name (lowercase, alphanumeric with hyphens/underscores)"),
      config: z
        .record(z.any())
        .describe(
          "Bult service configuration with 'kind' (daemon/database), 'deploy' settings (box_id, source_type: git/docker), and optionally environment variables, ports, files, and deployment metadata",
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
    description: "Update a Bult service configuration, including deployment source, Docker image or GitHub repository settings, ports, files, and environment variables.",
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
    description: "Delete a Bult service and remove its cloud hosting deployment resources.",
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
    description: "Control a Bult service lifecycle: start it, stop it, or rebuild it after deployment, Docker image, GitHub repository, or environment variable changes.",
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
