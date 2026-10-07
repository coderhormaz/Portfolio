import { requireAuth, unauthorizedError } from "@/lib/agent-auth";

export async function GET(req: Request) {
  if (!requireAuth(req)) return unauthorizedError("Portfolio API v1");
  return Response.json({
    ok: true,
    version: "v1",
    endpoints: ["/api/profile", "/api/projects", "/api/experience", "/api/contact"],
  });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: { Allow: "GET, OPTIONS" } });
}
