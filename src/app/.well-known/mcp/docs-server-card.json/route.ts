import { SITE_URL } from "@/lib/site";

export async function GET() {
  return Response.json({
    $schema: "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json",
    name: "com.hormazdaruwala/portfolio-docs-mcp",
    title: "Hormaz Daruwala Portfolio Docs MCP",
    description: "Answer docs questions from llms.txt and guides.",
    version: "1.0.0",
    icons: [{ src: `${SITE_URL}/logo.svg`, mimeType: "image/svg+xml" }],
    websiteUrl: `${SITE_URL}/docs`,
    repository: "https://github.com/coderhormaz/Portfolio",
    remotes: [{ type: "streamable-http", url: `${SITE_URL}/api/docs-mcp` }],
    serverUrl: `${SITE_URL}/api/docs-mcp`,
  });
}
