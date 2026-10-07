import { SITE_URL } from "@/lib/site";

export async function GET() {
  return Response.json({
    issuer: SITE_URL,
    authorization_endpoint: `${SITE_URL}/agent/auth`,
    token_endpoint: `${SITE_URL}/api/agent/claim`,
    jwks_uri: `${SITE_URL}/.well-known/jwks.json`,
    response_types_supported: ["token"],
    grant_types_supported: ["urn:ietf:params:oauth:grant-type:jwt-bearer"],
    identity_endpoint: `${SITE_URL}/api/agent/identity`,
    claim_endpoint: `${SITE_URL}/api/agent/claim`,
    events_endpoint: `${SITE_URL}/api/agent/events`,
    agent_auth: {
      identity_endpoint: `${SITE_URL}/api/agent/identity`,
      identity_types_supported: ["anonymous", "identity_assertion", "service_auth"],
      identity_assertion: {
        assertion_types_supported: ["urn:ietf:params:oauth:token-type:id-jag"],
      },
      skill: `${SITE_URL}/auth.md`,
    },
  });
}
