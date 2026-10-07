const BODY = `# Docs scope — Hormaz Daruwala

> Scoped context for /docs. Full index: /llms.txt. Full manual: /llms-full.txt.

- /docs is the human API reference; /openapi.json is the typed machine schema (operationIds: getProfile, listProjects, validateContactInquiry).
- Auth: reads need no key; gated entry points (/api, /api/v1) return 401 + WWW-Authenticate with resource_metadata. Agent flow: /auth.md.
- Errors are JSON {code,message,hint,docs}. Request Accept: text/markdown for markdown errors.
- Examples: GET /api/profile, GET /api/projects?type=client&q=next, POST /api/contact {name,email,message}.
- Source + agent rules: https://github.com/coderhormaz/Portfolio (AGENTS.md).
`;

export async function GET() {
  return new Response(BODY, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
