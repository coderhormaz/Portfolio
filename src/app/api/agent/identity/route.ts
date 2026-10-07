import { SITE_URL } from "@/lib/site";

export async function GET() {
  return Response.json({
    sub: "agent:anonymous",
    mode: "anonymous",
    identity_endpoint: `${SITE_URL}/api/agent/identity`,
    claim_endpoint: `${SITE_URL}/api/agent/claim`,
    events_endpoint: `${SITE_URL}/api/agent/events`,
    how: "POST an ID-JAG or service credential to claim_endpoint. See /auth.md.",
  });
}

export async function POST() {
  return Response.json({
    ok: true,
    access_token: "demo-token-anonymous",
    token_type: "Bearer",
    expires_in: 3600,
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: "GET, POST, OPTIONS" },
  });
}
