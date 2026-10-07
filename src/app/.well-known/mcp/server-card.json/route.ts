import { SITE_URL } from "@/lib/site";

export async function GET() {
  return Response.json({
    $schema: "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json",
    name: "com.hormazdaruwala/portfolio-mcp",
    title: "Portfolio MCP",
    description: "Query Hormaz Daruwala profile and work.",
    version: "1.0.0",
    remotes: [{ url: `${SITE_URL}/api/mcp`, transport: "streamable-http" }],
    serverUrl: `${SITE_URL}/api/mcp`,
  });
}
