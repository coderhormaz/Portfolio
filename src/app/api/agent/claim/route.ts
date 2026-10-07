import { getIdempotentResult, idempotencyKeyFrom, jsonError, storeIdempotentResult } from "@/lib/agent-auth";

export async function GET() {
  return Response.json({
    endpoint: "claim",
    accepts: ["identity_assertion", "service_auth"],
    assertion_types_supported: ["urn:ietf:params:oauth:token-type:id-jag"],
    how: "POST {assertion, identity_type} to mint an access token. See /auth.md.",
  });
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
      "Claim body must be valid JSON.",
      "POST {assertion, identity_type} per /auth.md.",
      400,
    );
  }
  const { assertion, identity_type } = (body || {}) as Record<string, unknown>;
  if (typeof assertion !== "string" || assertion.length < 8) {
    return jsonError(
      "invalid_assertion",
      "Field 'assertion' must be a non-empty credential string.",
      "Mint an ID-JAG from your identity provider, or use service_auth. See /auth.md Errors.",
      422,
    );
  }
  if (
    identity_type !== "identity_assertion" &&
    identity_type !== "service_auth" &&
    identity_type !== "anonymous"
  ) {
    return jsonError(
      "unsupported_identity_type",
      "identity_type must be one of: anonymous, identity_assertion, service_auth.",
      "See /auth.md Pick a method.",
      422,
    );
  }
  const resBody = {
    access_token: "demo-token-claimed",
    token_type: "Bearer",
    expires_in: 3600,
    identity_type,
  };
  storeIdempotentResult(idemKey, 200, resBody);
  return Response.json(resBody);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: "GET, POST, OPTIONS" },
  });
}
