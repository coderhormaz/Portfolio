import { LLMS_FULL } from "@/lib/markdown";

export async function GET() {
  return new Response(LLMS_FULL, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
