import { SITE_URL } from "@/lib/site";

export async function GET() {
  return Response.json({
    resource: `${SITE_URL}/api`,
    authorization_servers: [SITE_URL],
    scopes_supported: ["read", "contact:validate", "mcp:call"],
    bearer_methods_supported: ["header"],
    resource_documentation: `${SITE_URL}/docs`,
    auth_walkthrough: `${SITE_URL}/auth.md`,
  });
}
