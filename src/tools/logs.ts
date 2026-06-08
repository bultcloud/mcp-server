import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Client } from "../client.js";
import { formatJSON, toolResult, toolError } from "../utils.js";

export function registerLogTools(server: McpServer, client: Client) {
  server.registerTool("get-service-logs", {
    description: "Get Bult service logs with cursor-based pagination for debugging failed deployments, build errors, runtime issues, and cloud hosting status.",
    inputSchema: {
      service_id: z.string().describe("The service ID"),
      cursor: z.string().optional().describe("Pagination cursor from a previous response"),
    },
    annotations: { readOnlyHint: true },
  }, async ({ service_id, cursor }) => {
    try {
      let path = `/api/v1/projects/services/${service_id}/logs`;
      if (cursor) {
        path += `?cursor=${encodeURIComponent(cursor)}`;
      }

      const data = await client.get(path);
      return toolResult(formatJSON(data));
    } catch (e) {
      return toolError(e);
    }
  });

  server.registerTool("list-builds", {
    description: "List Bult service build and deployment history to inspect build status, failures, source revisions, and recent deploy activity.",
    inputSchema: { service_id: z.string().describe("The service ID") },
    annotations: { readOnlyHint: true },
  }, async ({ service_id }) => {
    try {
      const data = await client.get(`/api/v1/projects/services/${service_id}/builds`);
      return toolResult(formatJSON(data));
    } catch (e) {
      return toolError(e);
    }
  });
}
