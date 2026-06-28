---
name: bult-deploy-and-observe
description: "Deploy Bult projects, check status, read logs, stream logs, and debug runtime state."
---

# Skill: Bult Deploy And Observe

## Use When

Use this skill when the user asks to deploy a Bult project, check deployment or service health, inspect routes and volumes, read logs, follow logs, or open a shell inside a running service.

## Required Context

Before deploying or debugging, identify:

- project ID or confirmed active project
- service name or ID when logs or shell access are needed
- expected healthy state
- whether live streaming or interactive shell access is acceptable

## Deploy

Deploy the active project:

```bash
bult deploy
```

With a message:

```bash
bult deploy -m "Deploy message"
```

For a specific project:

```bash
bult --project <project-id> deploy -m "Deploy message"
```

Verify after deployment:

```bash
bult status --json
```

If a service should have rebuilt or restarted, inspect logs:

```bash
bult logs <service-id-or-unique-name>
```

## Status

```bash
bult status --json
```

Summarize:

- project name and ID
- service names, IDs, kinds, and statuses
- routes with domains, paths, ports, and service IDs
- volumes and sizes

## Logs

Read recent logs:

```bash
bult logs <service-id-or-unique-name>
```

Machine-readable logs:

```bash
bult logs <service-id-or-unique-name> --json
```

Follow logs:

```bash
bult logs <service-id-or-unique-name> -f
```

`logs -f` keeps running until interrupted. Use it only when the user asked for streaming logs or active debugging. Stop after collecting enough relevant evidence unless the user wants it left open.

## Exec Into Service

Open a shell:

```bash
bult exec <service-id-or-unique-name>
```

Use `/bin/sh` if bash is unavailable or the image is minimal:

```bash
bult exec <service-id-or-unique-name> --shell /bin/sh
```

`exec` requires an interactive terminal and gives shell access inside the service. Use it only when the user explicitly wants interactive debugging or command execution inside the container.

## Debugging Flow

1. Check project overview:

```bash
bult status --json
```

2. Resolve the service ID:

```bash
bult service list --json
```

3. Read logs:

```bash
bult logs <service-id>
```

4. If the user asked to rebuild:

```bash
bult service rebuild <service-id>
bult status --json
bult logs <service-id>
```

5. If the user asked to restart, clarify whether they mean `rebuild` or a stop/start cycle.

6. If logs are insufficient and the user allows shell access:

```bash
bult exec <service-id> --shell /bin/sh
```

