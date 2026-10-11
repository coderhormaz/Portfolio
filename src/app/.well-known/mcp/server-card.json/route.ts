import { productCard, serveCard } from "@/lib/server-card";

export async function GET(req: Request) {
  return serveCard(req, productCard());
}
