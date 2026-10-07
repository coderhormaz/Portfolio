import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Developers — Hormaz Daruwala",
  description:
    "Hormaz Daruwala developer portal: public REST API, OpenAPI spec, MCP server, quickstart, sandbox, and agent auth for hormazdaruwala.vercel.app.",
  alternates: {
    canonical: `${SITE_URL}/developers`,
    types: { "text/markdown": `${SITE_URL}/developers.md` },
  },
};

export default function DevelopersPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-28 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#ff4d00]">
        Developers · Hormaz Daruwala
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
        Developer portal
      </h1>
      <p className="mt-4 leading-relaxed text-white/60">
        Everything an AI agent or developer needs to integrate with
        hormazdaruwala.vercel.app: a public read-only REST API, a typed
        OpenAPI specification, a Streamable HTTP MCP server, an NLWeb ask
        endpoint, sandbox documentation, and WorkOS auth.md agent
        authentication. No API key is needed for reads. All GET endpoints
        are CORS-open, rate-limited to a generous demo quota, and return
        structured JSON errors with codes, messages, and resolution hints
        instead of HTML error pages.
      </p>
      <h2 className="mt-10 text-2xl font-bold">Quickstart</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-white/70">
        <li>
          Fetch <code>GET /api/profile</code> for identity, roles, and availability.
        </li>
        <li>
          Fetch <code>GET /api/projects?type=client&amp;q=next</code> for filtered work.
        </li>
        <li>
          Read <code>/openapi.json</code> for the full typed schema with operationIds.
        </li>
        <li>
          Try the sandbox: <code>GET /api/sandbox</code> describes the test environment.
        </li>
        <li>
          For agents: read <code>/llms.txt</code>, then <code>/auth.md</code>, then call MCP at <code>/api/mcp</code>.
        </li>
      </ol>
      <h2 className="mt-10 text-2xl font-bold">Resources</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-white/70">
        <li><a className="underline" href="/openapi.json">OpenAPI spec (/openapi.json)</a></li>
        <li><a className="underline" href="/docs">API docs (/docs)</a></li>
        <li><a className="underline" href="/api/sandbox">Sandbox (/api/sandbox)</a></li>
        <li><a className="underline" href="/auth.md">Agent auth walkthrough (/auth.md)</a></li>
        <li><a className="underline" href="/.well-known/agent-card.json">A2A agent card</a></li>
        <li><a className="underline" href="/.well-known/mcp/server-card.json">MCP server card</a></li>
        <li><a className="underline" href="https://github.com/coderhormaz/Portfolio">Public source repo with AGENTS.md</a></li>
      </ul>
      <h2 className="mt-10 text-2xl font-bold">Authentication</h2>
      <p className="mt-3 leading-relaxed text-white/60">
        Public GET endpoints need no credentials. Authenticated entry
        points (<code>/api</code>, <code>/api/v1</code>, <code>/agent/identity</code>)
        return <code>401</code> with{" "}
        <code>WWW-Authenticate: Bearer resource_metadata=&quot;...oauth-protected-resource&quot;</code>{" "}
        so agents learn auth requirements from one request. Agent
        credential flow (anonymous, identity_assertion with ID-JAG, or
        service_auth) is documented in <a className="underline" href="/auth.md">/auth.md</a> with
        reachable identity, claim, and events endpoints. Self-serve a free
        demo key with <code>POST /api/agent/key</code> (free tier: all
        reads are keyless, no signup).
      </p>
      <h2 className="mt-10 text-2xl font-bold">Versioning, limits, retries</h2>
      <p className="mt-3 leading-relaxed text-white/60">
        URL-path versioning (<code>/api/*</code> v1 current, mirrored at{" "}
        <code>/api/v1/*</code>), <code>API-Version</code> +{" "}
        <code>Deprecation</code> headers, 12-month Sunset policy. Demo
        rate limit 60 req/min via <code>RateLimit-*</code> headers.
        Retries are safe: send <code>Idempotency-Key</code> on POST
        writes. Paginate lists with <code>limit/cursor</code>; bulk reads
        via <code>POST /api/batch</code>; poll long work at{" "}
        <code>GET /api/jobs/{"{id}"}</code>. Sandbox guide:{" "}
        <a className="underline" href="/sandbox">/sandbox</a>.
      </p>
    </section>
  );
}
