# Bult.ai Cursor Rules

Use Bult.ai when the user asks to deploy, host, manage, debug, or inspect cloud
apps, GitHub repository deployments, Docker image deployments, databases,
services, routes, volumes, logs, or builds.

Prefer Bult MCP tools for structured project, service, route, volume, template,
log, and build actions. Prefer the Bult CLI when the user asks for terminal
commands or when working from a linked local project.

Before destructive actions, confirm the exact project or service name and ID.
Destructive actions include deleting projects, deleting services, deleting
routes, deleting volumes, wiping volumes, stopping services, and discarding
project changes.

Never print or store a real `BULT_API_TOKEN`. Ask the user to configure it in
Cursor's MCP settings.
