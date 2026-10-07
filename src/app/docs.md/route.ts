import { markdownFor } from "@/lib/markdown";

export async function GET() {
  return new Response(markdownFor("/docs") || "# Docs", {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
