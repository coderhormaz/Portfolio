import { clientProjects, personalProjects } from "@/data/portfolio";
import { jsonError } from "@/lib/agent-auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const q = (url.searchParams.get("q") || "").toLowerCase();
  const rawLimit = Number(url.searchParams.get("limit") || "20");
  const limit = Number.isFinite(rawLimit) ? Math.min(50, Math.max(1, Math.floor(rawLimit))) : 20;
  const rawCursor = url.searchParams.get("cursor") || "0";
  const offset = /^\d+$/.test(rawCursor) ? parseInt(rawCursor, 10) : 0;
  if (!/^\d+$/.test(rawCursor)) {
    return jsonError(
      "invalid_cursor",
      "Field 'cursor' must be an opaque offset string from a previous response (e.g. \"20\").",
      "Omit cursor for the first page; then pass next_cursor verbatim.",
      422,
    );
  }
  let all = [
    ...clientProjects.map((p) => ({ ...p, kind: "client" })),
    ...personalProjects.map((p) => ({ ...p, kind: "personal" })),
  ];
  const total = all.length;
  if (type === "client" || type === "personal") {
    all = all.filter((p) => p.kind === type);
  }
  if (q) {
    all = all.filter((p) =>
      `${p.title} ${p.subtitle} ${p.description} ${p.tags.join(" ")}`
        .toLowerCase()
        .includes(q),
    );
  }
  const filtered = all.length;
  const page = all.slice(offset, offset + limit);
  const nextOffset = offset + limit;
  return Response.json({
    count: filtered,
    total,
    limit,
    cursor: String(offset),
    next_cursor: nextOffset < filtered ? String(nextOffset) : null,
    has_more: nextOffset < filtered,
    projects: page,
  });
}
