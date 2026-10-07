const BODY = `# Developers scope — Hormaz Daruwala

> Scoped context for /developers. Full index: /llms.txt. Full manual: /llms-full.txt.

- Quickstart: GET /api/profile → GET /api/projects → read /openapi.json → GET /api/sandbox → /auth.md → POST /api/mcp.
- Sandbox: /api/sandbox (read-only, 60 req/min demo, POST /api/contact validates only).
- Discovery: /.well-known/agent-card.json, /.well-known/agent-skills/index.json, /.well-known/ard.json, /.well-known/mcp.
- Source + agent rules: https://github.com/coderhormaz/Portfolio (AGENTS.md, plugin.json).
`;

export async function GET() {
  return new Response(BODY, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
