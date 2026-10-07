import { clientProjects, personalProjects, profile, experiences } from "@/data/portfolio";
import { SITE_URL } from "@/lib/site";

function answerQuery(q: string) {
  const query = q.toLowerCase();
  const all = [...clientProjects, ...personalProjects];
  const hits = query
    ? all.filter((p) =>
        `${p.title} ${p.subtitle} ${p.description} ${p.tags.join(" ")}`.toLowerCase().includes(query.split(/\s+/)[0] || ""),
      )
    : all;
  const text = query.includes("contact") || query.includes("hire") || query.includes("email")
    ? `Contact ${profile.name} at ${profile.email} (${profile.location}, ${profile.availability}). Form: ${SITE_URL}/#contact.`
    : query.includes("web3") || query.includes("blockchain") || query.includes("solidity")
      ? `Web3 work: ${all.filter((p) => /base|solidity|web3|bnb|polygon|avax|arbitrum/i.test(p.tags.join(" ")) || /web3|blockchain|usdc|x402/i.test(p.description)).map((p) => p.title).slice(0, 5).join("; ")}.`
      : query.includes("experience") || query.includes("work history")
        ? `Roles: ${experiences.map((e) => `${e.role} @ ${e.org} (${e.period})`).join("; ")}.`
        : `${profile.name}: ${profile.tagline} Top projects: ${hits.slice(0, 3).map((p) => p.title).join("; ")}.`;
  return {
    text,
    sources: hits.slice(0, 3).map((p) => ({ title: p.title, url: p.link || SITE_URL })),
  };
}

function payload(q: string) {
  const a = answerQuery(q);
  return {
    _meta: { response_type: "answer", version: "nlweb-1.0", site: SITE_URL },
    query: q,
    answer: a.text,
    results: a.sources,
  };
}

async function handleAsk(q: string, streaming: boolean) {
  const data = payload(q);
  if (!streaming) return Response.json(data);
  const enc = new TextEncoder();
  const stream = new ReadableStream({
    start(c) {
      c.enqueue(enc.encode(`event: start\ndata: ${JSON.stringify({ _meta: data._meta })}\n\n`));
      for (const r of data.results) {
        c.enqueue(enc.encode(`event: result\ndata: ${JSON.stringify(r)}\n\n`));
      }
      c.enqueue(enc.encode(`event: complete\ndata: ${JSON.stringify({ answer: data.answer })}\n\n`));
      c.close();
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-cache" },
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || url.searchParams.get("query") || "";
  const accept = req.headers.get("accept") || "";
  const streaming = url.searchParams.get("streaming") === "true" || accept.includes("text/event-stream");
  return handleAsk(q, streaming);
}

export async function POST(req: Request) {
  const { getIdempotentResult, idempotencyKeyFrom, storeIdempotentResult } = await import("@/lib/agent-auth");
  const idemKey = idempotencyKeyFrom(req);
  const replay = getIdempotentResult(idemKey);
  if (replay) return replay;

  let body: { q?: string; query?: string; "prefer.streaming"?: boolean; prefer?: { streaming?: boolean } } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const q = body.q || body.query || "";
  const streaming = Boolean(body["prefer.streaming"] || body.prefer?.streaming);
  if (streaming) return handleAsk(q, true);
  const res = await handleAsk(q, false);
  if (idemKey) {
    const data = await res.clone().json().catch(() => null);
    storeIdempotentResult(idemKey, 200, data);
  }
  return res;
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: { Allow: "GET, POST, OPTIONS" } });
}
