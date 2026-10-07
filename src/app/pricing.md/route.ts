import { PRICING_MD } from "@/lib/markdown";

export async function GET() {
  return new Response(PRICING_MD, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
