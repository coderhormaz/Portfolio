import { LLMS_TXT } from "@/lib/markdown";

export async function GET() {
  return new Response(LLMS_TXT, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
