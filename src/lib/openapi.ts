import { SITE_URL } from "@/lib/site";

export function openApiSpec() {
  return {
    openapi: "3.1.0",
    info: {
      title: "Hormaz Daruwala Portfolio API",
      version: "1.0.0",
      description:
        "Public read-only API for Hormaz Daruwala's portfolio: profile, projects, experience, contact validation, sandbox, MCP, and NLWeb ask. See /docs and /developers.",
      contact: { name: "Hormaz Daruwala", url: SITE_URL },
      license: { name: "Demo - read-only", url: `${SITE_URL}/privacy` },
    },
    servers: [{ url: SITE_URL, description: "Production" }],
    security: [{ bearerAuth: [] }, { apiKeyAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        apiKeyAuth: { type: "apiKey", in: "header", name: "x-api-key" },
      },
      schemas: {
        Error: {
          type: "object",
          required: ["error"],
          properties: {
            error: {
              type: "object",
              required: ["code", "message", "hint"],
              properties: {
                code: { type: "string", example: "invalid_email" },
                message: { type: "string" },
                hint: { type: "string" },
                docs: { type: "string", format: "uri" },
              },
            },
          },
        },
        Profile: {
          type: "object",
          properties: {
            name: { type: "string" },
            tagline: { type: "string" },
            roles: { type: "array", items: { type: "string" } },
            email: { type: "string", format: "email" },
            location: { type: "string" },
            availability: { type: "string" },
            site: { type: "string", format: "uri" },
          },
        },
        Project: {
          type: "object",
          properties: {
            title: { type: "string" },
            subtitle: { type: "string" },
            description: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
            link: { type: "string" },
            repo: { type: "string" },
            year: { type: "string" },
            kind: { type: "string", enum: ["client", "personal"] },
          },
        },
        ContactInput: {
          type: "object",
          required: ["name", "email", "message"],
          properties: {
            name: { type: "string", minLength: 2 },
            email: { type: "string", format: "email" },
            message: { type: "string", minLength: 10 },
          },
        },
        AskInput: {
          type: "object",
          properties: {
            q: { type: "string" },
            query: { type: "string" },
            "prefer.streaming": { type: "boolean" },
          },
        },
      },
    },
    paths: {
      "/api/profile": {
        get: {
          operationId: "getProfile",
          summary: "Get public profile",
          description: "Returns identity, roles, availability, and links. No auth required.",
          responses: {
            "200": {
              description: "Profile",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Profile" } } },
            },
          },
        },
      },
      "/api/projects": {
        get: {
          operationId: "listProjects",
          summary: "List projects",
          description: "Filter portfolio work by type (client|personal) and free-text query q.",
          parameters: [
            { name: "type", in: "query", required: false, schema: { type: "string", enum: ["client", "personal"] }, description: "Project kind filter." },
            { name: "q", in: "query", required: false, schema: { type: "string" }, description: "Free-text search over title, tags, description." },
          ],
          responses: {
            "200": {
              description: "Project list",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      count: { type: "integer" },
                      projects: { type: "array", items: { $ref: "#/components/schemas/Project" } },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/experience": {
        get: {
          operationId: "getExperience",
          summary: "Get experience, hackathons, skills, education",
          description: "Returns work history, hackathon record, skill groups, and education. No auth required.",
          responses: { "200": { description: "Experience bundle" } },
        },
      },
      "/api/contact": {
        get: {
          operationId: "getContactInfo",
          summary: "Get contact info",
          description: "Returns public contact channels. No auth required.",
          responses: { "200": { description: "Contact info" } },
        },
        post: {
          operationId: "validateContactInquiry",
          summary: "Validate a contact inquiry",
          description: "Validates {name,email,message}. Returns 202 when valid (no email is sent; sandbox-safe). Returns structured JSON errors otherwise.",
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/ContactInput" } } },
          },
          responses: {
            "202": { description: "Validated" },
            "400": { description: "Invalid JSON", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            "422": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/health": {
        get: {
          operationId: "getHealth",
          summary: "Health check",
          description: "Returns service status and endpoint index. No auth required.",
          responses: { "200": { description: "OK" } },
        },
      },
      "/api/sandbox": {
        get: {
          operationId: "getSandbox",
          summary: "Sandbox description",
          description: "Describes the read-only sandbox/test environment and rate limits. No auth required.",
          responses: { "200": { description: "Sandbox info" } },
        },
      },
      "/api": {
        get: {
          operationId: "getApiIndex",
          summary: "Authenticated API index",
          description: "Requires Authorization or x-api-key. Without credentials returns 401 with WWW-Authenticate: Bearer resource_metadata. See /auth.md.",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": { description: "Index" },
            "401": { description: "Auth required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/agent/identity": {
        get: {
          operationId: "getAgentIdentity",
          summary: "Agent identity metadata",
          description: "Returns identity_endpoint, claim_endpoint, events_endpoint for WorkOS auth.md discovery.",
          responses: { "200": { description: "Identity endpoints" } },
        },
        post: {
          operationId: "mintDemoToken",
          summary: "Mint demo token",
          description: "Demo token mint for anonymous agents. Production uses claim endpoint.",
          responses: { "200": { description: "Token" } },
        },
      },
      "/api/agent/claim": {
        get: {
          operationId: "getClaimInfo",
          summary: "Claim info",
          description: "Describes accepted identity types and assertion formats.",
          responses: { "200": { description: "Claim info" } },
        },
        post: {
          operationId: "claimAccessToken",
          summary: "Exchange assertion for access token",
          description: "Accepts {assertion, identity_type}. identity_type is one of anonymous, identity_assertion, service_auth.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["assertion"],
                  properties: {
                    assertion: { type: "string" },
                    identity_type: { type: "string", enum: ["anonymous", "identity_assertion", "service_auth"] },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Token" },
            "422": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/agent/events": {
        get: {
          operationId: "listAgentEvents",
          summary: "List agent events",
          description: "Returns recent agent lifecycle events.",
          responses: { "200": { description: "Events" } },
        },
        post: {
          operationId: "emitAgentEvent",
          summary: "Emit agent event",
          description: "Accepts an agent lifecycle event payload.",
          responses: { "200": { description: "Received" } },
        },
      },
      "/api/mcp": {
        get: {
          operationId: "getMcpInfo",
          summary: "MCP server info",
          description: "Describes Streamable HTTP MCP tools. POST JSON-RPC for initialize, tools/list, tools/call.",
          responses: { "200": { description: "MCP info" } },
        },
        post: {
          operationId: "postMcpRpc",
          summary: "MCP JSON-RPC",
          description: "Handles initialize, tools/list, tools/call for get_profile, list_projects, get_contact, ask_about_docs.",
          responses: { "200": { description: "JSON-RPC result" } },
        },
      },
      "/ask": {
        get: {
          operationId: "askGet",
          summary: "NLWeb ask (GET)",
          description: "Accepts ?q= natural language query. Returns {_meta, results}. SSE when Accept: text/event-stream.",
          parameters: [
            { name: "q", in: "query", required: false, schema: { type: "string" }, description: "Natural-language question." },
          ],
          responses: { "200": { description: "Answer" } },
        },
        post: {
          operationId: "askPost",
          summary: "NLWeb ask (POST)",
          description: "Accepts {q|query, prefer.streaming}. Returns {_meta, results} or SSE stream.",
          requestBody: {
            required: false,
            content: { "application/json": { schema: { $ref: "#/components/schemas/AskInput" } } },
          },
          responses: { "200": { description: "Answer" } },
        },
      },
    },
  };
}
