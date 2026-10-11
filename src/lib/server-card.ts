import { createHash } from "node:crypto";
import { SITE_URL } from "@/lib/site";

export const SERVER_CARD_SCHEMA =
  "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json";

export function productCard() {
  return {
    $schema: SERVER_CARD_SCHEMA,
    name: "com.hormazdaruwala/portfolio-mcp",
    title: "Hormaz Daruwala Portfolio MCP",
    description: "Query Hormaz Daruwala profile and work.",
    version: "1.0.0",
    icons: [{ src: `${SITE_URL}/logo.svg`, mimeType: "image/svg+xml" }],
    websiteUrl: SITE_URL,
    repository: "https://github.com/coderhormaz/Portfolio",
    remotes: [{ type: "streamable-http", url: `${SITE_URL}/api/mcp` }],
    serverUrl: `${SITE_URL}/api/mcp`,
  };
}

export function docsCard() {
  return {
    $schema: SERVER_CARD_SCHEMA,
    name: "com.hormazdaruwala/portfolio-docs-mcp",
    title: "Hormaz Daruwala Portfolio Docs MCP",
    description: "Answer docs questions from llms.txt and guides.",
    version: "1.0.0",
    icons: [{ src: `${SITE_URL}/logo.svg`, mimeType: "image/svg+xml" }],
    websiteUrl: `${SITE_URL}/docs`,
    repository: "https://github.com/coderhormaz/Portfolio",
    remotes: [{ type: "streamable-http", url: `${SITE_URL}/api/docs-mcp` }],
    serverUrl: `${SITE_URL}/api/docs-mcp`,
  };
}

/**
 * Serve a Server Card per the discovery spec: CORS + caching headers,
 * ETag/If-None-Match validation, and echo of a negotiated
 * application/mcp-server-card+json representation.
 */
export function serveCard(req: Request, card: Record<string, unknown>): Response {
  const body = JSON.stringify(card);
  const etag = `"${createHash("sha256").update(body, "utf8").digest("hex").slice(0, 27)}"`;
  const headers: Record<string, string> = {
    "Cache-Control": "public, max-age=3600",
    ETag: etag,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "Content-Type, If-None-Match",
    "Access-Control-Expose-Headers": "ETag",
  };
  if (req.headers.get("if-none-match") === etag) {
    return new Response(null, { status: 304, headers });
  }
  const accept = req.headers.get("accept") || "";
  headers["Content-Type"] = accept.includes("application/mcp-server-card+json")
    ? "application/mcp-server-card+json"
    : "application/json";
  return new Response(body, { headers });
}
