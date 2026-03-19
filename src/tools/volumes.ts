import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Client } from "../client.js";
import { formatJSON, toolResult, toolError } from "../utils.js";

export function registerVolumeTools(server: McpServer, client: Client) {
  server.registerTool("create-volume", {
    description: "Create a new persistent volume in a project",
    inputSchema: {
      project_id: z.string().describe("The project ID"),
      name: z.string().describe("Volume name"),
      size: z.number().describe("Volume size in GB"),
    },
  }, async ({ project_id, name, size }) => {
    try {
      const data = await client.post(`/api/v1/projects/${project_id}/volumes`, { name, size });
      return toolResult(formatJSON(data));
    } catch (e) {
      return toolError(e);
    }
  });

  server.registerTool("update-volume", {
    description: "Update a volume's name or size",
    inputSchema: {
      volume_id: z.string().describe("The volume ID"),
      name: z.string().describe("Volume name"),
      size: z.number().optional().describe("Volume size in GB"),
    },
    annotations: { idempotentHint: true },
  }, async ({ volume_id, name, size }) => {
    try {
      const body: Record<string, unknown> = { name };
      if (size !== undefined) {
        body.size = size;
      }
      const data = await client.put(`/api/v1/projects/volumes/${volume_id}`, body);
      return toolResult(formatJSON(data));
    } catch (e) {
      return toolError(e);
    }
  });

  server.registerTool("delete-volume", {
    description: "Delete a volume",
    inputSchema: { volume_id: z.string().describe("The volume ID") },
    annotations: { destructiveHint: true },
  }, async ({ volume_id }) => {
    try {
      await client.delete(`/api/v1/projects/volumes/${volume_id}`);
      return toolResult("Volume deleted successfully");
    } catch (e) {
      return toolError(e);
    }
  });

  server.registerTool("wipe-volume", {
    description: "Wipe all data from a volume (irreversible)",
    inputSchema: { volume_id: z.string().describe("The volume ID") },
    annotations: { destructiveHint: true },
  }, async ({ volume_id }) => {
    try {
      await client.post(`/api/v1/projects/volumes/${volume_id}/wipe`, null);
      return toolResult("Volume data wiped successfully");
    } catch (e) {
      return toolError(e);
    }
  });
}
