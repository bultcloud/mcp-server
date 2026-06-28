# Skill: Bult Services

## Use When

Use this skill when the user asks to create, configure, update, start, stop, rebuild, delete, or inspect Bult services.

## Required Context

Before creating or updating a service, collect:

- project ID or confirmed active project
- service name
- source type: `docker` or `git`
- Docker image, or Git repository URL and branch
- exposed ports
- service kind: `daemon` or `database`
- compute box ID if the default `1` is not correct

## Inspect Services

```bash
bult service list --json
bult status --json
```

Use service IDs for mutations when names are duplicated or unclear.

## Create Docker Service

```bash
bult service create \
  --name <name> \
  --source-type docker \
  --image <image> \
  --port <port> \
  --kind daemon
```

Multiple ports:

```bash
bult service create \
  --name <name> \
  --source-type docker \
  --image <image> \
  --port 80 \
  --port 443
```

## Create Git Service

```bash
bult service create \
  --name <name> \
  --source-type git \
  --git-url <repository-url> \
  --git-branch <branch> \
  --port <port> \
  --kind daemon
```

## Create Flags

- `--name`: required service name
- `--source-type`: `docker` or `git`, default `docker`
- `--image`: Docker image for docker services
- `--git-url`: Git repository URL for git services
- `--git-branch`: Git branch, default `main`
- `--box-id`: compute box ID, default `1`
- `--kind`: `daemon` or `database`, default `daemon`
- `--port`: exposed port, repeatable

Verify creation:

```bash
bult service list --json
bult status --json
```

## Update Service

`service update` reads JSON from stdin:

```bash
printf '%s\n' '<json-payload>' | bult service update <service-id>
```

Safe update workflow:

1. Run `bult status --json`.
2. Locate the exact service and preserve existing config not mentioned by the user.
3. Build a valid JSON payload.
4. Run `service update` against the service ID.
5. Verify with `bult status --json`.

Do not remove `envs`, `files`, `ports`, or deploy fields unless the user explicitly asked for that removal.

## Lifecycle Commands

```bash
bult service start <service-id-or-unique-name>
bult service stop <service-id-or-unique-name>
bult service rebuild <service-id-or-unique-name>
```

Stopping a service affects availability. Run `service stop` only when the user clearly asked to stop that service. If the user asks to "restart", clarify whether they mean `rebuild` or a stop/start cycle.

After start, stop, or rebuild:

```bash
bult status --json
bult logs <service-id-or-unique-name>
```

## Delete Service

Deletion is destructive. Confirm the exact service name and ID:

```bash
bult service list --json
```

Then run only after explicit user intent:

```bash
bult service delete <service-id> --force
```

Verify:

```bash
bult service list --json
bult status --json
```
