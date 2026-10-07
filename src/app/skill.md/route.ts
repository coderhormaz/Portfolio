import { HOME_MARKDOWN } from "@/lib/markdown";

export async function GET() {
  return new Response(HOME_MARKDOWN, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
