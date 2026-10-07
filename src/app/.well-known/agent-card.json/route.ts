import { SITE_URL } from "@/lib/site";

export async function GET() {
  return Response.json({
    name: "Hormaz Daruwala Portfolio Agent",
    description: "Answer questions about Hormaz Daruwala's profile, work, and contact paths.",
    url: SITE_URL,
    version: "1.0.0",
    provider: { organization: "Hormaz Daruwala", url: SITE_URL },
    capabilities: ["profile.lookup", "projects.search", "contact.validate", "ask.answer"],
    skills: [
      { id: "get-profile", name: "Get profile", description: "Fetch public identity, roles, availability." },
      { id: "search-projects", name: "Search projects", description: "Filter portfolio work by kind and keyword." },
      { id: "validate-contact", name: "Validate contact", description: "Validate a hiring inquiry before sending." },
    ],
    endpoints: {
      agent: `${SITE_URL}/api/agent/identity`,
      mcp: `${SITE_URL}/api/mcp`,
      ask: `${SITE_URL}/ask`,
      openapi: `${SITE_URL}/openapi.json`,
      auth: `${SITE_URL}/auth.md`,
    },
    authentication: {
      schemes: ["anonymous", "identity_assertion", "service_auth"],
      resource_metadata: `${SITE_URL}/.well-known/oauth-protected-resource`,
    },
    contact: { email: "hormazdaruwala86@gmail.com", url: `${SITE_URL}/contact` },
  });
}
