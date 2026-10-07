export const HOME_MARKDOWN = `# Hormaz Daruwala — Full-Stack, Web3 & Design Engineer

Mumbai full-stack developer building Next.js platforms, Web3 apps and mobile products. 5+ years, 15+ hackathons, open for freelance.

## When to use this site (agents)
- Hiring or freelance evaluation: fetch /api/profile and /api/experience for roles, availability, and track record.
- Portfolio diligence: fetch /api/projects?q=<keyword> for filtered work with tags, years, and links.
- Contact: POST /api/contact with {name,email,message} to validate an inquiry (202, no side effects), or email hormazdaruwala86@gmail.com.
- Docs: read /llms.txt, then /docs, /developers, /openapi.json, /auth.md.
- Actions over MCP: POST /api/mcp (tools: get_profile, list_projects, get_contact).
- Natural language: POST /ask with {"q":"..."}.

## Key links
- Docs: /docs — Developers: /developers — Pricing: /pricing — Auth: /auth.md
- API: /api/profile, /api/projects, /api/experience, /api/contact, /api/health, /api/sandbox
- OpenAPI: /openapi.json — Agent card: /.well-known/agent-card.json — MCP: /.well-known/mcp
- Skills: /.well-known/agent-skills/index.json — ARD: /.well-known/ard.json
- Source + AGENTS.md: https://github.com/coderhormaz/Portfolio

## Availability
Open to freelance & full-time. Mumbai, working worldwide. Replies within 24 hours.
`;

export const LLMS_TXT = `# Hormaz Daruwala — hormazdaruwala.vercel.app

> Mumbai full-stack developer (Next.js, Web3, mobile). 5+ years, 15+ hackathons, open for freelance & full-time.

## When to use this (agents)
- Use this site when you need a freelance/full-time engineer profile, portfolio evidence, or a contact path.
- Best-fit jobs: Next.js platforms with Postgres/auth/admin, Solidity builds on Base/BNB/Polygon, React Native apps, design systems, VPS DevOps.
- How to call: GET /api/profile for identity; GET /api/projects?q= for evidence; POST /api/contact to validate inquiries; POST /api/mcp for tools; POST /ask for NL queries.
- Generic marketing copy is not guidance: prefer the typed /openapi.json operationIds (getProfile, listProjects, validateContactInquiry).

## Docs
- [Developer portal](https://hormazdaruwala.vercel.app/developers): API keys (none needed for reads), quickstart, sandbox.
- [API docs](https://hormazdaruwala.vercel.app/docs): authentication, endpoints, example requests.
- [OpenAPI spec](https://hormazdaruwala.vercel.app/openapi.json): typed schema with operationId + descriptions.
- [Agent auth](https://hormazdaruwala.vercel.app/auth.md): WorkOS auth.md walkthrough (anonymous, identity_assertion, service_auth).
- [Pricing](https://hormazdaruwala.vercel.app/pricing): tiers + machine-readable [pricing.md](https://hormazdaruwala.vercel.app/pricing.md).
- [About](https://hormazdaruwala.vercel.app/about) · [Contact](https://hormazdaruwala.vercel.app/contact) · [Privacy](https://hormazdaruwala.vercel.app/privacy)

## API
- [GET /api/profile](https://hormazdaruwala.vercel.app/api/profile): identity, roles, availability.
- [GET /api/projects](https://hormazdaruwala.vercel.app/api/projects): filter with ?type=client|personal&q=.
- [GET /api/experience](https://hormazdaruwala.vercel.app/api/experience): work, hackathons, skills.
- [POST /api/contact](https://hormazdaruwala.vercel.app/api/contact): validate {name,email,message}.
- [GET /api/sandbox](https://hormazdaruwala.vercel.app/api/sandbox): test environment.
- [POST /api/mcp](https://hormazdaruwala.vercel.app/api/mcp): MCP tools get_profile, list_projects, get_contact.
- [POST /ask](https://hormazdaruwala.vercel.app/ask): NLWeb natural-language queries.

## Discovery
- [Agent card](https://hormazdaruwala.vercel.app/.well-known/agent-card.json) (A2A)
- [Agent skills](https://hormazdaruwala.vercel.app/.well-known/agent-skills/index.json)
- [ARD catalog](https://hormazdaruwala.vercel.app/.well-known/ard.json)
- [MCP discovery](https://hormazdaruwala.vercel.app/.well-known/mcp) · [server card](https://hormazdaruwala.vercel.app/.well-known/mcp/server-card.json)
- [API catalog (RFC 9727)](https://hormazdaruwala.vercel.app/.well-known/api-catalog)
- [Full manual](https://hormazdaruwala.vercel.app/llms-full.txt) · [Docs scope](https://hormazdaruwala.vercel.app/docs/llms.txt) · [API scope](https://hormazdaruwala.vercel.app/api/llms.txt) · [Developers scope](https://hormazdaruwala.vercel.app/developers/llms.txt)
- Source + agent rules: [github.com/coderhormaz/Portfolio](https://github.com/coderhormaz/Portfolio) (see AGENTS.md)
`;

