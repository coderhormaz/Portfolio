import { SITE_URL } from "@/lib/site";
import { requireAuth, unauthorizedError } from "@/lib/agent-auth";

export async function GET(req: Request) {
  if (!requireAuth(req)) return unauthorizedError("Portfolio API");
  return Response.json({
    ok: true,
    message: "Authenticated. See /openapi.json for the full surface.",
    endpoints: [
      "/api/profile",
      "/api/projects",
      "/api/experience",
      "/api/contact",
      "/api/health",
      "/api/sandbox",
      "/api/mcp",
    ],
    docs: `${SITE_URL}/docs`,
    openapi: `${SITE_URL}/openapi.json`,
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: "GET, OPTIONS" },
  });
}
