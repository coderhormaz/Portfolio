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

function entries() {
  return [
    {
      "@context": "https://agenticresourcediscovery.org/context/v1",
      identifier: `urn:air:${PUBLISHER}:mcp:portfolio`,
      displayName: "Portfolio MCP",
      type: "application/mcp-server-card+json",
      url: `${SITE_URL}/.well-known/mcp/server-card.json`,
      description: "Query Hormaz Daruwala's profile, projects, and contact over MCP (Streamable HTTP).",
      capabilities: ["get_profile", "list_projects", "get_contact", "ask_about_docs"],
      representativeQueries: [
        "What is Hormaz Daruwala's availability?",
        "Show AI projects from the portfolio",
        "How do I contact Hormaz about freelance work?",
      ],
      trustManifest: trust(),
    },
    {
      "@context": "https://agenticresourcediscovery.org/context/v1",
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
      "@context": "https://agenticresourcediscovery.org/context/v1",
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
      "@context": "https://agenticresourcediscovery.org/context/v1",
      identifier: `urn:air:${PUBLISHER}:skill:get-profile`,
      displayName: "get-profile",
      type: "application/ai-skill+md",
      url: `${SITE_URL}/skills/get-profile.md`,
      description: "Fetch Hormaz Daruwala's public profile, roles, and availability.",
      capabilities: ["profile.lookup"],
      representativeQueries: [
        "Get the portfolio owner's profile",
        "Is Hormaz open to full-time roles?",
      ],
      trustManifest: trust(),
    },
    {
      "@context": "https://agenticresourcediscovery.org/context/v1",
      identifier: `urn:air:${PUBLISHER}:skill:search-projects`,
      displayName: "search-projects",
      type: "application/ai-skill+md",
      url: `${SITE_URL}/skills/search-projects.md`,
      description: "Search portfolio projects by kind and keyword.",
      capabilities: ["projects.search"],
      representativeQueries: [
        "Show client Next.js platforms",
        "Find hackathon AI builds",
      ],
      trustManifest: trust(),
    },
    {
      "@context": "https://agenticresourcediscovery.org/context/v1",
      identifier: `urn:air:${PUBLISHER}:skill:validate-contact`,
      displayName: "validate-contact",
      type: "application/ai-skill+md",
      url: `${SITE_URL}/skills/validate-contact.md`,
      description: "Validate a freelance or hiring inquiry before sending.",
      capabilities: ["contact.validate"],
      representativeQueries: [
        "Validate a hiring inquiry for Hormaz",
        "Check this outreach message before sending",
      ],
      trustManifest: trust(),
    },
    {
      "@context": "https://agenticresourcediscovery.org/context/v1",
      identifier: `urn:air:${PUBLISHER}:skill:ask-portfolio`,
      displayName: "ask-portfolio",
      type: "application/ai-skill+md",
      url: `${SITE_URL}/skills/ask-portfolio.md`,
      description: "Ask natural-language questions about experience and hiring.",
      capabilities: ["ask.answer"],
      representativeQueries: [
        "What production experience does Hormaz have?",
        "Summarize the portfolio for a hiring manager",
      ],
      trustManifest: trust(),
    },
    {
      "@context": "https://agenticresourcediscovery.org/context/v1",
      identifier: `urn:air:${PUBLISHER}:api:portfolio`,
      displayName: "Portfolio API",
      type: "application/openapi+json",
      url: `${SITE_URL}/openapi.json`,
      description: "Public read-only REST API: profile, projects, experience, contact, batch, jobs, MCP, ask.",
      capabilities: ["getProfile", "listProjects", "validateContactInquiry"],
      representativeQueries: [
        "List the portfolio REST endpoints",
        "How do I page through projects?",
      ],
      trustManifest: trust(),
    },
  ];
}

export async function GET() {
  return Response.json({
    specVersion: "0.91",
    site: SITE_URL,
    name: "Hormaz Daruwala Portfolio ARD catalog",
    description:
      "Agentic Resource Discovery catalog for hormazdaruwala.vercel.app: MCP servers, agent card, skills, APIs.",
    entries: entries(),
  });
}
