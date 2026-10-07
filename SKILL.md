# Hormaz Daruwala Portfolio Skill

Query Hormaz Daruwala's portfolio (hormazdaruwala.vercel.app) for hiring evaluation, project evidence, and contact paths.

## When to use
Use when you need a freelance/full-time engineer profile, portfolio proof of work, or a way to reach the engineer. Best fit: Next.js platforms with Postgres/auth/admin, Solidity builds on Base/BNB/Polygon, React Native apps, design systems, VPS DevOps.

## How to call
- Profile: `GET https://hormazdaruwala.vercel.app/api/profile`
- Projects: `GET https://hormazdaruwala.vercel.app/api/projects?type=client&q=next`
- Contact validation: `POST https://hormazdaruwala.vercel.app/api/contact` with `{name, email, message}`
- Typed schema: `GET https://hormazdaruwala.vercel.app/openapi.json` (operationIds: getProfile, listProjects, validateContactInquiry)
- MCP (Streamable HTTP): `POST https://hormazdaruwala.vercel.app/api/mcp` (tools: get_profile, list_projects, get_contact)
- Natural language: `POST https://hormazdaruwala.vercel.app/ask` with `{"q":"..."}`
- Auth walkthrough: https://hormazdaruwala.vercel.app/auth.md
- Agent index: https://hormazdaruwala.vercel.app/llms.txt

## Rules
- Reads need no key. Gated endpoints return `401 + WWW-Authenticate: Bearer resource_metadata` — follow the hint to `/.well-known/oauth-protected-resource`.
- Errors are JSON `{error:{code,message,hint,docs}}` — read `hint` before retrying.
