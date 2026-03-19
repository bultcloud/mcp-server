import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Client } from "../client.js";
import { formatJSON, toolResult, toolError } from "../utils.js";

export function registerRouteTools(server: McpServer, client: Client) {
  server.registerTool("create-route", {
    description: "Create a route (domain mapping) for a service",
    inputSchema: {
      project_id: z.string().describe("The project ID"),
      service_id: z.string().describe("The service ID to route traffic to"),
      domain: z.string().optional().describe("Custom domain (leave empty for auto-generated)"),
      path: z.string().optional().describe("URL path prefix (default: /)"),
      port: z.number().describe("Port number (1-65535)"),
    },
  }, async ({ project_id, service_id, domain, path, port }) => {
    try {
      const body: Record<string, unknown> = { service_id, port };
      if (domain) body.domain = domain;
      if (path) body.path = path;

      const data = await client.post(`/api/v1/projects/${project_id}/routes`, body);
      return toolResult(formatJSON(data));
    } catch (e) {
      return toolError(e);
    }
  });

  server.registerTool("update-route", {
    description: "Update a route configuration",
    inputSchema: {
      route_id: z.string().describe("The route ID"),
      service_id: z.string().describe("The service ID to route traffic to"),
      domain: z.string().optional().describe("Custom domain"),
      path: z.string().optional().describe("URL path prefix"),
      port: z.number().describe("Port number (1-65535)"),
    },
    annotations: { idempotentHint: true },
  }, async ({ route_id, service_id, domain, path, port }) => {
    try {
      const body: Record<string, unknown> = { service_id, port };
      if (domain !== undefined) body.domain = domain;
      if (path !== undefined) body.path = path;

      const data = await client.put(`/api/v1/projects/routes/${route_id}`, body);
      return toolResult(formatJSON(data));
    } catch (e) {
      return toolError(e);
    }
  });

  server.registerTool("delete-route", {
    description: "Delete a route",
    inputSchema: { route_id: z.string().describe("The route ID") },
    annotations: { destructiveHint: true },
  }, async ({ route_id }) => {
    try {
      await client.delete(`/api/v1/projects/routes/${route_id}`);
      return toolResult("Route deleted successfully");
    } catch (e) {
      return toolError(e);
    }
  });
}
