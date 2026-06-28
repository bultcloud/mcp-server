---
name: bult-cli-operator
description: "Operate Bult from the CLI safely: auth, project selection, services, deploys, logs, and debugging."
---

# Skill: Bult CLI Operator

## Use When

Use this skill when the user asks an AI agent to manage Bult from a terminal: authenticate, inspect account/project state, choose a project, manage services, deploy, read logs, or debug runtime state.

## Agent Contract

You are operating infrastructure for the user. Prefer explicit, reversible, auditable CLI actions. Do not guess project IDs, service IDs, API tokens, Docker images, repository URLs, exposed ports, or destructive intent.

## Prerequisites

Check that the CLI is available:

```bash
bult --help
```

If working inside the Bult CLI source checkout and no installed binary exists, use:

```bash
go run ./cmd/bult --help
```

In later examples, replace `bult` with `go run ./cmd/bult` only for source-checkout operation.

## Shell Completion

Use completion commands when the user asks to set up tab completion:

```bash
bult completion bash
bult completion zsh
bult completion fish
bult completion powershell
```

Ask before writing to shell startup files, Homebrew completion directories, `/etc`, or PowerShell profiles. For a temporary current-session setup, follow the shell-specific instructions from:

```bash
bult completion <shell> --help
```

## Authentication

Check authentication with a read-only command:

```bash
bult project list --json
```

If the CLI reports that the user is not logged in, ask the user to run:

```bash
bult login
```

`bult login` prompts for an API token. Never print, log, summarize, or ask the user to paste their token into normal chat unless they explicitly choose to.

Optional custom API URL:

```bash
bult login --api-url <api-url>
```

Logout:

```bash
bult logout
```

## Project Resolution

Bult resolves the active project in this order:

1. `--project <project-id>`
2. `.bult.yaml` in the current directory
3. the default project stored in `~/.bult/config.json`

For automation, prefer passing `--project <project-id>` unless the user wants the current directory linked.

Read the active project:

```bash
bult status --json
```

If no project is selected, use one of:

```bash
bult --project <project-id> status --json
bult link <project-id>
bult project select
```

Use `project select` only when an interactive picker is acceptable.

## Output Rules

Use `--json` for reads whenever possible:

```bash
bult project list --json
bult service list --json
bult status --json
bult logs <service> --json
```

For user-facing summaries, report the important result in plain language and include exact names, IDs, statuses, and any errors.

## Safety Rules

Require clear user intent before running:

```bash
bult project delete <project-id> --force
bult service delete <service> --force
bult service stop <service>
bult link <project-id>
```

Before mutating a service by name, resolve ambiguity:

```bash
bult service list --json
```

If multiple services have the same name, use the service ID.

After any create, update, delete, start, stop, rebuild, or deploy, verify with:

```bash
bult status --json
```

or:

```bash
bult service list --json
```

Use logs for runtime verification when the user asks about deployment health, crashes, or behavior:

```bash
bult logs <service>
```

## Common Error Handling

- `not logged in`: ask the user to run `bult login`.
- `no project selected`: ask for a project ID, run `bult project list --json`, pass `--project`, or run `bult link <project-id>` if linking is desired.
- `ambiguous service name`: run `bult service list --json` and use a service ID.
- Websocket errors from logs or exec: verify auth, project ID, service ID, and network access with `status --json`.

