import { profile, clientProjects, personalProjects, experiences } from "@/data/portfolio";
import { SITE_URL } from "@/lib/site";
import {
  getIdempotentResult,
  idempotencyKeyFrom,
  jsonError,
  storeIdempotentResult,
} from "@/lib/agent-auth";

const ALLOWLIST = new Set([
  "/api/profile",
  "/api/projects",
  "/api/experience",
  "/api/contact",
  "/api/health",
  "/api/sandbox",
]);

function resourceBody(pathname: string, search: URLSearchParams): unknown {
  if (pathname === "/api/profile") return { profile };
  if (pathname === "/api/experience") return { experiences };
  if (pathname === "/api/health") return { status: "ok", site: SITE_URL };
  if (pathname === "/api/sandbox") {
    return { name: "Portfolio API sandbox", base_url: `${SITE_URL}/api`, is_sandbox: true };
  }
  if (pathname === "/api/contact") {
    return { email: profile.email, location: profile.location, availability: profile.availability };
  }
  if (pathname === "/api/projects") {
    const type = search.get("type");
    const q = (search.get("q") || "").toLowerCase();
    let all = [
      ...clientProjects.map((p) => ({ ...p, kind: "client" })),
      ...personalProjects.map((p) => ({ ...p, kind: "personal" })),
    ];
    if (type === "client" || type === "personal") all = all.filter((p) => p.kind === type);
    if (q) {
      all = all.filter((p) =>
        `${p.title} ${p.subtitle} ${p.description} ${p.tags.join(" ")}`.toLowerCase().includes(q),
      );
    }
    return { count: all.length, projects: all.slice(0, 20) };
  }
  return null;
}

export async function POST(req: Request) {
  const idemKey = idempotencyKeyFrom(req);
  const replay = getIdempotentResult(idemKey);
  if (replay) return replay;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(
      "invalid_json",
      "Request body must be valid JSON.",
      "Send {operations:[{method:'GET', path:'/api/profile'}]}.",
      400,
    );
  }
  const ops = (body as Record<string, unknown>)?.operations;
  if (!Array.isArray(ops) || ops.length === 0 || ops.length > 20) {
    return jsonError(
      "invalid_operations",
      "Field 'operations' must be an array of 1-20 {method, path} entries.",
      "Only GET reads from the allowlisted paths are executed in bulk.",
      422,
    );
  }
  const results = ops.map((op) => {
    const entry = (op || {}) as Record<string, unknown>;
    const method = entry.method;
    const rawPath = entry.path;
    if (method !== "GET" || typeof rawPath !== "string") {
      return { path: rawPath, status: 422, body: { error: { code: "unsupported_operation", message: "Only {method:'GET', path} reads are supported in batch.", hint: "Use POST /api/contact for writes." } } };
    }
    let pathname = rawPath;
    let search = new URLSearchParams();
    try {
      const u = new URL(rawPath, SITE_URL);
      pathname = u.pathname;
      search = u.searchParams;
    } catch {
      return { path: rawPath, status: 422, body: { error: { code: "invalid_path", message: "Path must be a valid /api/* path.", hint: "See /openapi.json." } } };
    }
    if (!ALLOWLIST.has(pathname)) {
      return { path: rawPath, status: 404, body: { error: { code: "not_batched", message: `${pathname} is not batchable.`, hint: `Batchable: ${[...ALLOWLIST].join(", ")}.` } } };
    }
    return { path: rawPath, status: 200, body: resourceBody(pathname, search) };
  });
  const resBody = { count: results.length, results };
  storeIdempotentResult(idemKey, 200, resBody);
  return Response.json(resBody);
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: { Allow: "POST, OPTIONS" } });
}
