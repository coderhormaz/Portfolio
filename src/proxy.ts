import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { HOME_MARKDOWN, markdownFor } from "@/lib/markdown";

const SITE = "https://hormazdaruwala.vercel.app";
const BOT_UAS = [
  "gptbot",
  "claudebot",
  "chatgpt-user",
  "perplexitybot",
  "google-extended",
  "applebot-extended",
  "ora-agent",
  "deepseekbot",
];

function linkHeader(path: string): string {
  const md = path.endsWith(".md") || path.endsWith(".txt") ? path : "/index.md";
  return [
    `</sitemap.xml>; rel="sitemap"`,
    `<${md}>; rel="alternate"; type="text/markdown"`,
    `<${SITE}/openapi.json>; rel="service-desc"`,
    `<${SITE}/.well-known/api-catalog>; rel="service-desc"`,
  ].join(", ");
}

function withLink(res: NextResponse, path: string): NextResponse {
  res.headers.set("Link", linkHeader(path));
  const vary = res.headers.get("Vary");
  res.headers.set("Vary", vary ? `${vary}, Accept` : "Accept");
  return res;
}

function markdownResponse(body: string, status = 200): NextResponse {
  const res = new NextResponse(body, { status });
  res.headers.set("Content-Type", "text/markdown; charset=utf-8");
  res.headers.set("Vary", "Accept");
  return res;
}

function isBot(ua: string): boolean {
  const l = ua.toLowerCase();
  return BOT_UAS.some((b) => l.includes(b));
}

const KNOWN_EXACT = new Set([
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/pricing",
  "/docs",
  "/developers",
  "/ask",
  "/openapi.json",
  "/plugin.json",
  "/schemamap.xml",
  "/sitemap.xml",
  "/robots.txt",
  "/llms.txt",
  "/llms-full.txt",
  "/llms.md",
  "/auth.md",
  "/pricing.md",
  "/index.md",
  "/agents.md",
  "/agent.md",
  "/developer.md",
  "/developers.md",
  "/api.md",
  "/skill.md",
  "/docs.md",
  "/about.md",
  "/contact.md",
  "/privacy.md",
  "/api",
  "/api/v1",
  "/v1",
  "/v2",
  "/agent/identity",
  "/agent/auth",
  "/api/profile",
  "/api/projects",
  "/api/experience",
  "/api/contact",
  "/api/health",
  "/api/sandbox",
  "/api/mcp",
  "/api/agent/identity",
  "/api/agent/claim",
  "/api/agent/events",
  "/api/llms.txt",
  "/docs/llms.txt",
  "/developers/llms.txt",
  "/.well-known/ard.json",
  "/.well-known/agent-card.json",
  "/.well-known/agent-skills/index.json",
  "/.well-known/mcp",
  "/.well-known/mcp/server-card.json",
  "/.well-known/api-catalog",
  "/.well-known/oauth-protected-resource",
  "/.well-known/oauth-authorization-server",
  "/.well-known/http-message-signatures-directory",
  "/.well-known/ai-catalog.json",
  "/.well-known/llms.txt",
  "/.well-known/jwks.json",
  "/feeds/projects.jsonl",
  "/feeds/profile.jsonl",
  "/feeds/pricing.jsonl",
]);

function isKnown(path: string): boolean {
  if (KNOWN_EXACT.has(path)) return true;
  if (path.startsWith("/.well-known/")) return true;
  if (path.startsWith("/api/")) return true;
  if (path.startsWith("/feeds/")) return true;
  if (path.endsWith(".md") || path.endsWith(".txt")) {
    const base = path.replace(/\.md$/, "").replace(/\.txt$/, "");
    if (KNOWN_EXACT.has(base) || KNOWN_EXACT.has(`${base}.md`)) return true;
  }
  if (path.startsWith("/_next/")) return true;
  if (/\.(png|jpg|jpeg|svg|ico|mp4|pdf|webmanifest|xml|json)$/.test(path)) return true;
  return false;
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const path = url.pathname;
  const accept = request.headers.get("accept") || "";
  const ua = request.headers.get("user-agent") || "";
  const wantsMarkdown = accept.includes("text/markdown");
  const bot = isBot(ua);

  // ?mode=agent on homepage -> structured machine-readable view
  if (path === "/" && url.searchParams.get("mode") === "agent") {
    const res = NextResponse.json({
      site: SITE,
      name: "Hormaz Daruwala — Full-Stack, Web3 & Design Engineer",
      description:
        "Mumbai engineer: Next.js platforms, Web3, mobile. 5+ yrs, 15+ hackathons, open freelance.",
      api_base: `${SITE}/api`,
      endpoints: {
        profile: `${SITE}/api/profile`,
        projects: `${SITE}/api/projects?type=client&q=next`,
        experience: `${SITE}/api/experience`,
        contact: `${SITE}/api/contact`,
        health: `${SITE}/api/health`,
        sandbox: `${SITE}/api/sandbox`,
        mcp: `${SITE}/api/mcp`,
        ask: `${SITE}/ask`,
      },
      authentication: {
        required_for_reads: false,
        gated: [`${SITE}/api`, `${SITE}/api/v1`],
        hint: '401 + WWW-Authenticate: Bearer resource_metadata="<prm>"',
        resource_metadata: `${SITE}/.well-known/oauth-protected-resource`,
        walkthrough: `${SITE}/auth.md`,
      },
      docs: {
        llms: `${SITE}/llms.txt`,
        full: `${SITE}/llms-full.txt`,
        docs: `${SITE}/docs`,
        developers: `${SITE}/developers`,
        openapi: `${SITE}/openapi.json`,
        pricing: `${SITE}/pricing.md`,
      },
      capabilities: ["profile.lookup", "projects.search", "contact.validate", "ask.answer", "mcp.tools"],
    });
    res.headers.set("Vary", "Accept");
    return withLink(res, path);
  }

  // Markdown negotiation on homepage (acceptmarkdown.com check)
  if (path === "/" && wantsMarkdown) {
    const res = markdownResponse(HOME_MARKDOWN);
    return withLink(res, path);
  }

  // Bot-UA markdown serving on homepage
  if (path === "/" && bot) {
    const res = markdownResponse(HOME_MARKDOWN);
    return withLink(res, path);
  }

  // Generic .md twin fallback: /foo -> markdown twin when Accept markdown or direct .md hit
  if (path.endsWith(".md")) {
    const base = path.replace(/\.md$/, "") || "/";
    const md = markdownFor(path) || markdownFor(base === "" ? "/" : base);
    if (md) return withLink(markdownResponse(md), path);
    if (wantsMarkdown || bot) {
      return withLink(
        markdownResponse(
          `# Not found\n\nNo markdown twin for ${path}. See /llms.txt, /docs, or /sitemap.xml.\n`,
          404,
        ),
        path,
      );
    }
  }

  // Agent-friendly 404 markdown for unknown paths
  if (!isKnown(path) && (wantsMarkdown || bot)) {
    return withLink(
      markdownResponse(
        `# Not found\n\n${path} does not exist on hormazdaruwala.vercel.app.\n\n- Agent index: ${SITE}/llms.txt\n- Docs: ${SITE}/docs\n- Sitemap: ${SITE}/sitemap.xml\n`,
        404,
      ),
      path,
    );
  }

  // Pass through + Link/Vary headers
  return withLink(NextResponse.next(), path);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|mp4|pdf)$).*)"],
};
