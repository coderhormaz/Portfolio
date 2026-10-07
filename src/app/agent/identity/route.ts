import { SITE_URL } from "@/lib/site";
import { requireAuth, unauthorizedError } from "@/lib/agent-auth";

export async function GET(req: Request) {
  if (!requireAuth(req)) return unauthorizedError("Agent identity endpoint");
  return Response.json({
    sub: "agent:demo",
    name: "Demo Agent",
    identity_endpoint: `${SITE_URL}/api/agent/identity`,
    claim_endpoint: `${SITE_URL}/api/agent/claim`,
    events_endpoint: `${SITE_URL}/api/agent/events`,
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: "GET, POST, OPTIONS" },
  });
}

export async function POST(req: Request) {
  if (!requireAuth(req)) return unauthorizedError("Agent identity endpoint");
  return Response.json({ ok: true });
}
