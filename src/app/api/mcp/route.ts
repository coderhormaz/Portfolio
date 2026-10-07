import { SITE_URL } from "@/lib/site";
import { MCP_TOOLS, mcpRpcResponse } from "@/lib/mcp";

export async function GET() {
  return Response.json({
    protocol: "mcp",
    transport: "streamable-http",
    name: "com.hormazdaruwala/portfolio-mcp",
    version: "1.0.0",
    card: `${SITE_URL}/.well-known/mcp/server-card.json`,
    tools: MCP_TOOLS.map((t) => ({ name: t.name, description: t.description })),
    how: "POST JSON-RPC {jsonrpc:'2.0', id, method:'initialize'|'tools/list'|'tools/call', params} to this URL.",
  });
}

export async function POST(req: Request) {
  let rpc: { jsonrpc?: string; id?: unknown; method?: string; params?: Record<string, unknown> };
  try {
    rpc = await req.json();
  } catch {
    return Response.json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error: body must be JSON-RPC." } });
  }
  return Response.json(mcpRpcResponse(rpc));
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: { Allow: "GET, POST, OPTIONS" } });
}
