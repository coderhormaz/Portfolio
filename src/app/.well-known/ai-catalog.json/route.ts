import { SITE_URL } from "@/lib/site";

export async function GET() {
  return Response.json({
    version: "1.0",
    servers: [
      {
        url: `${SITE_URL}/api/mcp`,
        name: "portfolio-mcp",
        card: `${SITE_URL}/.well-known/mcp/server-card.json`,
      },
    ],
  });
}
