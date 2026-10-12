# Verification evidence

Date: 2026-10-12. Result: owner-workspace deployment flow passed; dedicated reviewer-account acceptance is pending.

## Evidence sources

- MCP checkout: `fc3680e7c2078516541c3032023a563bff175229`; all six tool registration files and the HTTP client inspected.
- Backend source snapshot: `cdd7486b95c27325f022530bbc57c6befbfbc631`; request models, HTTP handlers, response helper and authentication middleware inspected. This older source snapshot is not proof of the currently deployed backend revision.
- Authenticated live operations used the configured Bult MCP, which forwards REST requests. Raw authenticated wire envelopes were not captured; response schemas remain source-derived.

## Live test results

| Stage | Result |
| --- | --- |
| List projects using configured credentials | Passed |
| Create isolated demo project | Passed |
| Create Docker service with inline static page | Passed |
| Create route without domain | Accepted, but domain remained empty; automatic URL generation was not observed |
| Set explicit Bult application domain | Passed |
| Deploy | Accepted on both initial deployment and route correction |
| List service status | `running` at 2026-10-12T10:53:08Z |
| Fetch public URL | curl HTTPS 200, expected `bult-muse-review-ok` marker at 10:52:53 UTC |
| Runtime logs | Nginx startup logs and nonempty pagination cursor returned |
| Missing API credentials | Raw GET /api/v1/projects returned HTTP 401 and `{"error":"auth header is empty"}` |
| OpenAPI structure | Passed openapi-spec-validator validation |
| Python helper syntax | Passed py_compile |

The additional service-example-to-schema validation was not completed: automatic approval review rejected its execution after an account usage limit was reached. This is separate from the successful OpenAPI structural validation above.

An earlier Python urllib public request returned 403. A later curl request passed; the difference may be propagation or edge/client behavior and has not been isolated. Recheck from the actual connector client before approval.

## Demo inventory

- Project: `Muse Connector Review Demo`, `9e03f89f-ec93-4deb-a9ec-87200384f2e1`
- Service: `connector-demo`, `e939a267-02b2-47d7-9cd0-0d4fe0b7a56b`
- Route: `b152d054-79a2-4a72-9433-6ba16ecc270d`
- URL: https://muse-review-9e03f89f.fin1.bult.app/
- Image: `nginx:stable-alpine`; mutable tag, runtime logged Nginx 1.30.5. Pin a verified digest if identical future reproduction is required.
- One service, compute box 1, no volumes, no database, no application secrets.
- Resources remain running in the owner's existing workspace and may accrue charges. This workspace must not be handed to reviewers. Stop or delete this specific demo after it is no longer needed.

## Still outstanding

- Dedicated review account/workspace, reviewer token issuance, account-isolation test and workflow rerun under that token.
- Exact plan/region/rate limits confirmed by the platform owner.
- Publication of guide and OpenAPI; no commit, push or public documentation upload performed.
- Hosted Muse execution, OAuth and remote MCP have not been tested or implemented.
- GitHub deployment, database creation, templates, destructive actions and retry behavior were not live-tested in this run. Remove those prompts from the initial submission or test them separately.
- `verify-review.py` is a read-only rerun helper. Syntax checked; not executed with a dedicated reviewer token because that token/account does not exist yet.
