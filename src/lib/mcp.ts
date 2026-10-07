import { profile, clientProjects, personalProjects } from "@/data/portfolio";
import { SITE_URL } from "@/lib/site";

export const MCP_TOOLS = [
  {
    name: "get_profile",
    description: "Get Hormaz Daruwala's public profile, roles, and availability.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "list_projects",
    description: "Search portfolio projects by kind and keyword.",
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["client", "personal"], description: "Project kind filter." },
        q: { type: "string", description: "Keyword search." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_contact",
    description: "Get public contact channels for hiring inquiries.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "ask_about_docs",
    description: "Answer documentation questions from llms.txt, docs, and auth guides.",
    inputSchema: {
      type: "object",
      properties: { q: { type: "string", description: "Question about the docs or API." } },
      additionalProperties: false,
    },
  },
];

export function callMcpTool(name: string, args: Record<string, unknown>) {
  if (name === "get_profile") {
    return { name: profile.name, roles: profile.roles, email: profile.email, availability: profile.availability, site: SITE_URL };
  }
  if (name === "list_projects") {
    const type = args.type as string | undefined;
    const q = ((args.q as string) || "").toLowerCase();
    let all = [
      ...clientProjects.map((p) => ({ ...p, kind: "client" })),
      ...personalProjects.map((p) => ({ ...p, kind: "personal" })),
    ];
    if (type === "client" || type === "personal") all = all.filter((p) => p.kind === type);
    if (q) all = all.filter((p) => `${p.title} ${p.subtitle} ${p.description} ${p.tags.join(" ")}`.toLowerCase().includes(q));
    return { count: all.length, projects: all.slice(0, 10) };
  }
  if (name === "get_contact") {
    return { email: profile.email, location: profile.location, form: `${SITE_URL}/#contact`, api: `${SITE_URL}/api/contact` };
  }
  if (name === "ask_about_docs") {
    const q = String(args.q || "");
    return {
      answer: `Docs grounded: REST at /api/* (see /openapi.json), MCP tools get_profile/list_projects/get_contact, NL ask at /ask, auth in /auth.md. Question was: ${q}`,
      sources: [`${SITE_URL}/llms.txt`, `${SITE_URL}/docs`, `${SITE_URL}/auth.md`],
    };
  }
  throw new Error(`unknown tool: ${name}`);
}

export function mcpRpcResponse(rpc: { id?: unknown; method?: string; params?: Record<string, unknown> }) {
  const id = rpc.id ?? 1;
  const method = rpc.method || "";
  const params = rpc.params || {};
  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2025-06-18",
        serverInfo: { name: "com.hormazdaruwala/portfolio-mcp", version: "1.0.0" },
        capabilities: { tools: {} },
      },
    };
  }
  if (method === "tools/list") {
    return { jsonrpc: "2.0", id, result: { tools: MCP_TOOLS } };
  }
  if (method === "tools/call") {
    const name = params.name as string;
    const args = (params.arguments || {}) as Record<string, unknown>;
    try {
      const data = callMcpTool(name, args);
      return { jsonrpc: "2.0", id, result: { content: [{ type: "text", text: JSON.stringify(data) }] } };
    } catch (e) {
      return { jsonrpc: "2.0", id, error: { code: -32602, message: e instanceof Error ? e.message : "Tool call failed" } };
    }
  }
  return {
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: `Method not found: ${method}. Use initialize, tools/list, tools/call.` },
  };
}
