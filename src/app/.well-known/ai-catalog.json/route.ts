import { SITE_URL } from "@/lib/site";

const PUBLISHER = "hormazdaruwala.vercel.app";

/**
 * Strict AI Catalog (MCP discovery): specVersion + entries carrying only
 * identifier / type / url-or-data, per the AI Catalog + Server Card
 * discovery specification. Served as application/ai-catalog+json.
 */
export async function GET() {
  const catalog = {
    specVersion: "1.0",
    entries: [
      {
        identifier: `urn:air:${PUBLISHER}:mcp:portfolio`,
        type: "application/mcp-server-card+json",
        url: `${SITE_URL}/api/mcp/server-card`,
      },
      {
        identifier: `urn:air:${PUBLISHER}:mcp:portfolio-docs`,
        type: "application/mcp-server-card+json",
        url: `${SITE_URL}/api/docs-mcp/server-card`,
      },
    ],
  };
  return new Response(JSON.stringify(catalog), {
    headers: {
      "Content-Type": "application/ai-catalog+json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
