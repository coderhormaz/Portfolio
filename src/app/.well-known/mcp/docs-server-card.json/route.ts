import { docsCard, serveCard } from "@/lib/server-card";

export async function GET(req: Request) {
  return serveCard(req, docsCard());
}
