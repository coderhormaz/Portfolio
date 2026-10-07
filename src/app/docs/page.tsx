import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "API Docs — Hormaz Daruwala",
  description:
    "Hormaz Daruwala API documentation: authentication, endpoints, example requests, errors, sandbox, and MCP for hormazdaruwala.vercel.app.",
  alternates: {
    canonical: `${SITE_URL}/docs`,
    types: { "text/markdown": `${SITE_URL}/docs.md` },
  },
};

const endpoints = [
  { m: "GET", p: "/api/profile", d: "Public profile, roles, availability. No auth." },
  { m: "GET", p: "/api/projects?type=client&q=next", d: "Filter work by kind and text." },
  { m: "GET", p: "/api/experience", d: "Experience, hackathons, skills, education." },
  { m: "GET", p: "/api/contact", d: "Public contact channels." },
  { m: "POST", p: "/api/contact", d: "{name,email,message} validation, 202 on success." },
  { m: "GET", p: "/api/health", d: "Status + endpoint index." },
  { m: "GET", p: "/api/sandbox", d: "Sandbox/test environment description." },
  { m: "POST", p: "/ask", d: 'NLWeb natural-language ask: {q:"What did Hormaz ship?"}' },
  { m: "POST", p: "/api/mcp", d: "MCP JSON-RPC: initialize, tools/list, tools/call." },
];

export default function DocsPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-28 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#ff4d00]">
        Docs · Hormaz Daruwala
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">API documentation</h1>
      <p className="mt-4 leading-relaxed text-white/60">
        The Hormaz Daruwala portfolio exposes a public read-only REST API
        plus MCP and NLWeb surfaces. Base URL is{" "}
        <code>https://hormazdaruwala.vercel.app</code>. Authentication is
        not required for reads; authenticated entry points return a
        spec-shaped <code>401 + WWW-Authenticate</code> hint pointing at
        RFC 9728 protected-resource metadata. Every error is structured
        JSON with <code>code</code>, <code>message</code>, and{" "}
        <code>hint</code> fields so agents can recover without scraping HTML.
      </p>
      <h2 className="mt-10 text-2xl font-bold">Endpoints</h2>
      <div className="mt-4 space-y-3">
        {endpoints.map((e) => (
          <div key={e.p} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="font-mono text-sm">
              <span className="mr-2 rounded bg-[#ff4d00]/20 px-2 py-0.5 text-[#ff8a4d]">{e.m}</span>
              <code>{e.p}</code>
            </p>
            <p className="mt-1 text-sm text-white/60">{e.d}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-10 text-2xl font-bold">Example requests</h2>
      <pre className="mt-3 overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-xs text-white/70">
{`curl https://hormazdaruwala.vercel.app/api/profile
curl "https://hormazdaruwala.vercel.app/api/projects?type=personal&q=ai"
curl -X POST https://hormazdaruwala.vercel.app/api/contact \\
  -H 'Content-Type: application/json' \\
  -d '{"name":"Ada","email":"ada@example.com","message":"Freelance Next.js build, Q1 timeline"}'
curl -X POST https://hormazdaruwala.vercel.app/ask \\
  -H 'Content-Type: application/json' \\
  -d '{"q":"What Web3 work has Hormaz shipped?"}'`}
      </pre>
      <h2 className="mt-10 text-2xl font-bold">Errors</h2>
      <p className="mt-3 leading-relaxed text-white/60">
        Errors always return JSON:{" "}
        <code>{`{"error":{"code":"invalid_email","message":"...","hint":"...","docs":".../docs"}}`}</code>.
        Common codes: <code>invalid_json</code>, <code>invalid_name</code>,{" "}
        <code>invalid_email</code>, <code>invalid_message</code>,{" "}
        <code>unauthorized</code>, <code>not_found</code>. Send{" "}
        <code>Accept: text/markdown</code> to receive markdown error bodies
        on any route including 404s.
      </p>
      <p className="mt-6 text-white/60">
        Full typed schema: <a className="underline" href="/openapi.json">/openapi.json</a> ·
        Agent auth: <a className="underline" href="/auth.md">/auth.md</a> ·
        Source + AGENTS.md:{" "}
        <a className="underline" href="https://github.com/coderhormaz/Portfolio">github.com/coderhormaz/Portfolio</a>
      </p>
    </section>
  );
}
