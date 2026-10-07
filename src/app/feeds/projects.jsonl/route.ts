import { clientProjects, personalProjects } from "@/data/portfolio";
import { SITE_URL } from "@/lib/site";

export async function GET() {
  const lines = [...clientProjects, ...personalProjects].map((p) =>
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Project",
      name: p.title,
      description: p.description,
      url: p.link || SITE_URL,
      keywords: p.tags.join(", "),
    }),
  );
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8" },
  });
}