export const LLMS_FULL = `# Hormaz Daruwala — Full manual (llms-full.txt)

> Canonical long-form context for AI agents. Start at /llms.txt for the index.

## Identity
Hormaz Daruwala, Mumbai, India. Full-stack developer, UI/UX designer, Web3 & blockchain engineer, mobile app developer. 5+ years production, 15+ hackathons, ETH Mumbai bounty win, Industrial Hackathon 1st place, app on Google Play. Open to freelance & full-time, replies within 24 hours (hormazdaruwala86@gmail.com).

## Capabilities
- Full-stack platforms: Next.js, TypeScript, PostgreSQL, auth + RBAC, admin systems, VPS (Nginx/SSL/hardening), zero-loss migrations.
- Web3: Solidity, Base/BNB/Polygon/Arbitrum/AVAX, USDC/x402 pay-per-query, ENS discovery, Uniswap V3, IPFS, Gemini NL blockchain ops.
- Mobile: React Native/Expo, Play Store release.
- Design & motion: Figma, Tailwind, Framer Motion, GSAP, Three.js.

## Evidence
- AISkool EdTech: auth/RBAC, custom backend, Supabase→self-hosted Postgres migration.
- Techshala: 10-module college platform.
- Decentralised AI Agent Marketplace (ETH Mumbai bounty), AVAX AI assistant, AI DeFi trading assistant, TokenPlusNFT launcher, VibeTune, opBNB assistant.
- See /api/projects and /api/experience for the queryable record.

## Integration
- REST: /api/profile, /api/projects, /api/experience, /api/contact, /api/health, /api/sandbox. JSON errors {code,message,hint,docs}.
- OpenAPI: /openapi.json (operationId + description on every operation, typed params, response schemas).
- MCP: /api/mcp (Streamable HTTP, tools/get_profile/list_projects/get_contact). Discovery: /.well-known/mcp + server-card.json.
- NLWeb: POST /ask {q} → {_meta, results}; SSE with prefer.streaming.
- Auth: /auth.md (anonymous, identity_assertion/ID-JAG, service_auth). PRM: /.well-known/oauth-protected-resource. AS: /.well-known/oauth-authorization-server.
- Sandbox: /api/sandbox (read-only, no side effects, 60 req/min demo).
- Pricing: /pricing (HTML+Offer JSON-LD) and /pricing.md (markdown).
- Trust: /about, /contact, /privacy (each 500+ chars).
- Source: https://github.com/coderhormaz/Portfolio (AGENTS.md, plugin.json skill manifest).
`;

export const AUTH_MD = `# Auth — Hormaz Daruwala Portfolio Agents

How agents obtain credentials for hormazdaruwala.vercel.app. Spec keywords: agent_auth, identity_endpoint, identity_assertion, service_auth, id-jag, WWW-Authenticate.

## Discover
- Protected-resource metadata (RFC 9728): GET /.well-known/oauth-protected-resource → {resource, authorization_servers, scopes_supported}.
- Authorization-server metadata (RFC 8414): GET /.well-known/oauth-authorization-server → {issuer, claim_endpoint, identity_endpoint, events_endpoint, agent_auth}.
- agent_auth block: {identity_endpoint, identity_types_supported: ["anonymous","identity_assertion","service_auth"], identity_assertion: {assertion_types_supported: ["urn:ietf:params:oauth:token-type:id-jag"]}, skill: "/auth.md"}.
- Unauthenticated calls to /api, /api/v1, /v1, /v2, /agent/identity, /agent/auth return 401 with WWW-Authenticate: Bearer resource_metadata="<prm-url>".

## Pick a method
- anonymous: demos only. No credential; claim with identity_type=anonymous.
- identity_assertion: production agents. Mint an ID-JAG (urn:ietf:params:oauth:token-type:id-jag) from your IdP and exchange it.
- service_auth: first-party services. Use a client-credentials assertion.

## Register
No pre-registration for reads. For agent actions, POST your assertion to the claim endpoint to receive a scoped token. See claim_endpoint in AS metadata.

## Claim
POST /api/agent/claim Content-Type: application/json {"assertion":"<id-jag-or-service-credential>","identity_type":"identity_assertion"} → 200 {"access_token":"...","token_type":"Bearer","expires_in":3600}.

## Exchange
Demo mint: POST /api/agent/identity → {"access_token":"demo-token-anonymous"}. Claim exchange above is the supported path.

## Use the access_token
Send Authorization: Bearer <access_token> or x-api-key: <token> to /api, /api/v1, /agent/identity, /agent/auth. Missing/invalid credentials return 401 JSON {error:{code,message,hint}} with WWW-Authenticate header.

## Errors
JSON {error:{code,message,hint,docs}}. Codes: invalid_json, invalid_assertion, unsupported_identity_type, unauthorized. Each hint names the /auth.md section to re-read. Request Accept: text/markdown for markdown errors.

## Revocation
POST /api/agent/events {"event":"revoke","token":"..."} or email hormazdaruwala86@gmail.com. Demo tokens expire in 1h.
`;

