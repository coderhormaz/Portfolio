import { openApiSpec } from "@/lib/openapi";

export async function GET() {
  return Response.json(openApiSpec(), {
    headers: { "Content-Type": "application/json" },
  });
}
