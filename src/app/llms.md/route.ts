import { HOME_MARKDOWN, LLMS_TXT } from "@/lib/markdown";

export async function GET() {
  return new Response(`${HOME_MARKDOWN}\n---\n${LLMS_TXT}`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
