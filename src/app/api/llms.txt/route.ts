const BODY = `# API scope — Hormaz Daruwala

> Scoped context for /api. Full index: /llms.txt. Schema: /openapi.json.

- Public GET: /api/profile, /api/projects?type=client|personal&q=, /api/experience, /api/contact, /api/health, /api/sandbox. No auth.
- Gated: /api, /api/v1 return 401 + WWW-Authenticate: Bearer resource_metadata when no Authorization/x-api-key. See /auth.md.
- POST /api/contact validates {name,email,message} → 202 valid, 422 JSON error otherwise.
- MCP: POST /api/mcp (initialize, tools/list, tools/call). NLWeb: POST /ask {q}.
- Errors: {error:{code,message,hint,docs}}. Codes: invalid_json, invalid_email, unauthorized.
`;

export async function GET() {
  return new Response(BODY, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
