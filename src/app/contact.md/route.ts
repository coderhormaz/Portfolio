import { markdownFor } from "@/lib/markdown";

export async function GET() {
  return new Response(markdownFor("/contact") || "# Contact", {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
