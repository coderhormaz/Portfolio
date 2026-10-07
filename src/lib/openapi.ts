import { SITE_URL } from "@/lib/site";

const IDEM_PARAM = {
  name: "Idempotency-Key",
  in: "header",
  required: false,
  description:
    "Optional client-generated key (e.g. UUID) for safe retries of POST writes. Replays return the original response with Idempotent-Replay: true.",
  schema: { type: "string" },
};

const VERSIONING = [
  "Versioning: URL-path versioning. /api/* is v1 (current); /api/v1/* mirrors it with a {version:'v1'} envelope.",
  "Every API response carries API-Version: v1 and Deprecation: false headers.",
  "Breaking changes ship as a new path version with a 12-month Sunset notice via the Sunset response header and this changelog.",
  "Rate limits: 60 req/min demo per IP, advertised via RateLimit-Limit/Remaining/Reset headers; 429 carries Retry-After.",
  "Pagination: list endpoints use cursor pagination {limit, cursor, next_cursor, has_more}.",
  "Idempotency: POST writes accept Idempotency-Key; replays echo Idempotent-Replay: true.",
  "Async: POST /api/contact returns 202 + job_id with a Location header; poll GET /api/jobs/{id}.",
].join(" ");

export function openApiSpec() {
  return {
    openapi: "3.1.0",
    info: {
      title: "Hormaz Daruwala Portfolio API",
      version: "1.0.0",
      description: `Public read-only API for Hormaz Daruwala's portfolio: profile, projects, experience, contact validation, batch, jobs, sandbox, MCP, and NLWeb ask. See /docs and /developers. ${VERSIONING}`,
      contact: { name: "Hormaz Daruwala", url: SITE_URL },
      license: { name: "Demo - read-only", url: `${SITE_URL}/privacy` },
    },
    servers: [
      { url: SITE_URL, description: "Production (v1 current)" },
      { url: `${SITE_URL}/api/v1`, description: "Versioned v1 mirror with {version:'v1'} envelope" },
    ],
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
          required: ["name", "email"],
          properties: {
            name: { type: "string" },
            tagline: { type: "string" },
            roles: { type: "array", items: { type: "string" } },
            email: { type: "string", format: "email" },
            location: { type: "string" },
            availability: { type: "string" },
            site: { type: "string", format: "uri" },
            portfolio: { type: "string" },
            github: { type: "string", format: "uri" },
            linkedin: { type: "string", format: "uri" },
          },
        },
        Project: {
          type: "object",
          required: ["title", "description"],
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
        ProjectList: {
          type: "object",
          required: ["count", "projects", "limit", "cursor", "has_more"],
          properties: {
            count: { type: "integer", description: "Filtered result count." },
            total: { type: "integer", description: "Unfiltered total." },
            limit: { type: "integer" },
            cursor: { type: "string", description: "Echo of the request cursor." },
            next_cursor: { type: ["string", "null"], description: "Pass as cursor for the next page; null when done." },
            has_more: { type: "boolean" },
            projects: { type: "array", items: { $ref: "#/components/schemas/Project" } },
          },
        },
        ExperienceBundle: {
          type: "object",
          properties: {
            experiences: { type: "array", items: { type: "object" } },
            hackathons: { type: "array", items: { type: "object" } },
            skillGroups: { type: "array", items: { type: "object" } },
            education: { type: "array", items: { type: "object" } },
          },
        },
        ContactInfo: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
            location: { type: "string" },
            availability: { type: "string" },
            form: { type: "string", format: "uri" },
            api: { type: "string", format: "uri" },
            jobs: { type: "string" },
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
        ContactAccepted: {
          type: "object",
          required: ["ok", "job_id", "status", "poll_url"],
          properties: {
            ok: { type: "boolean" },
            queued: { type: "boolean" },
            job_id: { type: "string", description: "Poll GET /api/jobs/{job_id} until status is completed." },
            status: { type: "string", enum: ["processing", "completed"] },
            poll_url: { type: "string", format: "uri" },
            message: { type: "string" },
          },
        },
        JobStatus: {
          type: "object",
          required: ["job_id", "status", "poll_url"],
          properties: {
            job_id: { type: "string" },
            status: { type: "string", enum: ["processing", "completed"] },
            result: { type: ["object", "null"], description: "Present when status is completed." },
            poll_url: { type: "string", format: "uri" },
          },
        },
        Health: {
          type: "object",
          required: ["status", "site"],
          properties: {
            status: { type: "string", enum: ["ok"] },
            site: { type: "string", format: "uri" },
            time: { type: "string", format: "date-time" },
            endpoints: { type: "array", items: { type: "string" } },
            docs: { type: "string", format: "uri" },
            openapi: { type: "string", format: "uri" },
          },
        },
        Sandbox: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            base_url: { type: "string", format: "uri" },
            sandbox_base_url: { type: "string", format: "uri" },
            is_sandbox: { type: "boolean" },
            production: { type: "string", format: "uri" },
            how_to_use: { type: "array", items: { type: "string" } },
            rate_limit: { type: "string" },
          },
        },
        ApiIndex: {
          type: "object",
          properties: {
            ok: { type: "boolean" },
            message: { type: "string" },
            version: { type: "string" },
            endpoints: { type: "array", items: { type: "string" } },
            docs: { type: "string", format: "uri" },
            openapi: { type: "string", format: "uri" },
          },
        },
        IdentityInfo: {
          type: "object",
          properties: {
            sub: { type: "string" },
            mode: { type: "string" },
            identity_endpoint: { type: "string", format: "uri" },
            claim_endpoint: { type: "string", format: "uri" },
            events_endpoint: { type: "string", format: "uri" },
            how: { type: "string" },
          },
        },
        ClaimInfo: {
          type: "object",
          properties: {
            endpoint: { type: "string" },
            accepts: { type: "array", items: { type: "string" } },
            assertion_types_supported: { type: "array", items: { type: "string" } },
            how: { type: "string" },
          },
        },
        ClaimInput: {
          type: "object",
          required: ["assertion"],
          properties: {
            assertion: { type: "string", description: "ID-JAG or service credential." },
            identity_type: { type: "string", enum: ["anonymous", "identity_assertion", "service_auth"] },
          },
        },
        TokenResponse: {
          type: "object",
          required: ["access_token", "token_type"],
          properties: {
            access_token: { type: "string" },
            token_type: { type: "string" },
            expires_in: { type: "integer" },
            identity_type: { type: "string" },
          },
        },
        KeyResponse: {
          type: "object",
          required: ["api_key", "expires_in", "scopes"],
          properties: {
            api_key: { type: "string", description: "Self-serve demo key; send as x-api-key." },
            token_type: { type: "string" },
            expires_in: { type: "integer" },
            scopes: { type: "array", items: { type: "string" } },
            use: { type: "string" },
            docs: { type: "string", format: "uri" },
          },
        },
        AgentEvents: {
          type: "object",
          properties: {
            events: { type: "array", items: { type: "object" } },
            hint: { type: "string" },
          },
        },
        BatchInput: {
          type: "object",
          required: ["operations"],
          properties: {
            operations: {
              type: "array",
              minItems: 1,
              maxItems: 20,
              items: {
                type: "object",
                required: ["method", "path"],
                properties: {
                  method: { type: "string", enum: ["GET"] },
                  path: { type: "string", example: "/api/profile" },
                },
              },
            },
          },
        },
        BatchResult: {
          type: "object",
          required: ["count", "results"],
          properties: {
            count: { type: "integer" },
            results: {
              type: "array",
              items: {
                type: "object",
                required: ["path", "status", "body"],
                properties: {
                  path: { type: "string" },
                  status: { type: "integer" },
                  body: { type: "object" },
                },
              },
            },
          },
        },
        McpInfo: {
          type: "object",
          properties: {
            protocol: { type: "string" },
            transport: { type: "string" },
            name: { type: "string" },
            version: { type: "string" },
            card: { type: "string", format: "uri" },
            tools: { type: "array", items: { type: "object" } },
            how: { type: "string" },
          },
        },
        McpRpcResult: {
          type: "object",
          required: ["jsonrpc", "id"],
          properties: {
            jsonrpc: { type: "string", enum: ["2.0"] },
            id: {},
            result: { type: "object", description: "initialize result, tools list, or tool content." },
            error: { type: "object" },
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
        AskResponse: {
          type: "object",
          required: ["_meta", "query", "answer", "results"],
          properties: {
            _meta: {
              type: "object",
              properties: {
                response_type: { type: "string" },
                version: { type: "string" },
                site: { type: "string", format: "uri" },
              },
            },
            query: { type: "string" },
            answer: { type: "string" },
            results: { type: "array", items: { type: "object" } },
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
            "200": { description: "Profile", content: { "application/json": { schema: { $ref: "#/components/schemas/Profile" } } } },
          },
        },
      },
      "/api/projects": {
        get: {
          operationId: "listProjects",
          summary: "List projects",
          description: "Filter portfolio work by type (client|personal) and free-text query q. Cursor pagination via limit/cursor; follow next_cursor while has_more is true.",
          parameters: [
            { name: "type", in: "query", required: false, schema: { type: "string", enum: ["client", "personal"] }, description: "Project kind filter." },
            { name: "q", in: "query", required: false, schema: { type: "string" }, description: "Free-text search over title, tags, description." },
            { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 20 }, description: "Page size." },
            { name: "cursor", in: "query", required: false, schema: { type: "string", default: "0" }, description: "Opaque offset from the previous next_cursor." },
          ],
          responses: {
            "200": { description: "Project list page", content: { "application/json": { schema: { $ref: "#/components/schemas/ProjectList" } } } },
            "422": { description: "Bad cursor", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/experience": {
        get: {
          operationId: "getExperience",
          summary: "Get experience, hackathons, skills, education",
          description: "Returns work history, hackathon record, skill groups, and education. No auth required.",
          responses: {
            "200": { description: "Experience bundle", content: { "application/json": { schema: { $ref: "#/components/schemas/ExperienceBundle" } } } },
          },
        },
      },
      "/api/contact": {
        get: {
          operationId: "getContactInfo",
          summary: "Get contact info",
          description: "Returns public contact channels. No auth required.",
          responses: {
            "200": { description: "Contact info", content: { "application/json": { schema: { $ref: "#/components/schemas/ContactInfo" } } } },
          },
        },
        post: {
          operationId: "validateContactInquiry",
          summary: "Validate a contact inquiry (async job)",
          description: "Validates {name,email,message}. Returns 202 with job_id plus a Location header; poll GET /api/jobs/{id} until status is completed. Accepts Idempotency-Key for safe retries. No email is sent; sandbox-safe.",
          parameters: [IDEM_PARAM],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/ContactInput" } } },
          },
          responses: {
            "202": { description: "Accepted; poll job", content: { "application/json": { schema: { $ref: "#/components/schemas/ContactAccepted" } } } },
            "400": { description: "Invalid JSON", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            "422": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/jobs/{id}": {
        get: {
          operationId: "getJobStatus",
          summary: "Poll an async job",
          description: "Returns job status (processing|completed) and the result once completed.",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" }, description: "Job id from a 202 response." },
          ],
          responses: {
            "200": { description: "Job status", content: { "application/json": { schema: { $ref: "#/components/schemas/JobStatus" } } } },
            "404": { description: "Unknown job", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/batch": {
        post: {
          operationId: "runBatchReads",
          summary: "Run bulk reads",
          description: "Executes up to 20 allowlisted GET reads in one request. Accepts Idempotency-Key. Each result carries its own status and body.",
          parameters: [IDEM_PARAM],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/BatchInput" } } },
          },
          responses: {
            "200": { description: "Batch results", content: { "application/json": { schema: { $ref: "#/components/schemas/BatchResult" } } } },
            "400": { description: "Invalid JSON", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
            "422": { description: "Bad operations", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/health": {
        get: {
          operationId: "getHealth",
          summary: "Health check",
          description: "Returns service status and endpoint index. No auth required.",
          responses: {
            "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Health" } } } },
          },
        },
      },
      "/api/sandbox": {
        get: {
          operationId: "getSandbox",
          summary: "Sandbox description",
          description: "Describes the read-only sandbox/test environment and rate limits. No auth required.",
          responses: {
            "200": { description: "Sandbox info", content: { "application/json": { schema: { $ref: "#/components/schemas/Sandbox" } } } },
          },
        },
      },
      "/api": {
        get: {
          operationId: "getApiIndex",
          summary: "Authenticated API index",
          description: "Requires Authorization or x-api-key. Without credentials returns 401 with WWW-Authenticate: Bearer resource_metadata. See /auth.md.",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": { description: "Index", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiIndex" } } } },
            "401": { description: "Auth required", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/v1/profile": {
        get: {
          operationId: "getProfileV1",
          summary: "Get public profile (v1 versioned)",
          description: "Versioned mirror of getProfile with a {version:'v1'} envelope. No auth required.",
          responses: {
            "200": { description: "Versioned profile", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiIndex" } } } },
          },
        },
      },
      "/api/v1/projects": {
        get: {
          operationId: "listProjectsV1",
          summary: "List projects (v1 versioned)",
          description: "Versioned mirror of listProjects with cursor pagination and a {version:'v1'} envelope.",
          parameters: [
            { name: "type", in: "query", required: false, schema: { type: "string", enum: ["client", "personal"] }, description: "Project kind filter." },
            { name: "q", in: "query", required: false, schema: { type: "string" }, description: "Free-text search." },
            { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 50, default: 20 }, description: "Page size." },
            { name: "cursor", in: "query", required: false, schema: { type: "string", default: "0" }, description: "Opaque offset from the previous next_cursor." },
          ],
          responses: {
            "200": { description: "Versioned project page", content: { "application/json": { schema: { $ref: "#/components/schemas/ProjectList" } } } },
          },
        },
      },
      "/api/agent/identity": {
        get: {
          operationId: "getAgentIdentity",
          summary: "Agent identity metadata",
          description: "Returns identity_endpoint, claim_endpoint, events_endpoint for WorkOS auth.md discovery.",
          responses: {
            "200": { description: "Identity endpoints", content: { "application/json": { schema: { $ref: "#/components/schemas/IdentityInfo" } } } },
          },
        },
        post: {
          operationId: "mintDemoToken",
          summary: "Mint demo token",
          description: "Demo token mint for anonymous agents. Production uses claim endpoint.",
          responses: {
            "200": { description: "Token", content: { "application/json": { schema: { $ref: "#/components/schemas/TokenResponse" } } } },
          },
        },
      },
      "/api/agent/claim": {
        get: {
          operationId: "getClaimInfo",
          summary: "Claim info",
          description: "Describes accepted identity types and assertion formats.",
          responses: {
            "200": { description: "Claim info", content: { "application/json": { schema: { $ref: "#/components/schemas/ClaimInfo" } } } },
          },
        },
        post: {
          operationId: "claimAccessToken",
          summary: "Exchange assertion for access token",
          description: "Accepts {assertion, identity_type}. identity_type is one of anonymous, identity_assertion, service_auth. Accepts Idempotency-Key.",
          parameters: [IDEM_PARAM],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/ClaimInput" } } },
          },
          responses: {
            "200": { description: "Token", content: { "application/json": { schema: { $ref: "#/components/schemas/TokenResponse" } } } },
            "422": { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/agent/key": {
        post: {
          operationId: "issueDemoKey",
          summary: "Self-serve demo API key",
          description: "Issues a free self-serve demo key (x-api-key) for gated endpoints. Optional email. Accepts Idempotency-Key. Free tier: all reads are keyless.",
          parameters: [IDEM_PARAM],
          requestBody: {
            required: false,
            content: {
              "application/json": {
                schema: { type: "object", properties: { email: { type: "string", format: "email" } } },
              },
            },
          },
          responses: {
            "201": { description: "Key issued", content: { "application/json": { schema: { $ref: "#/components/schemas/KeyResponse" } } } },
            "422": { description: "Bad email", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          },
        },
      },
      "/api/agent/events": {
        get: {
          operationId: "listAgentEvents",
          summary: "List agent events",
          description: "Returns recent agent lifecycle events.",
          responses: {
            "200": { description: "Events", content: { "application/json": { schema: { $ref: "#/components/schemas/AgentEvents" } } } },
          },
        },
        post: {
          operationId: "emitAgentEvent",
          summary: "Emit agent event",
          description: "Accepts an agent lifecycle event payload.",
          responses: {
            "200": { description: "Received", content: { "application/json": { schema: { $ref: "#/components/schemas/AgentEvents" } } } },
          },
        },
      },
      "/api/mcp": {
        get: {
          operationId: "getMcpInfo",
          summary: "MCP server info",
          description: "Describes Streamable HTTP MCP tools. POST JSON-RPC for initialize, tools/list, tools/call.",
          responses: {
            "200": { description: "MCP info", content: { "application/json": { schema: { $ref: "#/components/schemas/McpInfo" } } } },
          },
        },
        post: {
          operationId: "postMcpRpc",
          summary: "MCP JSON-RPC",
          description: "Handles initialize, tools/list, tools/call for get_profile, list_projects, get_contact, ask_about_docs. Tools carry readOnlyHint/destructiveHint annotations and typed inputSchemas.",
          responses: {
            "200": { description: "JSON-RPC result", content: { "application/json": { schema: { $ref: "#/components/schemas/McpRpcResult" } } } },
          },
        },
      },
      "/api/docs-mcp": {
        get: {
          operationId: "getDocsMcpInfo",
          summary: "Docs MCP server info",
          description: "Documentation MCP surface: ask_about_docs, get_llms, get_openapi. Separate server from the product MCP.",
          responses: {
            "200": { description: "Docs MCP info", content: { "application/json": { schema: { $ref: "#/components/schemas/McpInfo" } } } },
          },
        },
        post: {
          operationId: "postDocsMcpRpc",
          summary: "Docs MCP JSON-RPC",
          description: "Handles initialize, tools/list, tools/call for the documentation MCP server.",
          responses: {
            "200": { description: "JSON-RPC result", content: { "application/json": { schema: { $ref: "#/components/schemas/McpRpcResult" } } } },
          },
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
          responses: {
            "200": { description: "Answer", content: { "application/json": { schema: { $ref: "#/components/schemas/AskResponse" } } } },
          },
        },
        post: {
          operationId: "askPost",
          summary: "NLWeb ask (POST)",
          description: "Accepts {q|query, prefer.streaming}. Returns {_meta, results} or SSE stream. Accepts Idempotency-Key for non-streaming calls.",
          parameters: [IDEM_PARAM],
          requestBody: {
            required: false,
            content: { "application/json": { schema: { $ref: "#/components/schemas/AskInput" } } },
          },
          responses: {
            "200": { description: "Answer", content: { "application/json": { schema: { $ref: "#/components/schemas/AskResponse" } } } },
          },
        },
      },
    },
  };
}