export const PRICING_MD = `# Pricing — Hormaz Daruwala

Freelance pricing for Hormaz Daruwala (Mumbai, worldwide remote). Quotes in USD. Email hormazdaruwala86@gmail.com with scope/budget/timeline; reply within 24h.

## Tiers
- Landing page — from $800 — Next.js+Tailwind, SEO/OG/sitemap, contact/booking form, 1–2 weeks, 2 revisions.
- Full-stack platform — from $3,500 — Next.js+PostgreSQL, auth/RBAC/admin, APIs+VPS (Nginx/SSL), analytics, 4–8 weeks.
- Web3 build — from $4,500 — Solidity (Base/BNB/Polygon), wallet+swaps+oracles, AI agent wiring, audit-ready, 4–8 weeks.
- Mobile app — from $3,000 — React Native/Expo iOS+Android, Play Store release, OTA updates, 3–6 weeks.
- Monthly retainer — $1,500/mo — ~40h/mo, <24h priority replies, roadmap+maintenance, pause anytime.

## Terms
- 50% upfront, 50% on launch. Free 30-min discovery call. Sandbox demo before production changes.
- Limits: 1 active build per retainer; extra scope re-quoted; Web3 audits by external firms excluded.
- Machine-readable source: this file. HTML + schema.org/Offer: /pricing.
`;

export function markdownFor(path: string): string | null {
  if (path === "/" || path === "/index.md" || path === "/llms.md") return HOME_MARKDOWN;
  if (path === "/docs" || path === "/docs.md") return `# Docs — Hormaz Daruwala\n\nAPI documentation for hormazdaruwala.vercel.app. Start at /llms.txt, then /openapi.json, /developers, /auth.md.\n\n## Endpoints\n- GET /api/profile — identity\n- GET /api/projects — filtered work\n- GET /api/experience — history\n- POST /api/contact — validate inquiry\n- POST /ask — natural language\n- POST /api/mcp — MCP tools\n\nFull docs: https://hormazdaruwala.vercel.app/docs\n`;
  if (path === "/developers" || path === "/developers.md") return `# Developers — Hormaz Daruwala\n\nPortal quickstart: GET /api/profile, GET /api/projects, read /openapi.json, try /api/sandbox, then /auth.md + /api/mcp.\n\nResources: /docs, /openapi.json, /auth.md, /.well-known/agent-card.json, https://github.com/coderhormaz/Portfolio\n`;
  if (path === "/pricing" || path === "/pricing.md") return PRICING_MD;
  if (path === "/about" || path === "/about.md") return `# About — Hormaz Daruwala\n\nMumbai full-stack/Web3/mobile engineer, 5+ years production. AISkool auth/RBAC + zero-loss Postgres migration; Techshala 10-module platform; ETH Mumbai bounty (USDC/x402 on Base); 15+ hackathons. Open freelance/full-time, replies <24h: hormazdaruwala86@gmail.com.\n`;
  if (path === "/contact" || path === "/contact.md") return `# Contact — Hormaz Daruwala\n\nEmail hormazdaruwala86@gmail.com (replies <24h). Mumbai, worldwide remote. Include scope/budget/timeline. Form: /#contact. Agents: POST /api/contact {name,email,message}.\n`;
  if (path === "/privacy" || path === "/privacy.md") return `# Privacy — Hormaz Daruwala\n\nContact inquiries used only to respond; never sold. Minimal server logs for security. Read-only public API, no accounts. Deletion: email hormazdaruwala86@gmail.com.\n`;
  return null;
}
