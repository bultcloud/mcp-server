#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Client } from "./client.js";
import { registerProjectTools } from "./tools/projects.js";
import { registerServiceTools } from "./tools/services.js";
import { registerVolumeTools } from "./tools/volumes.js";
import { registerRouteTools } from "./tools/routes.js";
import { registerTemplateTools } from "./tools/templates.js";
import { registerLogTools } from "./tools/logs.js";

const baseURL = process.env.BULT_API_URL;
if (!baseURL) {
  console.error("Error: BULT_API_URL environment variable is required");
  process.exit(1);
}

const token = process.env.BULT_API_TOKEN;
if (!token) {
  console.error("Error: BULT_API_TOKEN environment variable is required");
  process.exit(1);
}

const server = new McpServer({ name: "bult-cloud", version: "1.0.1" });
const client = new Client(baseURL, token);

registerProjectTools(server, client);
registerServiceTools(server, client);
registerVolumeTools(server, client);
registerRouteTools(server, client);
registerTemplateTools(server, client);
registerLogTools(server, client);

const transport = new StdioServerTransport();
await server.connect(transport);
