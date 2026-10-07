import { randomBytes } from "node:crypto";
import { SITE_URL } from "@/lib/site";
import {
  getIdempotentResult,
  idempotencyKeyFrom,
  jsonError,
  storeIdempotentResult,
} from "@/lib/agent-auth";

const issued = new Map<string, number>();

export async function POST(req: Request) {
  const idemKey = idempotencyKeyFrom(req);
  const replay = getIdempotentResult(idemKey);
  if (replay) return replay;

  let body: { email?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  if (body.email !== undefined && (typeof body.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))) {
    return jsonError(
      "invalid_email",
      "Optional field 'email' must be a valid email address.",
      "Omit email for an anonymous demo key, or fix the format.",
      422,
    );
  }
  const api_key = `hd_demo_${randomBytes(12).toString("hex")}`;
  issued.set(api_key, Date.now());
  const resBody = {
    api_key,
    token_type: "Demo",
    expires_in: 86400,
    scopes: ["read", "contact:validate", "mcp:call"],
    use: "Send as x-api-key header or Authorization: Bearer to gated endpoints (/api, /api/v1). Free tier: all reads are keyless.",
    docs: `${SITE_URL}/auth.md`,
  };
  storeIdempotentResult(idemKey, 201, resBody);
  return Response.json(resBody, { status: 201 });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: { Allow: "POST, OPTIONS" } });
}
