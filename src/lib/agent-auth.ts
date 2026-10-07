import { SITE_URL } from "@/lib/site";

export const PRM_URL = `${SITE_URL}/.well-known/oauth-protected-resource`;
export const AS_URL = `${SITE_URL}/.well-known/oauth-authorization-server`;

export function wwwAuthenticateHeader(): string {
  return `Bearer resource_metadata="${PRM_URL}"`;
}

export function jsonError(
  code: string,
  message: string,
  hint: string,
  status = 400,
  extraHeaders?: Record<string, string>,
) {
  return Response.json(
    { error: { code, message, hint, docs: `${SITE_URL}/docs` } },
    { status, headers: extraHeaders },
  );
}

export function unauthorizedError(resource = "API") {
  return Response.json(
    {
      error: {
        code: "unauthorized",
        message: `${resource} requires authentication. See ${SITE_URL}/auth.md for how to obtain credentials.`,
        hint: `Fetch ${PRM_URL} for RFC 9728 protected-resource metadata, then ${AS_URL} for authorization-server metadata.`,
        docs: `${SITE_URL}/docs`,
        resource_metadata: PRM_URL,
      },
    },
    {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "WWW-Authenticate": wwwAuthenticateHeader(),
      },
    },
  );
}

export function requireAuth(req: Request): boolean {
  return Boolean(
    req.headers.get("authorization") || req.headers.get("x-api-key"),
  );
}

type IdemEntry = { status: number; body: unknown; storedAt: number };
const IDEM_TTL_MS = 24 * 60 * 60 * 1000;
const idemStore = new Map<string, IdemEntry>();

export function getIdempotentResult(key: string | null): Response | null {
  if (!key) return null;
  const hit = idemStore.get(key);
  if (!hit) return null;
  if (Date.now() - hit.storedAt > IDEM_TTL_MS) {
    idemStore.delete(key);
    return null;
  }
  return Response.json(hit.body, {
    status: hit.status,
    headers: { "Idempotent-Replay": "true", "Idempotency-Key": key },
  });
}

export function storeIdempotentResult(key: string | null, status: number, body: unknown): void {
  if (!key) return;
  idemStore.set(key, { status, body, storedAt: Date.now() });
}

export function idempotencyKeyFrom(req: Request): string | null {
  return req.headers.get("idempotency-key");
}
