import { profile, clientProjects, personalProjects } from "@/data/portfolio";
import { SITE_URL } from "@/lib/site";
import { LLMS_TXT } from "@/lib/markdown";

export const MCP_INSTRUCTIONS =
  "Portfolio MCP (read-only demo). Tools query the public profile, projects, contact channels, and docs of Hormaz Daruwala. No side effects: POST /api/contact validates only (202 + job_id). For credentialed surfaces see /auth.md.";

function pick<T extends Record<string, unknown>>(obj: T, fields?: unknown): T | Partial<T> {
  if (!Array.isArray(fields) || fields.length === 0) return obj;
  const out: Record<string, unknown> = {};
  for (const f of fields) if (typeof f === "string" && f in obj) out[f] = obj[f];
  return out as Partial<T>;
}

export const MCP_TOOLS = [
  {
    name: "get_profile",
    title: "Get profile",
    description: "Get Hormaz Daruwala's public profile, roles, and availability.",
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    inputSchema: {
      type: "object",
      properties: {
        fields: { type: "array", items: { type: "string" }, description: "Optional subset of profile keys to return." },
      },
      required: [],
      additionalProperties: false,
    },
  },
  {
    name: "list_projects",
    title: "Search projects",
    description: "Search portfolio projects by kind and keyword.",
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["client", "personal"], description: "Project kind filter." },
        q: { type: "string", description: "Keyword search." },
        limit: { type: "integer", minimum: 1, maximum: 25, default: 10, description: "Max projects to return." },
      },
      required: [],
      additionalProperties: false,
    },
  },
  {
    name: "get_contact",
    title: "Get contact",
    description: "Get public contact channels for hiring inquiries.",
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    inputSchema: {
      type: "object",
      properties: {
        fields: { type: "array", items: { type: "string" }, description: "Optional subset of contact keys to return." },
      },
      required: [],
      additionalProperties: false,
    },
  },
  {
    name: "ask_about_docs",
    title: "Ask docs",
    description: "Answer documentation questions from llms.txt, docs, and auth guides.",
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    inputSchema: {
      type: "object",
      properties: { q: { type: "string", description: "Question about the docs or API." } },
      required: ["q"],
      additionalProperties: false,
    },
  },
];

export function callMcpTool(name: string, args: Record<string, unknown>) {
  if (name === "get_profile") {
    const full = { name: profile.name, roles: profile.roles, email: profile.email, availability: profile.availability, site: SITE_URL };
    return pick(full, args.fields);
  }
  if (name === "list_projects") {
    const type = args.type as string | undefined;
    const q = ((args.q as string) || "").toLowerCase();
    const limit = Math.min(25, Math.max(1, Number(args.limit) || 10));
    let all = [
      ...clientProjects.map((p) => ({ ...p, kind: "client" })),
      ...personalProjects.map((p) => ({ ...p, kind: "personal" })),
    ];
    if (type === "client" || type === "personal") all = all.filter((p) => p.kind === type);
    if (q) all = all.filter((p) => `${p.title} ${p.subtitle} ${p.description} ${p.tags.join(" ")}`.toLowerCase().includes(q));
    return { count: all.length, projects: all.slice(0, limit) };
  }
  if (name === "get_contact") {
    const full = { email: profile.email, location: profile.location, form: `${SITE_URL}/#contact`, api: `${SITE_URL}/api/contact` };
    return pick(full, args.fields);
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

export function mcpRpcResponse(
  rpc: { id?: unknown; method?: string; params?: Record<string, unknown> },
  server: { name: string; version: string; instructions: string } = {
    name: "com.hormazdaruwala/portfolio-mcp",
    version: "1.0.0",
    instructions: MCP_INSTRUCTIONS,
  },
) {
  const id = rpc.id ?? 1;
  const method = rpc.method || "";
  const params = rpc.params || {};
  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2025-06-18",
        serverInfo: { name: server.name, version: server.version },
        instructions: server.instructions,
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

export const DOCS_MCP_TOOLS = [
  {
    name: "ask_about_docs",
    title: "Ask docs",
    description: "Answer documentation questions from llms.txt, docs, and auth guides.",
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    inputSchema: {
      type: "object",
      properties: { q: { type: "string", description: "Question about the docs or API." } },
      required: ["q"],
      additionalProperties: false,
    },
  },
  {
    name: "get_llms",
    title: "Get agent index",
    description: "Fetch the llms.txt agent navigation index.",
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    inputSchema: { type: "object", properties: {}, required: [], additionalProperties: false },
  },
  {
    name: "get_openapi",
    title: "Get OpenAPI link",
    description: "Get the OpenAPI spec URL and versioned server bases.",
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    inputSchema: { type: "object", properties: {}, required: [], additionalProperties: false },
  },
];

export function callDocsMcpTool(name: string, args: Record<string, unknown>) {
  if (name === "ask_about_docs") return callMcpTool("ask_about_docs", args);
  if (name === "get_llms") return { source: `${SITE_URL}/llms.txt`, excerpt: LLMS_TXT.slice(0, 2000) };
  if (name === "get_openapi") {
    return { spec: `${SITE_URL}/openapi.json`, version: "1.0.0", servers: [SITE_URL, `${SITE_URL}/api/v1`] };
  }
  throw new Error(`unknown tool: ${name}`);
}

export function docsMcpRpcResponse(rpc: { id?: unknown; method?: string; params?: Record<string, unknown> }) {
  const id = rpc.id ?? 1;
  const method = rpc.method || "";
  const params = rpc.params || {};
  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2025-06-18",
        serverInfo: { name: "com.hormazdaruwala/portfolio-docs-mcp", version: "1.0.0" },
        instructions:
          "Portfolio Docs MCP (read-only). Answers documentation questions from llms.txt, /docs, /developers, /openapi.json, and /auth.md. No side effects.",
        capabilities: { tools: {} },
      },
    };
  }
  if (method === "tools/list") {
    return { jsonrpc: "2.0", id, result: { tools: DOCS_MCP_TOOLS } };
  }
  if (method === "tools/call") {
    try {
      const data = callDocsMcpTool(params.name as string, (params.arguments || {}) as Record<string, unknown>);
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
