"""Read-only verification after the README deployment steps. No credentials printed."""
import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from urllib.parse import urlparse, quote

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

def main():
    token = os.environ.get("BULT_API_TOKEN")
    project = os.environ.get("BULT_REVIEW_PROJECT_ID")
    service = os.environ.get("BULT_REVIEW_SERVICE_ID")
    public_url = os.environ.get("BULT_REVIEW_URL")
    if not all([token, project, service, public_url]):
        raise ValueError("Set BULT_API_TOKEN, BULT_REVIEW_PROJECT_ID, BULT_REVIEW_SERVICE_ID and BULT_REVIEW_URL locally.")
    parsed = urlparse(public_url)
    if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
        raise ValueError("BULT_REVIEW_URL must be an HTTPS URL without credentials.")
    opener = urllib.request.build_opener(NoRedirect())
    checks = []
    def request(label, url, authenticated=False):
        headers = {"Authorization": "Bearer " + token} if authenticated else {}
        try:
            with opener.open(urllib.request.Request(url, headers=headers), timeout=30) as r:
                code, body = r.status, r.read(2_000_000)
        except urllib.error.HTTPError as e:
            code, body = e.code, e.read(2_000_000)
        checks.append({"check": label, "http_status": code})
        return code, body
    base = "https://app.bult.ai/api/v1"
    code, _ = request("unauthenticated request rejected", base + "/projects")
    if code not in (401, 403):
        raise ValueError("Unauthenticated request was not rejected as expected.")
    for label, path in [("projects", "/projects"), ("overview", f"/projects/{quote(project, safe='')}/overview"), ("services", f"/projects/{quote(project, safe='')}/services"), ("logs", f"/projects/services/{quote(service, safe='')}/logs")]:
        code, body = request(label, base + path, True)
        if code != 200:
            raise ValueError(label + " failed with HTTP " + str(code))
        payload = json.loads(body)
        if payload.get("error") or payload.get("status") != "OK":
            raise ValueError(label + " returned an API error or unexpected envelope")
        data = payload.get("data")
        if label == "overview":
            if data.get("id") != project or not any(s.get("id") == service for s in data.get("services", [])):
                raise ValueError("Service does not belong to the selected project")
            if not any(r.get("service_id") == service and r.get("domain") == parsed.hostname for r in data.get("routes", [])):
                raise ValueError("URL does not match a route for this service")
        if label == "logs":
            checks[-1]["log_count"] = len(data.get("logs") or [])
            checks[-1]["cursor_present"] = bool(data.get("cursor"))
    code, body = request("public endpoint", public_url)
    if code != 200 or b"bult-muse-review-ok" not in body:
        raise ValueError("Public endpoint did not return HTTP 200 and the expected marker")
    print(json.dumps({"verified_at": datetime.now(timezone.utc).isoformat(), "result": "PASS", "checks": checks}, indent=2))

if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        # Do not output response bodies, request headers, or exception URLs.
        print("Verification failed: " + (str(exc) if isinstance(exc, ValueError) else type(exc).__name__), file=sys.stderr)
        sys.exit(1)
