import { markdownFor } from "@/lib/markdown";

export async function GET() {
  return new Response(markdownFor("/about") || "# About", {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
