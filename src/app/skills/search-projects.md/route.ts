import { SKILL_DOCS } from "@/lib/skills";

export async function GET() {
  return new Response(SKILL_DOCS["search-projects"], {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
