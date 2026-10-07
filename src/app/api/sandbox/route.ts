import { SITE_URL } from "@/lib/site";

export async function GET() {
  return Response.json({
    name: "Portfolio API sandbox",
    description:
      "Read-only sandbox mirroring production. No auth required for GET. POST /api/contact validates only and never sends email.",
    base_url: `${SITE_URL}/api`,
    sandbox_base_url: `${SITE_URL}/api`,
    is_sandbox: true,
    production: SITE_URL,
    how_to_use: [
      "GET /api/profile for identity and availability",
      "GET /api/projects?type=client&q=next for filtered work",
      "POST /api/contact with {name,email,message} to validate an inquiry (202, no side effects)",
      "GET /openapi.json for the full typed schema",
    ],
    rate_limit: "60 requests/minute per IP (demo)",
  });
}
