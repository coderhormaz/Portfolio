import { requireAuth, unauthorizedError } from "@/lib/agent-auth";

export async function GET(req: Request) {
  if (!requireAuth(req)) return unauthorizedError("Agent auth endpoint");
  return Response.json({ ok: true, flow: "see /auth.md" });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: "GET, POST, OPTIONS" },
  });
}

export async function POST(req: Request) {
  if (!requireAuth(req)) return unauthorizedError("Agent auth endpoint");
  return Response.json({ ok: true });
}
