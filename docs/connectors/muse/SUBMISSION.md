# Muse submission handoff

Connection type: Raw API

API URL: `https://app.bult.ai/api/v1`

Authentication: API keys (Authorization: Bearer)

## URLs after publication

If these files are merged into the public repository's main branch, use:

- Documentation: `https://github.com/bultcloud/mcp-server/blob/main/docs/connectors/muse/README.md`
- OpenAPI: `https://raw.githubusercontent.com/bultcloud/mcp-server/main/docs/connectors/muse/openapi.json`

These are proposed publication destinations, not live verified links. Check both return the intended content before using them in the submission.

## Example prompts for the tested initial scope

- Deploy a public Docker image to Bult and verify its public URL.
- Deploy a public GitHub repository using its Dockerfile and verify its public URL.
- Show my Bult projects and service status.
- Read the runtime logs for my application and explain the reported errors.
- Show the available application and database templates.

Template application currently fails with the API-key connector (INVALID_TOKEN); persistent PostgreSQL provisioning remains unverified. Keep full template launch and durable database creation prompts out of the API-key submission until the authentication/mounting path is resolved and retested. This is a connector access limitation, not a statement that the dashboard lacks those features.

## Access requirements

Requires a Bult.ai account and a valid Bult API token. Requests use Bearer authentication. Resource creation and deployment depend on account access, available capacity and billing status. Cloud resource usage is billed through Bult; the connector does not process payments.

Add the platform's confirmed numerical API limits and applicable regional restrictions before review. No such values were verified in this preparation.

## Proposed publication scope

Publish only the files in `docs/connectors/muse/`, excluding Python caches. No application code or unrelated plugin changes are needed. The evidence report contains identifiers of the synthetic demonstration project, but no credentials or customer configuration.

## Review access

Dedicated account email: awaiting owner selection.

Token: issue in that separate account, store securely, and provide only through the review credential channel. Do not reuse the currently connected owner's token. Follow REVIEW-CHECKLIST.md and rerun verify-review.py against the review account before claiming that account is ready.
