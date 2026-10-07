import { requireAuth, unauthorizedError } from "@/lib/agent-auth";

export async function GET(req: Request) {
  if (!requireAuth(req)) return unauthorizedError("Portfolio API v2");
  return Response.json({ ok: true, version: "v2" });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: { Allow: "GET, OPTIONS" } });
}
