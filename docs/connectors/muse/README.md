# Bult REST connector integration

Base URL: `https://app.bult.ai/api/v1`

Authenticate each request with `Authorization: Bearer <BULT_API_TOKEN>` and send JSON bodies with `Content-Type: application/json`. Use a separate Bult account/workspace for review. Tokens are workspace credentials; do not describe them as project-scoped or read-only unless that restriction has been implemented and verified. Never share a personal workspace token with reviewers.

## Reference

The accompanying `openapi.json` describes the initial Docker deployment and diagnostic workflow. It is a scoped connector contract, not the entire Bult API. `generate-openapi.py` regenerates it without dependencies. The MCP source in `src/tools/` documents additional project, volume, template and service operations.

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

Initial prompts: deploy a public Docker image and return its verified URL; list projects/services; inspect runtime logs. GitHub builds, database provisioning and template deployment need their own successful tests before including them as verified examples. Build history is not full build-log access.

CLI and agent workflows: https://github.com/bultcloud/cli

Local stdio MCP: https://github.com/bultcloud/mcp-server

## Repeat the read-only checks

After deployment, supply `BULT_API_TOKEN` through your local secret manager/environment and set `BULT_REVIEW_PROJECT_ID`, `BULT_REVIEW_SERVICE_ID`, and `BULT_REVIEW_URL` to the dedicated review resources. Run `python docs/connectors/muse/verify-review.py` from the repository root. The helper checks unauthenticated rejection, authenticated reads, service/route ownership, logs and the public page marker. It never creates or removes resources. It emits only status/count evidence; empty logs are reported rather than treated as proof of application activity. See `verification.md` for checks actually completed in this session.

## Publication URLs

Publish this directory on the Bult documentation site or in the public repository after review. Until published, there is no public URL for this guide or its OpenAPI file. Do not enter a hypothetical URL in the Muse form. Serve `openapi.json` as JSON over HTTPS, then validate the publicly fetched copy.

Muse review requirements: https://muse.ai/platform/docs
