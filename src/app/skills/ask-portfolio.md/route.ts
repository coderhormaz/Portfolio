import { SKILL_DOCS } from "@/lib/skills";

export async function GET() {
  return new Response(SKILL_DOCS["ask-portfolio"], {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
