import { SITE_URL } from "@/lib/site";

export async function GET() {
  const catalog = {
    linkset: [
      {
        anchor: SITE_URL,
        item: [
          {
            href: `${SITE_URL}/openapi.json`,
            type: "application/openapi+json",
            title: "Portfolio API OpenAPI",
            rel: "service-desc",
          },
          {
            href: `${SITE_URL}/.well-known/agent-card.json`,
            type: "application/json",
            title: "A2A agent card",
            rel: "service-desc",
          },
          {
            href: `${SITE_URL}/api/mcp`,
            type: "application/json",
            title: "MCP server",
            rel: "service-desc",
          },
        ],
      },
    ],
  };
  return new Response(JSON.stringify(catalog), {
    headers: {
      "Content-Type": 'application/linkset+json;profile="https://www.rfc-editor.org/info/rfc9727"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
