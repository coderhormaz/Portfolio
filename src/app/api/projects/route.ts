import { clientProjects, personalProjects } from "@/data/portfolio";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const q = (url.searchParams.get("q") || "").toLowerCase();
  let all = [
    ...clientProjects.map((p) => ({ ...p, kind: "client" })),
    ...personalProjects.map((p) => ({ ...p, kind: "personal" })),
  ];
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
  return Response.json({ count: all.length, projects: all });
}
