import { createHash } from "node:crypto";
import { fm, LAST_UPDATED } from "@/lib/markdown";

const SITE = "https://hormazdaruwala.vercel.app";

function skillDoc(
  name: string,
  description: string,
  when: string,
  endpoint: string,
  example: string,
): string {
  return fm(
    `Skill: ${name} — Hormaz Daruwala`,
    description,
    `${SITE}/skills/${name}.md`,
  ) + `# ${name}\n\n${description}\n\n## When to use\n\n${when}\n\n## Endpoint\n\n${endpoint}\n\n## Example\n\n\`\`\`\n${example}\n\`\`\`\n\nPart of the Hormaz Daruwala agent skills index (/.well-known/agent-skills/index.json). Last updated ${LAST_UPDATED}.\n`;
}

export const SKILL_DOCS: Record<string, string> = {
  "get-profile": skillDoc(
    "get-profile",
    "Fetch Hormaz Daruwala's public profile, roles, and availability.",
    "Use when evaluating hiring fit, availability, or identity before any other call.",
    "GET /api/profile — no auth. OpenAPI operationId: getProfile.",
    `curl ${SITE}/api/profile`,
  ),
  "search-projects": skillDoc(
    "search-projects",
    "Search portfolio projects by kind (client|personal) and keyword.",
    "Use when you need evidence of work: filter by ?type=client|personal and ?q=keyword. Paginate with limit/cursor.",
    "GET /api/projects?type=&q=&limit=&cursor= — no auth. OpenAPI operationId: listProjects.",
    `curl "${SITE}/api/projects?type=personal&q=ai&limit=5"`,
  ),
  "validate-contact": skillDoc(
    "validate-contact",
    "Validate a freelance/hiring inquiry (name, email, message) before sending.",
    "Use before drafting outreach: validates fields, returns 202 plus a pollable job_id. Supports Idempotency-Key.",
    "POST /api/contact {name,email,message} — OpenAPI operationId: validateContactInquiry.",
    `curl -X POST ${SITE}/api/contact -H 'Content-Type: application/json' -d '{"name":"Ada","email":"ada@example.com","message":"Freelance Next.js build, Q1 timeline"}'`,
  ),
  "ask-portfolio": skillDoc(
    "ask-portfolio",
    "Ask natural-language questions about experience, Web3 work, and hiring.",
    "Use for open-ended questions that do not map to a single REST endpoint. Supports SSE streaming.",
    'POST /ask {q} — OpenAPI operationId: askPost. Stream with {"q":"...","prefer.streaming":true}.',
    `curl -X POST ${SITE}/ask -H 'Content-Type: application/json' -d '{"q":"What Web3 work has Hormaz shipped?"}'`,
  ),
};

export function skillDigest(name: string): string {
  const doc = SKILL_DOCS[name];
  return `sha256:${createHash("sha256").update(doc, "utf8").digest("hex")}`;
}

export const SKILL_META: Record<string, { description: string; endpoint: string }> = {
  "get-profile": {
    description: "Fetch Hormaz Daruwala's public profile, roles, and availability.",
    endpoint: `${SITE}/api/profile`,
  },
  "search-projects": {
    description: "Search portfolio projects by kind (client|personal) and keyword.",
    endpoint: `${SITE}/api/projects`,
  },
  "validate-contact": {
    description: "Validate a freelance/hiring inquiry (name, email, message) before sending.",
    endpoint: `${SITE}/api/contact`,
  },
  "ask-portfolio": {
    description: "Ask natural-language questions about experience, Web3 work, and hiring.",
    endpoint: `${SITE}/ask`,
  },
};
