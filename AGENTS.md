<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Hormaz Daruwala Portfolio (hormazdaruwala.vercel.app)

Instructions for AI coding agents working in this repo.

## Stack
- Next.js 16 App Router (`src/app`), React 19, Tailwind v4. Proxy lives in
  `src/proxy.ts` (Next 16 renamed `middleware` → `proxy`).
- Route Handlers return Web `Response`/`Response.json`. No Express-style APIs.
- Canonical site URL: `src/lib/site.ts` (`NEXT_PUBLIC_SITE_URL` override).

## Agent surfaces (keep in sync)
- Public REST: `src/app/api/{profile,projects,experience,contact,health,sandbox}/route.ts`
- Typed schema: `src/lib/openapi.ts` → `/openapi.json` (every operation needs
  a unique `operationId` + `description`, typed params, response schemas).
- Well-known discovery: `src/app/.well-known/*/route.ts` (ard.json,
  agent-card.json, agent-skills/index.json, mcp, api-catalog, oauth-*
  metadata, http-message-signatures-directory, ai-catalog.json).
- Agent text: `src/lib/markdown.ts` → `/llms.txt`, `/llms-full.txt`,
  `/auth.md`, `/pricing.md`, `/*.md` twins. `/auth.md` must keep the WorkOS
  sections (Discover, Pick a method, Register, Claim, Exchange, Use the
  access_token, Errors, Revocation) and spec keywords.
- Negotiation: `src/proxy.ts` handles `Accept: text/markdown`, bot UAs,
  `?mode=agent`, `Link`/`Vary` headers, and markdown 404s.

## Rules
- JSON errors only from APIs: `{error:{code,message,hint,docs}}`. Never HTML.
- Gated entry points (`/api`, `/api/v1`, `/v1`, `/v2`, `/agent/*`) return
  `401` + `WWW-Authenticate: Bearer resource_metadata="...oauth-protected-resource"`
  when no `Authorization`/`x-api-key` is present.
- `agent_auth` advertise: `identity_endpoint`, `claim_endpoint`,
  `events_endpoint` must all resolve (OPTIONS ≠ 404).
- When adding a page, also add: sitemap entry, `alternates.types`
  `text/markdown` twin, and a link from the homepage nav + `llms.txt`.
- Verify with `npm run build` and `npx tsc --noEmit` before finishing.
