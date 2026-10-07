import { SITE_URL } from "@/lib/site";

const PUBLISHER = "hormazdaruwala.vercel.app";

function trust() {
  return {
    identity: {
      domain: PUBLISHER,
      verified: "self-asserted",
      source: `${SITE_URL}/.well-known/oauth-protected-resource`,
    },
    attestations: [
      {
        type: "SelfAsserted",
        issuer: PUBLISHER,
        statement: "Resources in this catalog are published by the portfolio owner.",
      },
    ],
    provenance: { repository: "https://github.com/coderhormaz/Portfolio" },
  };
}

export async function GET() {
  return Response.json({
    specVersion: "0.91",
    site: SITE_URL,
    name: "Hormaz Daruwala AI catalog",
    entries: [
      {
        identifier: `urn:air:${PUBLISHER}:mcp:portfolio`,
        displayName: "Portfolio MCP",
        type: "application/mcp-server-card+json",
        url: `${SITE_URL}/.well-known/mcp/server-card.json`,
        description: "Query Hormaz Daruwala's profile, projects, and contact over MCP.",
        capabilities: ["get_profile", "list_projects", "get_contact", "ask_about_docs"],
        representativeQueries: [
          "What is Hormaz Daruwala's availability?",
          "Show AI projects from the portfolio",
        ],
        trustManifest: trust(),
      },
      {
        identifier: `urn:air:${PUBLISHER}:mcp:portfolio-docs`,
        displayName: "Portfolio Docs MCP",
        type: "application/mcp-server-card+json",
        url: `${SITE_URL}/.well-known/mcp/docs-server-card.json`,
        description: "Answer documentation questions from llms.txt, docs, and auth guides over MCP.",
        capabilities: ["ask_about_docs", "get_llms", "get_openapi"],
        representativeQueries: [
          "How do I authenticate against the portfolio API?",
          "What endpoints are in the OpenAPI spec?",
        ],
        trustManifest: trust(),
      },
      {
        identifier: `urn:air:${PUBLISHER}:agent:portfolio`,
        displayName: "Hormaz Daruwala Portfolio Agent",
        type: "application/a2a-agent-card+json",
        url: `${SITE_URL}/.well-known/agent-card.json`,
        description: "Answer questions about Hormaz Daruwala's profile, work, and contact paths.",
        capabilities: ["profile.lookup", "projects.search", "contact.validate", "ask.answer"],
        representativeQueries: [
          "Is Hormaz available for freelance Next.js work?",
          "What Web3 work has Hormaz shipped?",
        ],
        trustManifest: trust(),
      },
      {
        identifier: `urn:air:${PUBLISHER}:api:portfolio`,
        displayName: "Portfolio API",
        type: "application/openapi+json",
        url: `${SITE_URL}/openapi.json`,
        description: "Public read-only REST API with OpenAPI schema.",
        capabilities: ["getProfile", "listProjects", "validateContactInquiry"],
        representativeQueries: [
          "List the portfolio REST endpoints",
          "How do I page through projects?",
        ],
        trustManifest: trust(),
      },
    ],
  });
}
