import { SITE_URL } from "@/lib/site";

export async function GET() {
  return Response.json({
    version: "1.0",
    site: SITE_URL,
    name: "Hormaz Daruwala Portfolio ARD catalog",
    description:
      "Agentic Resource Discovery catalog for hormazdaruwala.vercel.app: MCP servers, agent card, skills, APIs.",
    resources: [
      {
        type: "mcp_server",
        name: "portfolio-mcp",
        url: `${SITE_URL}/api/mcp`,
        card: `${SITE_URL}/.well-known/mcp/server-card.json`,
        description: "Query profile, projects, and contact over MCP.",
      },
      {
        type: "agent",
        name: "portfolio-agent",
        url: `${SITE_URL}/.well-known/agent-card.json`,
        description: "A2A agent card for the portfolio assistant.",
      },
      {
        type: "skill",
        name: "portfolio-skills",
        url: `${SITE_URL}/.well-known/agent-skills/index.json`,
        description: "Agent skills index: profile lookup, project search, contact validation.",
      },
      {
        type: "api",
        name: "portfolio-api",
        url: `${SITE_URL}/openapi.json`,
        description: "OpenAPI 3.1 spec for the public REST API.",
      },
      {
        type: "docs",
        name: "llms",
        url: `${SITE_URL}/llms.txt`,
        description: "Agent navigation index.",
      },
    ],
  });
}
