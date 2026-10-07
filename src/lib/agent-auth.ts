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
