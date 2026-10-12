"""Generate the deliberately scoped REST connector contract; no network calls."""
import json
from pathlib import Path

ROOT = Path(__file__).parent
def obj(properties, required=()):
    return {"type": "object", "properties": properties, "required": list(required)}
def ref(name):
    return {"$ref": "#/components/schemas/" + name}
string = {"type": "string"}
schemas = {
    "Envelope": obj({"status": string, "data": {}, "error": {}}),
    "ServiceConfig": obj({
        "kind": {"type": "string", "enum": ["daemon", "database"]},
        "daemon": obj({"replicas": {"type": "integer"}}),
        "database": {"type": "object", "description": "Database configuration is outside the tested Docker demo."},
        "deploy": obj({"box_id": {"type": "integer"}, "source_type": {"type": "string", "enum": ["docker", "git"]}, "image": string, "is_image_private": {"type": "boolean"}, "git_url": string, "git_branch": string, "build_type": string, "cmd": string, "entrypoint": string}, ["box_id", "source_type"]),
        "ports": {"type": "array", "items": {"type": "integer", "minimum": 1, "maximum": 65535}},
        "envs": {"type": "array", "items": {"type": "object"}, "description": "Potential secrets; exclude from AI context."},
        "files": {"type": "array", "items": obj({"path": string, "content": string}, ["path", "content"])}
    }, ["kind", "deploy"]),
    "ServiceInput": obj({"name": {"type": "string", "maxLength": 63, "pattern": "^[a-z]([-a-z0-9]*[a-z0-9])?$"}, "config": ref("ServiceConfig")}, ["name", "config"]),
    "RouteInput": obj({"service_id": string, "domain": string, "path": string, "port": {"type": "integer", "minimum": 1, "maximum": 65535}}, ["service_id", "port"]),
}
spec = {"openapi": "3.1.0", "info": {"title": "Bult connector REST API subset", "version": "0.1.0", "description": "Docker deployment and diagnostics subset derived from Bult MCP and backend source. See verification.md for live coverage. Additional response fields are allowed; not a complete platform contract."}, "servers": [{"url": "https://app.bult.ai/api/v1"}], "security": [{"BultToken": []}], "paths": {}, "components": {"securitySchemes": {"BultToken": {"type": "http", "scheme": "bearer", "description": "Bult API token; no OAuth scope claim."}}, "schemas": schemas}}
def add(method, path, operation, summary, data=None, body=None, code="200"):
    import re
    response = obj({"status": string, "data": data if data is not None else {}, "error": {}})
    op = {"operationId": operation, "summary": summary, "x-bult-permission": "read" if method == "get" else "write", "parameters": [{"name": n, "in": "path", "required": True, "schema": string} for n in re.findall(r"\{(\w+)\}", path)], "responses": {code: {"description": "Accepted; deployment readiness requires separate verification." if operation == "deployProject" else "Success", "content": {"application/json": {"schema": response}}}, "default": {"description": "Failure: inspect HTTP status and error. Error body may vary by gateway.", "content": {"application/json": {"schema": {}}}}}}
    if body:
        op["requestBody"] = {"required": True, "content": {"application/json": {"schema": body}}}
    spec["paths"].setdefault(path, {})[method] = op
    return op
add("get", "/projects", "listProjects", "List accessible projects", {"type": "array", "items": {"type": "object"}})
add("post", "/projects", "createProject", "Create a project", string, obj({"name": string}, ["name"]), "201")
add("get", "/projects/{project_id}/overview", "getProject", "Project services, routes and volumes", {"type": "object"})
add("get", "/projects/{project_id}/services", "listServices", "List services and observed status", {"type": "array", "items": {"type": "object"}})
add("post", "/projects/{project_id}/services", "createService", "Create a service configuration", {"type": "object"}, ref("ServiceInput"), "201")
add("get", "/projects/services/{service_id}", "getService", "Read service configuration; may include secrets", {"type": "object"})
add("post", "/projects/{project_id}/routes", "createRoute", "Create public route configuration", {"type": "object"}, ref("RouteInput"), "201")
add("put", "/projects/routes/{route_id}", "updateRoute", "Update public route configuration", {"type": "object"}, ref("RouteInput"))
add("post", "/projects/{project_id}/deploy", "deployProject", "Initiate deployment", {"type": "null"}, obj({"commit_message": string, "services": {"type": "array", "items": string}}, ["commit_message", "services"]), "201")
logs = add("get", "/projects/services/{service_id}/logs", "getServiceLogs", "Read runtime logs", obj({"logs": {"type": ["array", "null"], "items": {"type": "object"}}, "cursor": string}))
logs["parameters"].append({"name": "cursor", "in": "query", "schema": string, "description": "Opaque cursor from the previous response."})
add("get", "/projects/services/{service_id}/builds", "listBuilds", "Read build history; not full build logs")
(ROOT / "openapi.json").write_text(json.dumps(spec, indent=2) + "\n", encoding="utf-8")
print(f"Generated {sum(len(p) for p in spec['paths'].values())} operations")
