---
name: bult-projects
description: "Create, list, select, link, inspect, and delete Bult projects."
---

# Skill: Bult Projects

## Use When

Use this skill when the user asks to create, list, select, link, inspect, or delete Bult projects.

## Required Context

Before changing projects, identify:

- desired project name or project ID
- whether the current directory should be linked to the project
- whether deletion is explicitly intended

## List Projects

```bash
bult project list --json
```

Summarize project names, IDs, service counts, and creation dates.

## Create A Project

```bash
bult project create <name>
```

After creation, verify it appears:

```bash
bult project list --json
```

If the user wants to work in it immediately, either pass `--project <project-id>` in future commands or link the directory:

```bash
bult link <project-id>
```

## Link Current Directory

Run this from the user's target application directory, not from an arbitrary shell location:

```bash
bult link <project-id>
```

This writes `.bult.yaml`:

```yaml
project_id: <project-id>
```

Verify:

```bash
bult status --json
```

Do not overwrite an existing `.bult.yaml` unless the user wants this directory relinked.

## Select Default Project

Interactive:

```bash
bult project select
```

Use only when the agent can interact with a terminal picker or when the user is driving the terminal.

For non-interactive workflows, use:

```bash
bult --project <project-id> status --json
```

## Delete A Project

Deletion is destructive. Confirm the exact project name and ID first:

```bash
bult project list --json
```

Then run only after explicit user intent:

```bash
bult project delete <project-id> --force
```

Verify:

```bash
bult project list --json
```


