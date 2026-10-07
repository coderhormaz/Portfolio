import { SITE_URL } from "@/lib/site";

export async function GET() {
  return Response.json({
    version: "1.0",
    skills: [
      {
        name: "get-profile",
        description: "Fetch Hormaz Daruwala's public profile, roles, and availability.",
        endpoint: `${SITE_URL}/api/profile`,
        openapi: `${SITE_URL}/openapi.json#/paths/~1api~1profile`,
      },
      {
        name: "search-projects",
        description: "Search portfolio projects by kind (client|personal) and keyword.",
        endpoint: `${SITE_URL}/api/projects`,
        openapi: `${SITE_URL}/openapi.json#/paths/~1api~1projects`,
      },
      {
        name: "validate-contact",
        description: "Validate a freelance/hiring inquiry (name, email, message) before sending.",
        endpoint: `${SITE_URL}/api/contact`,
        openapi: `${SITE_URL}/openapi.json#/paths/~1api~1contact`,
      },
      {
        name: "ask-portfolio",
        description: "Ask natural-language questions about experience, Web3 work, and hiring.",
        endpoint: `${SITE_URL}/ask`,
      },
    ],
  });
}
