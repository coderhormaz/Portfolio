import { markdownFor } from "@/lib/markdown";

export async function GET() {
  return new Response(markdownFor("/privacy") || "# Privacy", {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
