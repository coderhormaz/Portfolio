import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sandbox — Hormaz Daruwala",
  description:
    "Hormaz Daruwala API sandbox: safe test endpoints, try-it examples, rate limits, and how to exercise the API without side effects.",
  alternates: {
    canonical: `${SITE_URL}/sandbox`,
    types: { "text/markdown": `${SITE_URL}/sandbox.md` },
  },
};

export default function SandboxPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-28 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#ff4d00]">
        Sandbox · Hormaz Daruwala
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Sandbox / test environment</h1>
      <p className="mt-4 leading-relaxed text-white/60">
        Every read endpoint on hormazdaruwala.vercel.app is safe to call:
        no auth, no side effects, demo rate limit of 60 requests per
        minute advertised via RateLimit headers. Writes are sandbox-safe
        by design: POST /api/contact only validates and returns 202 with
        a pollable job_id (poll GET /api/jobs/{"{id}"}), POST /api/batch
        only runs allowlisted reads, and MCP tools are all read-only
        (readOnlyHint). Nothing here sends email or mutates data, so
        agents can exercise the full surface without touching production.
        Machine-readable sandbox description lives at{" "}
        <a className="underline" href="/api/sandbox">GET /api/sandbox</a>{" "}
        and the markdown twin at <a className="underline" href="/sandbox.md">/sandbox.md</a>.
      </p>
      <h2 className="mt-10 text-2xl font-bold">Try it</h2>
      <pre className="mt-3 overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-xs text-white/70">
{`# safe reads
curl https://hormazdaruwala.vercel.app/api/profile
curl "https://hormazdaruwala.vercel.app/api/projects?q=ai&limit=5"

# sandbox-safe write: validates, returns 202 + job_id + Location
curl -i -X POST https://hormazdaruwala.vercel.app/api/contact \\
  -H 'Content-Type: application/json' \\
  -H 'Idempotency-Key: demo-001' \\
  -d '{"name":"Ada","email":"ada@example.com","message":"Freelance Next.js build, Q1 timeline"}'

# poll the job
curl https://hormazdaruwala.vercel.app/api/jobs/<job_id>

# self-serve demo key for gated endpoints
curl -X POST https://hormazdaruwala.vercel.app/api/agent/key \\
  -H 'Content-Type: application/json' -d '{}'`}
      </pre>
      <p className="mt-6 text-white/60">
        Versioning: <code>/api/*</code> is v1 current, mirrored at{" "}
        <code>/api/v1/*</code>; every response carries{" "}
        <code>API-Version: v1</code> and <code>Deprecation: false</code>.
        Full policy in <a className="underline" href="/docs">/docs</a> and{" "}
        <a className="underline" href="/openapi.json">/openapi.json</a>.
      </p>
    </section>
  );
}
