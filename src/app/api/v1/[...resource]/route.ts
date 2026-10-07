import { profile, clientProjects, personalProjects, experiences } from "@/data/portfolio";
import { SITE_URL } from "@/lib/site";
import { jsonError } from "@/lib/agent-auth";

function envelope(resource: string, data: unknown) {
  return { version: "v1", resource, data, latest: `${SITE_URL}/api/${resource}` };
}

export async function GET(req: Request, { params }: { params: Promise<{ resource: string[] }> }) {
  const { resource } = await params;
  const name = resource[0];
  const url = new URL(req.url);
  if (name === "profile") return Response.json(envelope("profile", { profile }));
  if (name === "experience") return Response.json(envelope("experience", { experiences }));
  if (name === "health") return Response.json(envelope("health", { status: "ok", site: SITE_URL }));
  if (name === "sandbox") {
    return Response.json(envelope("sandbox", { name: "Portfolio API sandbox", base_url: `${SITE_URL}/api/v1`, is_sandbox: true }));
  }
  if (name === "contact") {
    return Response.json(envelope("contact", { email: profile.email, location: profile.location, availability: profile.availability }));
  }
  if (name === "projects") {
    const type = url.searchParams.get("type");
    const q = (url.searchParams.get("q") || "").toLowerCase();
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") || "20") || 20));
    const offset = /^\d+$/.test(url.searchParams.get("cursor") || "0") ? parseInt(url.searchParams.get("cursor") || "0", 10) : 0;
    let all = [
      ...clientProjects.map((p) => ({ ...p, kind: "client" })),
      ...personalProjects.map((p) => ({ ...p, kind: "personal" })),
    ];
    if (type === "client" || type === "personal") all = all.filter((p) => p.kind === type);
    if (q) all = all.filter((p) => `${p.title} ${p.subtitle} ${p.description} ${p.tags.join(" ")}`.toLowerCase().includes(q));
    const page = all.slice(offset, offset + limit);
    return Response.json(
      envelope("projects", {
        count: all.length, limit, cursor: String(offset),
        next_cursor: offset + limit < all.length ? String(offset + limit) : null,
        has_more: offset + limit < all.length, projects: page,
      }),
    );
  }
  return jsonError(
    "not_found",
    `Unknown v1 resource '${name}'.`,
    "Versioned resources: profile, projects, experience, contact, health, sandbox under /api/v1/.",
    404,
  );
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: { Allow: "GET, OPTIONS" } });
}
