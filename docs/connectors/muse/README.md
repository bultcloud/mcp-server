# Bult REST connector integration

Base URL: `https://app.bult.ai/api/v1`

Authenticate each request with `Authorization: Bearer <BULT_API_TOKEN>` and send JSON bodies with `Content-Type: application/json`. Use a separate Bult account/workspace for review. Tokens are workspace credentials; do not describe them as project-scoped or read-only unless that restriction has been implemented and verified. Never share a personal workspace token with reviewers.

## Reference

The accompanying `openapi.json` describes Docker/GitHub deployment, database configuration, templates and diagnostics. It is a scoped connector contract, not the entire Bult API. `generate-openapi.py` regenerates it without dependencies. Template application currently requires workspace JWT authentication: the live API-key test returned INVALID_TOKEN. See the capability tests below before selecting connector operations.

The API returns `{ "status": "OK", "data": ..., "error": null }` for normal resource operations. Project creation returns a string ID in `data`; service and route creation return objects. Deployment returns acceptance, not proof of a running application. Some lifecycle endpoints instead return `{ "message": "OK" }`. Errors can be an envelope with `error.message` or a simple string `error`; inspect HTTP status before interpreting data.

## Verified request example

Create a project with `POST /projects` and `{ "name": "Muse review demo" }`. Use the returned ID in `POST /projects/{project_id}/services` with `service-example.json`. The example's compute box must be available to the authenticated account; do not assume a universal box ID. The example uses a public Nginx image and no secrets or persistent storage.

1. List projects: `GET /projects`.
2. Create a dedicated project and service. Save returned IDs immediately.
3. Create a route: `POST /projects/{project_id}/routes` with `{ "service_id": "<service_id>", "port": 80, "path": "/" }`. Read back the route domain. An empty domain is not a usable URL; configure a permitted domain before claiming publication.
4. Deploy: `POST /projects/{project_id}/deploy` with `{ "commit_message": "Connector review", "services": [] }`.
5. Poll `GET /projects/{project_id}/services` with a bounded timeout. Read `GET /projects/{project_id}/overview` for route information. A blank status is unknown, not healthy.
6. Request the route over HTTPS, without the Bult token. Require HTTP 200 and the `bult-muse-review-ok` marker. A route record alone is not proof of reachability.
7. Read `GET /projects/services/{service_id}/logs`. Preserve the opaque `data.cursor` when requesting another page. Logs may arrive later than the HTTP request.
8. If it fails, report the failed stage and evidence. Do not claim deployment success just because the deploy request succeeded.

## Permissions and side effects

| Operations | Classification | Effect |
| --- | --- | --- |
| List projects, overview, list/get services, logs, build history | Read | Reads workspace configuration and runtime information |
| Create project/service/route, deploy | Write; consequential publishing/resource allocation | May expose an application publicly and incur resource charges |
| Update service/route, rebuild, stop | Write; potentially disruptive | May change public behavior or interrupt availability |
| Delete project/service/volume, wipe volume | Destructive write | Can permanently remove resources/data; exclude from initial connector scope |

These are integration classifications, not claims that the backend enforces OAuth scopes. Honor the host's approval flow and enforce access on the backend. Logs, environment variables and image credentials may contain secrets: remove secret fields before model context, user-visible summaries and diagnostic exports. Do not claim existing MCP responses are automatically sanitized.

## Errors, retries and limits

Handle 400 (invalid request), 401 (invalid/expired credentials), 403 (denied/inactive workspace), 404 (not found), 406 (insufficient balance), 409 (conflict) and 5xx (server failure). These mappings were checked against a backend source snapshot; gateways can introduce other statuses and non-JSON bodies. Respect 429 and Retry-After if returned. Numeric API limits and regional/account quotas need confirmation from the platform owner; no unlimited-use claim is made here.

Do not blindly retry resource creation, template application or deployment after a timeout. First inspect saved IDs and current project state; server-side idempotency keys have not been verified. Retry transient reads with capped exponential backoff. A suggested reviewer polling interval is 5 seconds with a 5-minute deadline, not an API SLA.

## Review scope

Supported prompts with live evidence: deploy a public Docker image or public GitHub Dockerfile repository; list projects/services; inspect runtime logs; list templates. PostgreSQL service creation and initialization SQL passed, but persistent database provisioning has not passed end to end. Template application failed with API-key authentication. Build history is not full build-log access.

## GitHub deployment

Use `POST /projects/{project_id}/services` with kind `daemon`, deploy.source_type `git`, git_url, git_branch, an available box_id and the selected build_type. Dockerfile builds additionally specify dockerfile_path and optionally dockerfile_context. The tested example is in `github-example.json`: Docker's public welcome-to-docker repository, main branch, Dockerfile, port 3000. Create a matching route, deploy and wait for build history to report success before checking HTTPS. Set auto_deploy explicitly; the test disables automatic deployment on later repository pushes.

Private repositories require the user's authorized GitHub integration and correct installation_id. The public-repository test does not verify private repository permissions, automatic redeployment or Railpack builds.

## PostgreSQL and templates

Database services use kind `database`, database.type `postgresql`, a PostgreSQL Docker image, and POSTGRES_USER/POSTGRES_PASSWORD/POSTGRES_DB environment entries. Generate a unique password and keep the database internal. The live test used postgres:16-alpine and ran CREATE TABLE, INSERT and SELECT during initialization; the expected marker appeared in logs.

Creating the service alone did not create persistent storage. A volume must be mounted at the image's expected data path before treating it as a durable database. The reviewed REST/MCP subset has no volume-mount creation operation. Do not invent a REST mount endpoint or imply that create-volume alone attaches storage.

List templates with `GET /projects/templates`. The PostgreSQL template inspected during review includes one postgres:16-alpine database service, one volume and a mount at /var/lib/postgresql/data, with no public route. It contains default credentials; replace them before deployment.

Apply with `POST /projects/{project_id}/{template_id}/apply` and an empty JSON object for the default template. However, the live API-key call returned INVALID_TOKEN while ordinary project/service operations continued working. The backend source snapshot attaches JWT-only AuthMiddleware to this route. The OpenAPI explicitly declares the separate workspace JWT requirement. Fix/confirm the deployed authentication contract and retest before offering template application through the API-key connector. No JWT login/refresh flow is supplied by this document.

Persistent PostgreSQL acceptance requires a mounted volume, a SQL write, a controlled restart and a SQL read proving the same record survived. That check remains pending, not failed database functionality.

CLI and agent workflows: https://github.com/bultcloud/cli

Local stdio MCP: https://github.com/bultcloud/mcp-server

## Repeat the read-only checks

After deployment, supply `BULT_API_TOKEN` through your local secret manager/environment and set `BULT_REVIEW_PROJECT_ID`, `BULT_REVIEW_SERVICE_ID`, and `BULT_REVIEW_URL` to the dedicated review resources. Run `python docs/connectors/muse/verify-review.py` from the repository root. The helper checks unauthenticated rejection, authenticated reads, service/route ownership, logs and the public page marker. It never creates or removes resources. It emits only status/count evidence; empty logs are reported rather than treated as proof of application activity. See `verification.md` for checks actually completed in this session.

## Publication URLs

Publish this directory on the Bult documentation site or in the public repository after review. Until published, there is no public URL for this guide or its OpenAPI file. Do not enter a hypothetical URL in the Muse form. Serve `openapi.json` as JSON over HTTPS, then validate the publicly fetched copy.

Muse review requirements: https://muse.ai/platform/docs
