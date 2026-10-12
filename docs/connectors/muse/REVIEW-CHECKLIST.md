# Connector review preparation

## Account setup

- Owner selects a dedicated company-controlled email and completes sign-in/email verification.
- Create an isolated workspace with no customer applications, production data or secrets.
- Enable enough credit/quota for one small web service. Record actual applicable limits and region.
- Create a review-only API token through Bult's supported account flow; record its expiry securely.
- Store it in the review team's secret manager. Deliver credentials only through Muse's secure review channel, never Git, a public document, chat or form notes.
- Confirm the reviewer token lists only review projects. Re-run the workflow using that token. An owner-workspace demo does not establish reviewer-account isolation.
- Revoke credentials and remove the review environment when review is finished; keep the environment available during review.

## Test matrix

| Test | Expected evidence |
| --- | --- |
| Valid credentials | Project listing succeeds |
| Missing/invalid token | Access rejected without workspace data |
| Account separation | Review token cannot retrieve a test resource in a different controlled workspace |
| Create and deploy | Saved project/service/route IDs; deployment accepted |
| Reachability | HTTPS 200 and the expected marker |
| Runtime logs | Log response from the same service; cursor captured if present |
| Invalid port/configuration | Rejected without a partial successful claim |
| Interrupted mutation | Read state before retry; no duplicate resources |
| Cleanup | Stop/delete only the explicitly selected review resources |

Record timestamps, stages, HTTP statuses and sanitized results. Do not include credentials, customer configuration or raw environment variables.

## Before submission

Publish and fetch the integration guide/OpenAPI, fill the actual rate/account restrictions, provide reviewer credentials securely, and limit advertised prompts to tested workflows. Hosted MCP and OAuth are separate future work and are not required for the Raw API route.
